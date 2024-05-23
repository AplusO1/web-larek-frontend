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

//Интерфейс события
export interface ISuccessActions {
	onClick: () => void;
}

//Интерфейс события
export interface IActions {
	onClick: (event: MouseEvent) => void;
}