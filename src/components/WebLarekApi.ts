import { Api } from './base/Api';
import { ICard, ApiListResponse, IOrder, ISuccessForm } from '../types/index';

export class WebLarekApi extends Api {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getCardList(): Promise<ICard[]> {
    return this.get('/product').then((data: ApiListResponse<ICard>) => 
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    );
  }

   //получение данных по id
  getCardItem(id: string): Promise<ICard> {
    return this.get(`/product/${id}`).then((item: ICard) => ({
		...item,
		image: this.cdn + item.image,
	}));
  }

  //возврат данных по заказу
  orderCard(order: IOrder): Promise<ISuccessForm> {
    return this.post(`/order`, order).then((data: ISuccessForm) => data);
  }
}
