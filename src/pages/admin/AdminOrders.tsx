import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { ORDER_STATUSES } from '@/types';
import { repository } from '@/lib/repository';
import { formatBRL, formatDateTime } from '@/lib/format';
import { OrderStatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { useSeo } from '@/hooks/useSeo';

export default function AdminOrders() {
  useSeo({ title: 'Pedidos', noindex: true });
  const { push } = useToast();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  const load = async () => {
    try { setOrders(await repository.listOrders()); }
    catch { push('error', 'Falha ao carregar pedidos.'); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const filtered = useMemo(() => {
    if (!orders) return null;
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (q && !`${o.number} ${o.customer.name} ${o.customer.email}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [orders, query, statusFilter]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await repository.updateOrderStatus(id, status);
      setOrders((prev) => prev ? prev.map((o) => o.id === id ? { ...o, status } : o) : prev);
      push('success', 'Status atualizado.');
    } catch {
      push('error', 'Falha ao atualizar status.');
    }
  };

  return (
    <div>
      <header className="mb-8 border-b border-line pb-6">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Operação</p>
        <h1 className="mt-2 font-display text-4xl">Pedidos simulados</h1>
        <p className="mt-2 text-sm text-ash">
          Todos os pedidos listados aqui são <strong>fictícios</strong>, gerados pela demonstração.
        </p>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_220px]">
        <div className="flex items-center gap-2 border-b border-line pb-2">
          <Search size={14} className="text-ash" />
          <label htmlFor="o-search" className="sr-only">Buscar pedidos</label>
          <input id="o-search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por número, nome ou e-mail…"
            className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none" />
        </div>
        <Select label="Status" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}>
          <option value="all">Todos</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      {!filtered ? (
        <div className="space-y-3">{[0,1,2].map((i) => <div key={i} className="h-16 animate-pulse bg-line" />)}</div>
      ) : filtered.length === 0 ? (
        <p className="border border-line bg-bone/40 p-8 text-sm text-ash">Nenhum pedido corresponde aos filtros.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {filtered.map((o) => (
            <li key={o.id} className="grid grid-cols-1 gap-3 py-5 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center lg:gap-6">
              <div className="min-w-0">
                <p className="font-medium">{o.number}</p>
                <p className="mt-0.5 text-xs text-ash">
                  {o.customer.name} · {o.customer.email}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide2 text-ash">
                  {formatDateTime(o.createdAt)} · {o.items.length} ite{o.items.length === 1 ? 'm' : 'ns'}
                </p>
              </div>
              <OrderStatusBadge status={o.status} />
              <p className="tabular-nums">{formatBRL(o.total)}</p>
              <Select label="Alterar status" value={o.status}
                onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
