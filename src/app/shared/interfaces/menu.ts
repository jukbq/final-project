export interface MenuRequest {
  menuName: string;
  menulink: string;
}
export interface MenuResponse extends MenuRequest {
  id: number | string;
}