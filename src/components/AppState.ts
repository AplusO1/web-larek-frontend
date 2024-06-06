import { Model } from './base/Model';
import {
	IAppState,
	ICard,
	IOrder,
	FormErrors,
	IOrderForm,
} from '../types/index';

export class AppState extends Model<IAppState> {
	cardList: ICard[];
	basket: ICard[] = [];
	order: IOrder = {
		address: '',
		payment: '',
		email: '',
		total: 0,
		phone: '',
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	// Вывести каталог
	setCatalog(items: ICard[]) {
		this.cardList = items;
		this.emitChanges('items:changed', this.cardList);
	}

	//Вывести превью карточки
	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	//Вывести карточку в список окна корзины
	setCardToBasket(item: ICard) {
		this.basket.push(item);
	}

	addCardToBasket(item: ICard) {
    this.basket.push(item);
    this.order.items.push(item.id);
}


	//Вернуть список товара в корзине
	get basketList(): ICard[] {
		return this.basket;
	}

	//Вернуть информацию по составу в корзине
	get statusBasket(): boolean {
		return this.basket.length === 0;
	}

	//Вернуть общую сумму заказов
	getTotal() {
		return this.basket.reduce((acc, item) => acc + item.price, 0);
	}

	//Удалить товар из корзины
	deleteCardToBasket(item: ICard) {
		const index = this.basket.indexOf(item);
		if (index >= 0) {
			this.basket.splice(index, 1);
		}
	}

	//Отчистка корзины
	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}

	//Вывести данные введенные в поле доставки
	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	//Вывести данные введенные в поле контакты
	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

	//Валидация введенных данных
	validateOrder() {
		const errors: typeof this.formErrors = {};
		const deliveryRegex = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
		if (!this.order.address) errors.address = 'Необходимо указать адрес';
		else if (!deliveryRegex.test(this.order.address))
			errors.address = 'Укажите настоящий адрес';
		else if (!this.order.payment) errors.payment = 'Выберите способ оплаты';
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	//Валидация введенных формы котактов
	validateContacts() {
		const errors: typeof this.formErrors = {};
		const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
		if (this.order.phone.startsWith('8'))
			this.order.phone = '+7' + this.order.phone.slice(1);
		if (!this.order.email) errors.email = 'Необходимо указать email';
		else if (!emailRegex.test(this.order.email))
			errors.email = 'Некорректный адрес электронной почты';
		if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
		else if (!phoneRegex.test(this.order.phone))
			errors.phone = 'Некорректный формат номера телефона';
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	//Отчистка заказа
	clearOrder() {
		this.order = {
			email: '',
			phone: '',
			payment: 'cash',
			address: '',
			items: [],
			total: 0,
		};
	}
}
