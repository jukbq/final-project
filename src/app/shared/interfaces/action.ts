export interface ActionRequest {
  title: string;
  motto: string;
  description: string;
  images: string;
}

export interface ActionResponse extends ActionRequest {
  id: number | string;
}
