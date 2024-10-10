# Проектная работа "Веб-ларек"
## [Макет](https://www.figma.com/design/50YEgxY8IYDYj7UQu7yChb/%D0%92%D0%B5%D0%B1-%D0%BB%D0%B0%D1%80%D1%91%D0%BA?node-id=0-1&node-type=canvas&t=4uibGzbvbBJlFNIe-0)
Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Модель состояние приложения

```
export interface IAppState {
	cardList: ICard[];
	basket: string[];
	order: IOrder;
	preview: string;
	formErrors: FormErrors;
}
```

Главная страница

```
export interface IPage {
	cardList: HTMLElement[];
}
```

Интерфейс карточки

```
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
```

Модальное окно

```
export interface IModalData {
	content: HTMLElement;
}
```

Интерфейс формы заказа

```
export interface IOrderForm {
	payment?: string;
	address?: string;
	phone?: string;
	email?: string;
	total?: number | string;
}
```

Интерфейс заказа

```
export interface IOrder extends IOrderForm {
	items: string[];
}
```

Интерфейс в случае удачного оформления 

```
export interface ISuccessForm {
	id: string;
	total: number;
}
```

Интерфейс валидации формы

```
export interface IFormValid {
	valid: boolean;
	errors: string[];
}
```

Тип ошибки формы

```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Интерфейс корзины

```
export interface IBasket {
	items: HTMLElement[];
	total: number;
}
```

Интерфейс карточки в корзине

```
export interface ICardBasket {
	index: number;
	title: string;
	price: number;
}
```

Api ответ с сервера для списка обьектов

```
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
}
```

Интерфейс события

```
export interface ISuccessActions {
	onClick: () => void;
}
```

Интерфейс события

```
export interface IActions {
	onClick: (event: MouseEvent) => void;
}
```
Интерфейс формы успешного заказа

```
export interface ISuccess {
	total: number;
  }
```



## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `cards: changed` - изменение массива карточек
- `card: selected` - изменение открываемой в модальном окне картинки карточки

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `card: select` - выбор карточки для отображение в модальном окне


### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.\
Поля классов:
- `baseUrl: string` - принимает базовый URL
- `options: RequestInit = {}` - принимает глобальные опции для всех запросов(опционально)

Конструктор:
- `constructor(cdn: string, baseUrl: string, options?: RequestInit)` - принимает базовый URL и глобальные опции для всех запросов(опционально).

Методы:
- `handleResponse(response: Response): Promise<object>` - обработчик ответа сервера. Принимает ответ и возвращает его, если ответа нет возвращает ошибку.
- `get(uri: string)` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает обьект с данными, которые будут переданы в JSON в теле запроса и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс ApiModel
Наследник класса Api.\
Поля класса:
- `cdn(string)` - Базовый URL адрес

Конструктор:
- `constructor(cdn: string, baseUrl: string, options?: RequestInit)` - принимает базовый URL для получения контента, базовый URL для запросов и глобальные опции для всех запросов(опционально).

Методы класса:
- `getCardList(): Promise<ICard[]>` - получаем список всех карточек с сервера
- `getCardItem(id: string): Promise<ICard>` - получаем данные карточки по id
- `orderCard(order: IOrder): Promise<IOrderResult>` - возвращение данных по заказу

#### Класс Component<T>
Абстрактный базовый класс, для взаимодействия с DOM элементами. В дальнейшем от него будут наследоваться классы отображения:
- Page
- Card
- Basket
- Modal
- Form
- ISuccessForm

Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключает классы.
- `setText(element: HTMLElement, value: unknown)` - устанавливает текстовое поле.
- `setDisabled(element: HTMLElement, state: boolean)` - меняет статус блокировки.
- `setHidden(element: HTMLElement)` - скрывает элемент.
- `setVisible(element: HTMLElement)` - показывает элемент.
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает изображение с альтернативным текстом.
- `render(data?: Partial): HTMLElement` - возвращает корневой DOM элемент.


### Слой данных

#### Класс AppState 
Класс управления состоянием приложения. Включает в себя список карточек, заказы, формы, корзину.\
Поля класса:
- `cardList: ICard[]`
- `basket: string[]`
- `order: IOrder`
- `preview: string`
- `formErrors: FormErrors`

Методы:
 - `setCatalog` - устанавливает список карточек.
 - `setPreview` - устанавливает предпросмотр карточек.
 - `addCardToBasket` - добавляет товар в заказ.
 - `setCardToBasket` - добавляет товар в корзину.
 - `basketList` - вернуть список товара в корзине.
 - `statusBasket` - вернуть информацию по составу в корзине.
 - `total` - вывести сумму заказа.
 - `getTotal` - вернуть общую сумму заказов.
 - `deleteCardToBasket` - удалить товар из корзины.
 - `setOrderField` - Вывести данные введенные в поле доставки.
 - `setContactsField` - Вывести данные введенные в поле контакты.
 - `validateOrder` - Валидация введенных данных.
 - `validateContacts` - Валидация введенных формы контактов.
 - `clearOrder` - отчистка заказа.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Basket 
Управляет отображением корзины.\
Поля класса: 
- `list: HTMLElement` - список товаров
- `button: HTMLButtonElement` - кнопка удаления
- `total: HTMLElement` - цена общая

Конструктор:
- `constructor(container: HTMLElement, events: EventEmitter)` - принимает DOM-элемент контейнера для отображения корзины и объект для управления событиями.

Методы:
- `set items(items: HTMLElement[])` - вставить данные в корзину
- `set total(price: number)` - посчитать общую стоимость товара

#### Класс Form<T>
Класс для работы с формами.\
Поля класса:
- `submit` - HTMLButtonElement
- `errors` - HTMLElement 

Конструктор:
- `constructor(protected container: HTMLFormElement, protected events: IEvents)` - принимает DOM-элемент формы и объект для управления событиями.

Методы:
- `InputChange` - обработчик событий ввода.
- `set valid` - контролирует активность кнопки отправки в зависимости от валидности формы.
- `set errors` - устанавливает и отображает ошибки валидации формы.
- `render` - показывает состояние формы.

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна.\
Поля класса:
- `closeButton` - HTMLButtonElement
- `content` - HTMLElement

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)` - принимает DOM-элемент контейнера для отображения модального окна и объект для управления событиями.

