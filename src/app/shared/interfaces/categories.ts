import { MenuResponse } from "./menu";

export interface СategoriesRequest {
  menu: MenuResponse;
  menuName: MenuResponse; 
  menuLink: MenuResponse; 
  titel: string;
  link: string;
  images: string;
}

export interface СategoriesResponse extends СategoriesRequest {
  id: number | string;
}
