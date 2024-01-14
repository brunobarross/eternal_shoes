export interface Meta {
  totalCount: number;
}

export interface Product {
  id: number;
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
