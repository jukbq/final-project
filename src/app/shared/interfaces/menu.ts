export interface MenuRequest {
  menuindex: number;
  menuName: string;
  menuLink: string;
  menuImages: string;
}
export interface MenuResponse extends MenuRequest {
  id: number | string;
}