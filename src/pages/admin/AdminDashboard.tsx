import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Layers, ShoppingBag, RotateCcw, ArrowRight } from 'lucide-react';
import type { Order, Product, Collection } from '@/types';
import { repository } from '@/lib/repository';
import { formatBRL, formatDateTime } from '@/lib/format';
import { OrderStatusBadge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useSeo } from '@/hooks/useSeo';

export default function AdminDashboard() {
  useSeo({ title: 'Painel', noindex: true });
  const { push } = useToast();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const load = async () => {
    try {
      const [p, c, o] = await Promise.all([
        repository.listProducts(), repository.listCollections(), repository.listOrders(),
      ]);
      setProducts(p); setCollections(c); setOrders(o);
    } catch {
      push('error', 'Falha ao carregar dados.');
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const lowStock = (products ?? []).filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = (products ?? []).filter((p) => p.stock === 0).length;
  const recentOrders = (orders ?? []).slice(0, 5);

  return (
    <div>
      <header className="mb-10 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-ultra text-ash">Painel</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Visão geral</h1>
          <p className="mt-3 text-sm text-ash">
            Todos os números são <strong>fictícios</strong> — gerados a partir de dados demo locais.
          </p>
        </div>
        <Button variant="outline" onClick={() => setConfirmReset(true)}>
          <RotateCcw size={14} /> Resetar dados demo
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat icon={<Package size={18} />} label="Produtos" value={products?.length ?? '—'} to="/admin/produtos" />
        <Stat icon={<Layers size={18} />} label="Coleções" value={collections?.length ?? '—'} to="/admin/colecoes" />
        <Stat icon={<ShoppingBag size={18} />} label="Pedidos simulados" value={orders?.length ?? '—'} to="/admin/pedidos" />
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="border border-line bg-bone/40 p-5">
          <p className="text-[10px] uppercase tracking-ultra text-ash">Estoque baixo (≤ 5)</p>
          <p className="mt-3 font-display text-3xl">{lowStock}</p>
        </div>
        <div className="border border-line bg-bone/40 p-5">
          <p className="text-[10px] uppercase tracking-ultra text-ash">Esgotados</p>
          <p className="mt-3 font-display text-3xl">{outOfStock}</p>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl">Pedidos recentes (demo)</h2>
          <Link to="/admin/pedidos" className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-wide2 text-ash hover:text-ink">
            Ver todos <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        {!orders ? (
          <div className="space-y-3">{[0,1,2].map((i) => <div key={i} className="h-14 animate-pulse bg-line" />)}</div>
        ) : recentOrders.length === 0 ? (
          <p className="border border-line bg-bone/40 p-6 text-sm text-ash">
            Nenhum pedido ainda. Finalize um checkout simulado para ver dados aqui.
          </p>
        ) : (
          <ul className="divide-y divide-line border border-line">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="font-medium">{o.number}</span>
                <span className="text-ash">{formatDateTime(o.createdAt)}</span>
                <OrderStatusBadge status={o.status} />
                <span className="tabular-nums">{formatBRL(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)}
        title="Resetar dados demo?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancelar</Button>
            <Button variant="danger" onClick={() => {
              repository.resetDemoData();
              setConfirmReset(false);
              push('success', 'Dados demo resetados.');
              load();
            }}>Confirmar reset</Button>
          </>
        }>
        <p>Isso apaga permanentemente produtos, coleções, pedidos e carrinho armazenados neste navegador.</p>
      </Dialog>
    </div>
  );
}

function Stat({ icon, label, value, to }: {
  icon: React.ReactNode; label: string; value: number | string; to: string;
}) {
  return (
    <Link to={to} className="group block border border-line bg-paper p-5 transition hover:border-ink">
      <div className="flex items-center gap-2 text-ash">{icon}<span className="text-[10px] uppercase tracking-ultra">{label}</span></div>
      <p className="mt-4 font-display text-4xl">{value}</p>
      <p className="mt-3 text-[10px] uppercase tracking-wide2 text-ash group-hover:text-ink">Gerenciar →</p>
    </Link>
  );
}
