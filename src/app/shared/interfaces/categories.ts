export interface СategoriesRequest {
  titel: string;
  link: string;
  images: string;
}

export interface СategoriesResponse extends СategoriesRequest {
  id: number | string;
}
