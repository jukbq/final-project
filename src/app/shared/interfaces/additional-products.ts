import { APCategoryResponse } from "./additionalProductsCategory";

export interface AdditionalProductsRequest {
  category: APCategoryResponse;
  link: string;
  name: string;
  weight: string;
  price: number;
  images: string;
}
export interface AdditionalProductsResponse extends AdditionalProductsRequest {
  id: number | string;
}
