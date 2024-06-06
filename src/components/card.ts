import { Component } from './base/component';
import { ICard, IActions, ICardBasket } from '../types';
import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';

export class Card extends Component<ICard> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);
		this._category = container.querySelector('.card__category');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._description = container.querySelector('.card__text');
		if (actions?.onClick) container.addEventListener('click', actions.onClick);
	}

	private getCategoryClass(value: string) {
		const categorySetting = settings[value] || 'unknown';
		return 'card__category_' + categorySetting;
	}

	set category(value: string) {
		this._category.textContent = value;
		const backgroundColorClass = this.getCategoryClass(value);
		this._category.classList.add(backgroundColorClass);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this._description.textContent = value;
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
	}
}

export class CardPreview extends Card {
	protected _text: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container, actions);
		this._button = container.querySelector('.card__button');
		this._text = ensureElement<HTMLElement>('.card__text', container);
		this._text = ensureElement<HTMLElement>(`.card__text`, container);
		if (actions?.onClick) {
			if (this._button) {
				container.removeEventListener('click', actions.onClick);
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	set text(value: string) {
		this.setText(this._text, value);
	}

	disableButton() {
    if (this._button) {
      this._button.disabled = true;
    }
  }

}

export class CardBasket extends Component<ICardBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLElement;
	
	constructor(container: HTMLElement, actions?: IActions) {
			super(container);
			this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
			this._title = ensureElement<HTMLElement>(`.card__title`, container);
			this._price = ensureElement<HTMLElement>(`.card__price`, container);
			this._button = container.querySelector(`.card__button`);
	if (actions?.onClick) {
			if (this._button) {
					container.removeEventListener('click', actions.onClick);
					this._button.addEventListener('click', actions.onClick);
					} 
			}
	}

	set index(value: number) {this.setText(this._index, value);}

	set title(value: string) {this.setText(this._title, value);}

	set price(value: number | null) {this.setText(this._price, value ? `${value.toString()} синапсов` : 'Бесценно');}
}