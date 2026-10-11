import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, Pencil } from 'lucide-react';
import type { Product } from '@/types';
import { repository } from '@/lib/repository';
import { filterProducts } from '@/lib/filters';
import { formatBRL } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/context/ToastContext';
import { useSeo } from '@/hooks/useSeo';

export default function AdminProducts() {
  useSeo({ title: 'Produtos', noindex: true });
  const { push } = useToast();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const load = async () => {
    try { setProducts(await repository.listProducts()); }
    catch { push('error', 'Falha ao carregar produtos.'); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const filtered = useMemo(() => {
    if (!products) return null;
    return filterProducts(products, {
      query, categories: [], inStockOnly: false, sort: 'name-asc',
    });
  }, [products, query]);

  const onDelete = async () => {
    if (!toDelete || !products) return;
    const next = products.filter((p) => p.id !== toDelete.id);
    await repository.saveProducts(next);
    setProducts(next);
    push('success', `"${toDelete.name}" removido.`);
    setToDelete(null);
  };

  return (
    <div>
      <header className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-ultra text-ash">Catálogo</p>
          <h1 className="mt-2 font-display text-4xl">Produtos</h1>
          <p className="mt-2 text-sm text-ash">{filtered?.length ?? '—'} itens (dados fictícios).</p>
        </div>
        <Link to="/admin/produtos/novo" className="inline-flex h-11 items-center gap-2 bg-ink px-5 text-xs uppercase tracking-wide2 text-paper hover:bg-ink-700">
          <Plus size={14} /> Novo produto
        </Link>
      </header>

      <div className="mb-6 max-w-sm">
        <label htmlFor="prod-search" className="sr-only">Buscar produtos</label>
        <div className="flex items-center gap-2 border-b border-line pb-2">
          <Search size={14} className="text-ash" />
          <input id="prod-search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou categoria…"
            className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none" />
        </div>
      </div>

      {!filtered ? (
        <div className="space-y-3">{[0,1,2,3].map((i) => <div key={i} className="h-16 animate-pulse bg-line" />)}</div>
      ) : filtered.length === 0 ? (
        <p className="border border-line bg-bone/40 p-8 text-sm text-ash">Nenhum produto encontrado.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {filtered.map((p) => (
            <li key={p.id} className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-6">
              <div className="min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide2 text-ash">
                  {p.category} · {p.sizes.join(' ')} · estoque {p.stock}
                </p>
              </div>
              <p className="tabular-nums">{formatBRL(p.price)}</p>
              <Link to={`/admin/produtos/${p.id}`}
                className="inline-flex h-9 items-center gap-2 border border-line px-3 text-[11px] uppercase tracking-wide2 hover:border-ink">
                <Pencil size={12} /> Editar
              </Link>
              <button onClick={() => setToDelete(p)}
                className="inline-flex h-9 items-center gap-2 border border-line px-3 text-[11px] uppercase tracking-wide2 text-red-700 hover:border-red-700"
                aria-label={`Excluir ${p.name}`}>
                <Trash2 size={12} /> Excluir
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)} title="Excluir produto?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>Cancelar</Button>
            <Button variant="danger" onClick={onDelete}>Excluir</Button>
          </>
        }>
        <p>Isso removerá <strong>{toDelete?.name}</strong> do catálogo local. Esta ação não pode ser desfeita.</p>
      </Dialog>
    </div>
  );
}
