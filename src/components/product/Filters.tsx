import { CATEGORIES, type Category } from '@/types';
import type { SortKey } from '@/lib/filters';
import { cx } from '@/lib/format';

export interface FilterState {
  categories: Category[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sort: SortKey;
}

export const SORTS: { value: SortKey; label: string }[] = [
  { value: 'featured',   label: 'Destaques' },
  { value: 'price-asc',  label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'name-asc',   label: 'A — Z' },
  { value: 'name-desc',  label: 'Z — A' },
];

export const PRICE_MAX = 3500;

export const DEFAULT_FILTERS: FilterState = {
  categories: [], minPrice: 0, maxPrice: PRICE_MAX,
  inStockOnly: false, sort: 'featured',
};

export function FilterPanel({ value, onChange }: {
  value: FilterState; onChange: (v: FilterState) => void;
}) {
  const toggleCat = (c: Category) => {
    const next = value.categories.includes(c)
      ? value.categories.filter((x) => x !== c)
      : [...value.categories, c];
    onChange({ ...value, categories: next });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-[10px] uppercase tracking-ultra text-ash">Categoria</h3>
        <ul className="space-y-2">
          {CATEGORIES.map((c) => {
            const checked = value.categories.includes(c.value);
            return (
              <li key={c.value}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/85">
                  <input type="checkbox" checked={checked} onChange={() => toggleCat(c.value)}
                    className="h-3.5 w-3.5 accent-ink" />
                  <span className={cx(checked && 'font-medium text-ink')}>{c.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h3 className="mb-3 text-[10px] uppercase tracking-ultra text-ash">Preço</h3>
        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor="min-price">Preço mínimo</label>
          <input id="min-price" type="number" min={0} max={PRICE_MAX} value={value.minPrice}
            onChange={(e) => onChange({ ...value, minPrice: Number(e.target.value) || 0 })}
            className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none" />
          <span className="text-ash">—</span>
          <label className="sr-only" htmlFor="max-price">Preço máximo</label>
          <input id="max-price" type="number" min={0} max={PRICE_MAX} value={value.maxPrice}
            onChange={(e) => onChange({ ...value, maxPrice: Number(e.target.value) || PRICE_MAX })}
            className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none" />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-[10px] uppercase tracking-ultra text-ash">Disponibilidade</h3>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/85">
          <input type="checkbox" checked={value.inStockOnly}
            onChange={(e) => onChange({ ...value, inStockOnly: e.target.checked })}
            className="h-3.5 w-3.5 accent-ink" />
          Apenas em estoque
        </label>
      </div>
      <button type="button" onClick={() => onChange({ ...DEFAULT_FILTERS, sort: value.sort })}
        className="text-[11px] uppercase tracking-wide2 text-ash underline decoration-line underline-offset-4 hover:text-ink">
        Limpar filtros
      </button>
    </div>
  );
}
