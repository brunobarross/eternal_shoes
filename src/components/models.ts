export interface Meta {
  totalCount: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string;
  priceId: string;
}

export interface User {
  accessToken: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  auth: object;
}

export interface Cart {
  priceId: string;
  quantity: number;
  productId: string;
  price: number;
}
