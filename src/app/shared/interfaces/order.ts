export interface OrderItem {
  name: string;
  count: number;
  price: number;
  images: string;
}

export interface OrderRequest {
  email: string;
  phone: number;
  order: OrderItem[];
}

export interface OrderResponse extends OrderRequest {
  id: number | string;
}
