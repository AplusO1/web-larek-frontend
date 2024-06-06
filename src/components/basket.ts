import {Component} from './base/component';
import {createElement, ensureElement} from './../utils/utils';
import {IBasket} from '../types';
import {EventEmitter} from './base/events';

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  button: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
	  this._list = ensureElement<HTMLElement>('.basket__list', this.container);
	  this.button = this.container.querySelector('.basket__button');
    this._total = this.container.querySelector('.basket__price');
    if(this.button) this.button.addEventListener('click', () => events.emit('order:open'));
    
    this.items = [];
  }

  //Вставляем данные в корзину
  set items(items: HTMLElement[]) {
    if (items.length) {
        this._list.replaceChildren(...items);
    } else {
        this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {textContent: 'Корзина пуста',}));
    }
  }

  //Устанавливаем общую сумму товаров в корзине
  set total(total: number) {
    this.setText(this._total, `${total.toString()} синапсов`);
  }
}