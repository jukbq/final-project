export interface MenuRequest {
  menuName: string;
  link: string;
}
export interface MenuResponse extends MenuRequest {
  id: number | string;
}