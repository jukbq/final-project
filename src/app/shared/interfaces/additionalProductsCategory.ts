export interface APCategoryRequest {
  category: string;
  link: string;
}
export interface APCategoryResponse extends APCategoryRequest {
  id: number | string;
}
