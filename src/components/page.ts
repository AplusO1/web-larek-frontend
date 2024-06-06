import {IEvents} from "./base/events";
import {Component} from "./base/component";
import {ensureElement} from "../utils/utils";
import {IPage} from "../types";

export class Page extends Component<IPage> {
  protected _counterBasket: HTMLElement;
  protected _cardList: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._counterBasket = ensureElement<HTMLElement>('.header__basket-counter');
    this._cardList = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');

    this._basket.addEventListener('click', () => {
        this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.setText(this._counterBasket, String(value));
  }

  set catalog(items: HTMLElement[]) {
    this._cardList.replaceChildren(...items);
  }
  //матод блокировки прокрутки страницы при открытом модальном окне
  set locked(value: boolean) {
    if (value) {
        this._wrapper.classList.add('page__wrapper_locked');
    } else {
        this._wrapper.classList.remove('page__wrapper_locked');
    }
  }
}