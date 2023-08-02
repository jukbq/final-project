export interface ActionRequest {
  title: string;
  description: string;
  link: string;
  images: string;
}

export interface ActionResponse extends ActionRequest {
  id: number | string;
}
