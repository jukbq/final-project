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
  price: number;
  images: string;
  count: number;
}

export interface GoodsResponse extends GoodsRequest {
  id: number | string;
}
