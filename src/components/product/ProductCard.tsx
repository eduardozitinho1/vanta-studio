import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { Img } from '@/components/ui/Image';
import { formatBRL } from '@/lib/format';

export function ProductCard({ product }: { product: Product }) {
  const [primary, secondary] = product.images;
  const soldOut = product.stock <= 0;

  return (
    <Link
      to={`/produto/${product.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
    >
      <div className="relative overflow-hidden bg-bone">
        <Img
          src={primary ?? ''}
          alt={product.name}
          ratio="portrait"
          className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
        {secondary && !soldOut && (
          <Img
            src={secondary} alt="" aria-hidden ratio="portrait"
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {soldOut && (
          <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[10px] uppercase tracking-wide2 text-paper">
            Esgotado
          </span>
        )}
        {!soldOut && product.compareAtPrice && (
          <span className="absolute left-3 top-3 bg-accent px-2 py-1 text-[10px] uppercase tracking-wide2 text-paper">
            Oferta
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-ink transition-colors group-hover:text-ash">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide2 text-ash">{product.category}</p>
        </div>
        <div className="text-right">
          {product.compareAtPrice && (
            <p className="text-[11px] text-smoke line-through">{formatBRL(product.compareAtPrice)}</p>
          )}
          <p className="text-sm text-ink">{formatBRL(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}
