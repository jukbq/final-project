export interface MenuRequest {
  menuindex: number;
  menuName: string;
  menulink: string;
  menuImages: string;
}
export interface MenuResponse extends MenuRequest {
  id: number | string;
}