import type { Product } from '@/types';

const SITE = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '');

/**
 * Only emit structured data genuinely represented by this demo.
 * NO aggregateRating, NO reviews, NO address, NO phone, NO VAT.
 */
export function productJsonLd(product: Product): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    category: product.category,
    brand: { '@type': 'Brand', name: 'VANTA STUDIO (fictional)' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: product.price.toFixed(2),
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      ...(SITE ? { url: `${SITE}/produto/${product.slug}` } : {}),
    },
  };
  return JSON.stringify(data);
}
