/* import { LoginResponse } from './accoumt'; */
import { СategoriesResponse } from './categories';


export interface GoodsRequest {
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