Методы: 
- `set content` - определяет контент показа в модальном окне.
- `open` - открывает модальное окно.
- `close` - закрывает модальное окно.
- `render` - рендерит модальное окно.

#### Класс Card
Описание карточки товара.\
Поля класса: 
- `category` - HTMLElement
- `title` - HTMLElement
- `image` - HTMLImageElement
- `price` - HTMLElement

Конструктор:
- `constructor(container: HTMLElement, actions?: IActions)` - принимает DOM-элемент контейнера для отображения карточки товара и объект для управления событиями (опционально).

Методы:
- `set category(value: string)` - принимает строку с сервера, устанавливает категорию.
- `set title(value: string)` - принимает строку с сервера, устанавливает заголовок.
- `set image(value: string)` - принимает строку с сервера, устанавливает изображение.
- `set price(value: number)` - принимает номер с сервера, устанавливает цену.


#### Класс Page
Формирование главной страницы.\
Поля класса:
- `counterBasket` - HTMLElement
- `cardList` - HTMLElement
- `wrapper` - HTMLImageElement
- `basket` - HTMLElement

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)` - принимает DOM-элемент контейнера для отображения главной страницы и объект для управления событиями.

Методы:
- `set counter(value: number)` - изменить счетчик товара в корзине на главной странице
- `set catalog(items: HTMLElement[])` - вывести список карточек
- `set locked(value: boolean)` - установка или снятие блока прокрутки страницы

### Класс Modal
Класс для работы с модальным окном.
Поля класса:
- `closeButton` - HTMLButtonElement;
- `content` - HTMLElement;

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)`

Методы:
- `set content` - определяет контент в модальном окне.
- `open` - открывает модальное окно.
- `close` - закрывает модальное окно.
- `render` - рендерит модальное окно.

### Класс CardBasket
Описание карточки товара. Наследуется от класса Card.
Поля класса:
- `index` - number;
- `title` - string;
- `price` - number;

Методы:
- `set index(value: number)` - принимает номер, устанавливает индекс.
- `set title(value: string)` - принимает строку, устанавливает текст.
- `set price(value: number | null)` - принимает номер, устанавливает цену.


#### Класс Contacts 
Отображение модального окна заполнения почты, телефона.\
Поля класса:
- `phone` - string
- `email`- string

Конструктор:
- `constructor(container: HTMLFormElement, events: IEvents)` - принимает DOM-элемент формы для ввода контактных данных и объект для управления событиями.

Методы:
- `set phone` - ввод телефона.
- `set email` - ввод почты.

#### Класс Success
Отображение модального удачного заказа.\
Поля класса:
- `total` - number

Конструктор:
- `constructor(container: HTMLElement, actions: ISuccessActions)` - принимает DOM-элемент контейнера для отображения сообщения об успешном заказе и объект для управления событиями успешного действия.

Методы:
- `set total` - устанавливает текст в элемент. 

#### Класс Order
Отображение модальных окон заполнения адреса.\
Поля класса:
- `buttons` - HTMLButtonElement
- `address` - string

Конструктор:
- `constructor(container: HTMLFormElement, events: IEvents)` - принимает DOM-элемент формы для ввода данных заказа и объект для управления событиями.

Методы класса:
- `set payment(name: string)` - переключение между кнопками.
- `set address` - ввод адреса доставки.

### Слой коммуникации 

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`: 
- `on` - подписка на событие
- `emit` - инициализация события 
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

