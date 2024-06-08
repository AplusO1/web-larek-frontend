import './scss/styles.scss'; // Импорт стилей

import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/Events';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Card, CardPreview, CardBasket } from './components/Card';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { ICard, IOrderForm } from './types';
import { Basket } from './components/Basket';
import { Order } from './components/OrderForm';
import { Contacts } from './components/ContactForm';
import { Success } from './components/Success';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); // Шаблон каталога главной страницы
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); // Шаблон превью карточки
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket'); // Шаблон корзины
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); // Шаблон карточек в корзине
const orderTemplate = ensureElement<HTMLTemplateElement>('#order'); //Шаблон формы заказа
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); //Шаблон формы контактов
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); //Шаблон формы успешного заказа
const events = new EventEmitter(); // Создаем переменную управления событиями
const appState = new AppState({}, events); // Создаем переменную модели данных
const api = new WebLarekApi(CDN_URL, API_URL); // Создаем переменную управления Апи
const page = new Page(document.body, events); // Создаем переменную главной страницы
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); // Создаем переменную модального окна
const basket = new Basket(cloneTemplate(basketTemplate), events); // Создаем переменную корзины
const delivery = new Order(cloneTemplate(orderTemplate), events); //Создаем переменную формы доставки
const contact = new Contacts(cloneTemplate(contactsTemplate), events); //Создаем переменную формы контактов

// Получение и отображение списка карточек
api
	.getCardList()
	.then(appState.setCatalog.bind(appState))
	.catch((err) => {
		console.log(err);
	});

events.on('items:changed', () => {
	page.catalog = appState.cardList.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// Получение данных и открытие превью карточки
events.on('card:select', (item: ICard) => {
	appState.setPreview(item);
});

events.on('preview:changed', (item: ICard) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		}),
	});
	// Отключение кнопки если товар уже добавлен в корзину и если товар бесценный
	if (
		appState.basket.some((basketItem) => basketItem.id === item.id) ||
		item.price === null
	) {
		card.disableButton();
	}
});

// Блокируем прокрутку страницы если открыто модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем прокрутку страницы если закрыто модальное окно
events.on('modal:close', () => {
	page.locked = false;
});

// Добавление товара в заказ и корзину, обновление счетчика корзины на главной страницы
events.on('card:add', (item: ICard) => {
	console.log(`card:add event triggered for item ${item.id}`);
	appState.addCardToBasket(item);
	page.counter = appState.basketList.length;
	modal.close();
	events.emit('basket:update');
});

// Обновление корзины
events.on('basket:update', () => {
	basket.setDisabled(basket.button, appState.statusBasket);
	basket.total = appState.getTotal();

	let i = 1;
	basket.items = appState.basketList.map((item) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: i++,
		});
	});

	modal.render({
		content: basket.render(),
	});
});

// Открытие корзины, отображение товаров и суммы заказа
events.on('basket:open', () => {
	events.emit('basket:update');
});

// Удаление товара из корзины
events.on('card:remove', (item: ICard) => {
	appState.deleteCardToBasket(item);
	page.counter = appState.basketList.length;
	events.emit('basket:update');
});

//Открытие формы доставки и смена оплаты
events.on('order:open', () => {
	modal.render({
		content: delivery.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	appState.order.items = appState.basket.map((item) => item.id);
});
events.on('payment:change', (item: HTMLButtonElement) => {
	appState.order.payment = item.name;
});

//Изменение поля ввода доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appState.setOrderField(data.field, data.value);
	}
);

//Валидация
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	delivery.valid = !address && !payment;
	contact.valid = !email && !phone;
	delivery.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

//Отправляем данные доставки и открываем модальное окно контактов
events.on('order:submit', () => {
	appState.order.total = appState.getTotal();
	modal.render({
		content: contact.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

//Изменение поля ввода контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appState.setContactsField(data.field, data.value);
	}
);

//Отправляем форму контактов и открываем окно с успешным заказом
events.on('contacts:submit', () => {
	api
		.orderCard(appState.order)
		.then(() => {
			const total = appState.getTotal();
			console.log(total);
			appState.clearBasket();
			page.counter = appState.basketList.length;
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});
