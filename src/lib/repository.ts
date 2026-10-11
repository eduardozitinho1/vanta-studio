import type { Collection, Order, Product, OrderStatus } from '@/types';
import { SEED_COLLECTIONS, SEED_PRODUCTS } from '@/data/seed';
import { storage } from './storage';

const K = {
  products:    'catalog:products',
  collections: 'catalog:collections',
  orders:      'orders:list',
} as const;

const delay = (ms = 160): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

export const repository = {
  async listProducts(): Promise<Product[]> {
    await delay();
    return storage.get<Product[]>(K.products, SEED_PRODUCTS);
  },
  async saveProducts(list: Product[]): Promise<void> {
    storage.set(K.products, list);
  },
  async findProduct(slug: string): Promise<Product | null> {
    const list = await this.listProducts();
    return list.find((p) => p.slug === slug) ?? null;
  },

  async listCollections(): Promise<Collection[]> {
    await delay(120);
    return storage.get<Collection[]>(K.collections, SEED_COLLECTIONS);
  },
  async saveCollections(list: Collection[]): Promise<void> {
    storage.set(K.collections, list);
  },
  async findCollection(slug: string): Promise<Collection | null> {
    const list = await this.listCollections();
    return list.find((c) => c.slug === slug) ?? null;
  },

  async listOrders(): Promise<Order[]> {
    await delay(120);
    return storage.get<Order[]>(K.orders, []);
  },
  async addOrder(order: Order): Promise<void> {
    const list = storage.get<Order[]>(K.orders, []);
    storage.set(K.orders, [order, ...list]);
  },
  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    const list = storage.get<Order[]>(K.orders, []);
    storage.set(K.orders, list.map((o) => (o.id === id ? { ...o, status } : o)));
  },
  async findOrder(id: string): Promise<Order | null> {
    const list = storage.get<Order[]>(K.orders, []);
    return list.find((o) => o.id === id) ?? null;
  },

  resetDemoData(): void {
    storage.remove(K.products);
    storage.remove(K.collections);
    storage.remove(K.orders);
    storage.remove('cart:lines');
  },
};
