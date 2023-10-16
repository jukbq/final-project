/* import { LoginResponse } from './accoumt'; */
import { СategoriesResponse } from './categories';
import { MenuResponse } from './menu';

export interface GoodsRequest {
  menu: MenuResponse;
  menuName: СategoriesResponse;
  menuLink: СategoriesResponse;
  category: СategoriesResponse;
  link: СategoriesResponse;
  titel: СategoriesResponse;
  name: string;
  compound: string;
  weight: string;
  newPrice: boolean;
  price: number;
  priceTogether: number;
  bonus: number;
  bonusTogether: number;
  images: string;
  count: number;
  addProducts: [];
  selectAddProduct: [];
}

export interface GoodsResponse extends GoodsRequest {
  id: number | string;
}
