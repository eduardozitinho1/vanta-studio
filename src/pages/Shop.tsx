import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/types';
import { repository } from '@/lib/repository';
import { filterProducts, type SortKey } from '@/lib/filters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductSkeletonGrid } from '@/components/ui/Skeleton';
import {
  DEFAULT_FILTERS, FilterPanel, PRICE_MAX, SORTS, type FilterState,
} from '@/components/product/Filters';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSeo } from '@/hooks/useSeo';
import { useDebounced } from '@/hooks/useDebounced';

export default function Shop() {
  useSeo({
    title: 'Loja',
    description: 'Catálogo completo da VANTA STUDIO — peças de vestuário contemporâneo. Demonstração de portfólio.',
    path: '/loja',
  });

  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [openFilters, setOpenFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    sort: (params.get('sort') as SortKey) ?? 'featured',
  }));
  const [query, setQuery] = useState(params.get('q') ?? '');
  const debouncedQuery = useDebounced(query, 220);

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
    if (filters.sort !== 'featured') next.set('sort', filters.sort);
    setParams(next, { replace: true });
  }, [query, filters.sort, setParams]);

  const filtered = useMemo(() => {
    if (!products) return null;
    return filterProducts(products, {
      query: debouncedQuery,
      categories: filters.categories,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice < PRICE_MAX ? filters.maxPrice : undefined,
      inStockOnly: filters.inStockOnly,
      sort: filters.sort,
    });
  }, [products, debouncedQuery, filters]);

  const clearAll = () => { setQuery(''); setFilters({ ...DEFAULT_FILTERS }); };

  return (
    <div className="mx-auto max-w-screen2xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="mb-10 border-b border-line pb-8 lg:mb-14">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Catálogo</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">Toda a coleção</h1>
        <p className="mt-4 max-w-xl text-sm text-ash">
          {filtered ? `${filtered.length} ${filtered.length === 1 ? 'peça' : 'peças'}` : '—'} · Demonstração de portfólio.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            <div>
              <label htmlFor="shop-search" className="sr-only">Buscar</label>
              <input id="shop-search" type="search" value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar peça…"
                className="w-full border-b border-line bg-transparent pb-2 text-sm placeholder:text-smoke focus:border-ink focus:outline-none" />
            </div>
            <FilterPanel value={filters} onChange={setFilters} />
          </div>
        </aside>

        <div>
          <div className="mb-8 flex items-center justify-between gap-4">
            <button type="button" onClick={() => setOpenFilters(true)}
              className="inline-flex items-center gap-2 border border-line px-4 py-2 text-xs uppercase tracking-wide2 lg:hidden">
              <SlidersHorizontal size={14} /> Filtros
            </button>
            <div className="ml-auto flex items-center gap-3">
              <label htmlFor="sort" className="text-[10px] uppercase tracking-ultra text-ash">Ordenar</label>
              <select id="sort" value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value as SortKey })}
                className="border border-line bg-paper px-3 py-2 text-xs uppercase tracking-wide2 focus:border-ink focus:outline-none">
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {!filtered ? (
            <ProductSkeletonGrid count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              eyebrow="Sem resultados"
              title={query ? `Nada encontrado para “${query}”.` : 'Nada corresponde aos filtros selecionados.'}
              description="Tente ajustar a busca ou limpar os filtros para ver o catálogo completo."
            >
              <button onClick={clearAll}
                className="inline-flex h-11 items-center border border-ink px-6 text-xs uppercase tracking-wide2 text-ink transition-colors hover:bg-ink hover:text-paper">
                Limpar tudo
              </button>
            </EmptyState>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>

      {openFilters && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpenFilters(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-paper p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl">Filtros</h2>
              <button onClick={() => setOpenFilters(false)} className="text-xs uppercase tracking-wide2 text-ash">
                Fechar
              </button>
            </div>
            <FilterPanel value={filters} onChange={setFilters} />
            <button onClick={() => setOpenFilters(false)}
              className="mt-8 h-12 w-full bg-ink text-xs uppercase tracking-wide2 text-paper">
              Ver {filtered?.length ?? 0} resultado{(filtered?.length ?? 0) === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
