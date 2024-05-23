//модель состояние приложения
export interface IAppState {
	cardList: ICard[];
	basket: string[];
	order: IOrder;
	preview: string;
	formErrors: FormErrors;
}
// Главная страница
export interface IPage {
	cardList: HTMLElement[];
}

// Интерфейс карточки
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

// Интерфейс формы заказа
export interface IOrderForm {
	payment?: string;
	address?: string;
	phone?: string;
	email?: string;
	total?: number | string;
}

//Интерфейс заказа
export interface IOrder extends IOrderForm {
	items: string[];
}

//Интерфейс в случае удачного оформления заказа
export interface ISuccessForm {
	id: string;
	total: number;
}

//Интерфейс валидации формы
export interface IFormValid {
	valid: boolean;
	errors: string[];
}

//Тип ошибки формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//Интерфейс корзины
export interface IBasket {
	items: HTMLElement[];
	total: number;
}

//Api ответ с сервера для списка обьектов
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};



















//Интерфейс наблюдателя
export interface IEventEmitter {
	emit: (event: string, data: unknown) => void;
}

export interface IProduct {
	id: string;
	title: string;
}

export interface CatalogModel {
	items: IProduct[];
	setItems(items: IProduct[]): void;
	getProduct(id: string): IProduct;
}

export interface IViewConstructor {
	new (container: HTMLElement, events?: IEventEmitter): IView;
}

export interface IView {
	render(data?: object): HTMLElement;
}

export interface ICardApi {
	getCards: () => Promise<Card[]>;
	getCard(id: string) => Promise<Cards[]>;
	orderProducts: (order: Order) => Promise<OrderResult[]>
}

export interface appState {
	cardCatalog: IProductCard[];
	basket: string[];
	order: IOrderRequest;
	formErrors: FormError;

	setCardCatalog()
	addtoBasket()
	removeFromBasket()
	clearBasket()
	getBasketList()
	getTotalPrice()
	getBasketQuantity()
	setOrderInfo()
	validateDeliveryForm()
	ValidateDataForm()
	clearOrder()
}