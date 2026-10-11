export type Category =
  | 'outerwear' | 'knitwear' | 'shirts' | 'trousers' | 'accessories';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'ONE SIZE';
export type OrderStatus =
  | 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'pix' | 'card' | 'boleto';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  details: string[];
  price: number;
  compareAtPrice?: number;
  category: Category;
  collectionIds: string[];
  sizes: Size[];
  images: string[];
  stock: number;
  featured: boolean;
  createdAt: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: Size;
  quantity: number;
}

export type OrderItem = CartLine;

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  customer: { name: string; email: string; phone: string };
  shipping: {
    cep: string; street: string; number: string;
    complement?: string; city: string; state: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  demo: true;
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'outerwear',   label: 'Outerwear' },
  { value: 'knitwear',    label: 'Knitwear' },
  { value: 'shirts',      label: 'Shirts' },
  { value: 'trousers',    label: 'Trousers' },
  { value: 'accessories', label: 'Accessories' },
];

export const SIZES: Size[] = ['XS','S','M','L','XL','ONE SIZE'];
export const ORDER_STATUSES: OrderStatus[] = [
  'pending','paid','shipped','delivered','cancelled',
];
