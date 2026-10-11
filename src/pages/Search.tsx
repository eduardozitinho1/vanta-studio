import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import type { Product } from '@/types';
import { repository } from '@/lib/repository';
import { searchProducts } from '@/lib/filters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductSkeletonGrid } from '@/components/ui/Skeleton';
import { useSeo } from '@/hooks/useSeo';
import { useDebounced } from '@/hooks/useDebounced';

const SUGGESTIONS = ['sobre', 'camisa', 'alfaiataria', 'lã', 'seda', 'couro', 'preto'];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [products, setProducts] = useState<Product[] | null>(null);
  const debounced = useDebounced(query, 200);

  useSeo({
    title: 'Busca',
    description: 'Busque peças no catálogo da VANTA STUDIO.',
    path: '/busca', noindex: true,
  });

  useEffect(() => {
    let alive = true;
    repository.listProducts()
      .then((p) => { if (alive) setProducts(p); })
      .catch(() => { if (alive) setProducts([]); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    setParams(next, { replace: true });
  }, [query, setParams]);

  const results = useMemo(() => {
    if (!products) return null;
    if (!debounced.trim()) return [];
    return searchProducts(products, debounced);
  }, [products, debounced]);

  return (
    <div className="mx-auto max-w-screen2xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Busca</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">O que você procura?</h1>
        <div className="relative mt-8 flex items-center border-b border-ink/30">
          <SearchIcon size={18} className="text-ash" aria-hidden />
          <label htmlFor="search-input" className="sr-only">Buscar produtos</label>
          <input id="search-input" type="search" autoFocus value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, categoria, tecido…"
            className="flex-1 bg-transparent px-3 py-3 text-base placeholder:text-smoke focus:outline-none" />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca"
              className="p-2 text-ash transition hover:text-ink">
              <X size={16} />
            </button>
          )}
        </div>
        {!query && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setQuery(s)}
                className="border border-line px-3 py-1 text-[11px] uppercase tracking-wide2 text-ash transition hover:border-ink hover:text-ink">
                {s}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="mt-16">
        {!query.trim() ? (
          <p className="mx-auto max-w-md text-center text-sm text-ash">
            Digite algo para começar. Nada é enviado a servidores — toda a busca acontece localmente.
          </p>
        ) : !products || results === null ? (
          <ProductSkeletonGrid count={4} />
        ) : results.length === 0 ? (
          <div className="mx-auto max-w-lg border border-line bg-bone/40 px-6 py-16 text-center">
            <p className="text-[10px] uppercase tracking-ultra text-ash">Sem resultados</p>
            <h2 className="mt-4 font-display text-2xl">Nada para “{debounced}”.</h2>
            <p className="mt-3 text-sm text-ash">Tente outra palavra-chave ou explore o catálogo.</p>
            <Link to="/loja" className="mt-6 inline-flex h-11 items-center border border-ink px-6 text-xs uppercase tracking-wide2">
              Ver o catálogo
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-8 text-center text-xs uppercase tracking-wide2 text-ash">
              {results.length} resultado{results.length === 1 ? '' : 's'} para “{debounced}”
            </p>
            <ProductGrid products={results} />
          </>
        )}
      </div>
    </div>
  );
}
