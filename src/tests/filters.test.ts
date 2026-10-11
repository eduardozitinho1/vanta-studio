import { describe, it, expect } from 'vitest';
import { filterProducts } from '@/lib/filters';
import type { Product } from '@/types';

const mk = (id: string, name: string, price: number, cat: Product['category'], stock = 10): Product => ({
  id, slug: id, name, description: `${name} description`,
  details: [], price, category: cat, collectionIds: [], sizes: ['M'],
  images: ['https://x.test/a.jpg'], stock, featured: false,
  createdAt: '2024-01-01T00:00:00.000Z',
});

const products: Product[] = [
  mk('1', 'A Coat', 2000, 'outerwear'),
  mk('2', 'B Shirt', 400, 'shirts'),
  mk('3', 'C Knit', 800, 'knitwear', 0),
  mk('4', 'D Trouser', 900, 'trousers'),
];

describe('filterProducts', () => {
  it('searches by name case-insensitively', () => {
    const r = filterProducts(products, { query: 'coat', categories: [], inStockOnly: false, sort: 'featured' });
    expect(r.map((p) => p.id)).toEqual(['1']);
  });
  it('filters by category', () => {
    const r = filterProducts(products, { query: '', categories: ['shirts'], inStockOnly: false, sort: 'featured' });
    expect(r.map((p) => p.id)).toEqual(['2']);
  });
  it('filters out-of-stock when inStockOnly', () => {
    const r = filterProducts(products, { query: '', categories: [], inStockOnly: true, sort: 'featured' });
    expect(r.find((p) => p.id === '3')).toBeUndefined();
  });
  it('sorts by price ascending', () => {
    const r = filterProducts(products, { query: '', categories: [], inStockOnly: false, sort: 'price-asc' });
    expect(r.map((p) => p.id)).toEqual(['2', '3', '4', '1']);
  });
  it('respects price range', () => {
    const r = filterProducts(products, { query: '', categories: [], minPrice: 500, maxPrice: 1000, inStockOnly: false, sort: 'featured' });
    expect(r.map((p) => p.id).sort()).toEqual(['3', '4']);
  });
});
