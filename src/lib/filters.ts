import type { Category, Product } from '@/types';

export type SortKey =
  | 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export interface ProductFilters {
  query: string;
  categories: Category[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  sort: SortKey;
}

const norm = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function filterProducts(products: Product[], f: ProductFilters): Product[] {
  const q = norm(f.query.trim());

  const out = products.filter((p) => {
    if (q) {
      const hay = norm(`${p.name} ${p.description} ${p.category}`);
      if (!hay.includes(q)) return false;
    }
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.minPrice !== undefined && p.price < f.minPrice) return false;
    if (f.maxPrice !== undefined && p.price > f.maxPrice) return false;
    if (f.inStockOnly && p.stock <= 0) return false;
    return true;
  });

  return out.sort((a, b) => {
    switch (f.sort) {
      case 'price-asc':  return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name-asc':   return a.name.localeCompare(b.name, 'pt-BR');
      case 'name-desc':  return b.name.localeCompare(a.name, 'pt-BR');
      case 'featured':
      default:
        return Number(b.featured) - Number(a.featured)
          || a.name.localeCompare(b.name, 'pt-BR');
    }
  });
}

export const searchProducts = (products: Product[], query: string): Product[] =>
  filterProducts(products, {
    query, categories: [], inStockOnly: false, sort: 'featured',
  });
