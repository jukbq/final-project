import { APCategoryResponse } from "./additionalProductsCategory";

export interface AdditionalProductsRequest {
  category: APCategoryResponse;
  apLink: string;
  apName: string;
  apWeight: string;
  apPrice: number;
  apImages: string;
  apCount: number;
}
export interface AdditionalProductsResponse extends AdditionalProductsRequest {
  id: number | string;
}
