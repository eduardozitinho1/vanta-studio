import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { repository } from '@/lib/repository';
import { checkoutSchema, zodToFieldErrors, type FieldErrors } from '@/lib/validation';
import { formatBRL, maskCEP, maskPhone, orderNumber, uid } from '@/lib/format';
import { shippingFor, totalFor } from '@/lib/cart';
import type { Order, PaymentMethod } from '@/types';
import { Img } from '@/components/ui/Image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';

type FormState = {
  name: string; email: string; phone: string; cep: string; street: string;
  number: string; complement: string; city: string; state: string;
  paymentMethod: PaymentMethod;
};

const initial: FormState = {
  name: '', email: '', phone: '', cep: '', street: '', number: '',
  complement: '', city: '', state: '', paymentMethod: 'pix',
};

const PAYMENTS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: 'pix', label: 'PIX', hint: 'Pagamento instantâneo simulado' },
  { value: 'card', label: 'Cartão', hint: 'Apenas simulação — dados não são coletados' },
  { value: 'boleto', label: 'Boleto', hint: 'Vencimento simulado em 3 dias úteis' },
];

export default function Checkout() {
  useSeo({ title: 'Checkout', path: '/checkout', noindex: true });

  const { lines, subtotal, shipping, total, clear } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k as string]; return n; });
  };

  const validateStock = useMemo(() => async () => {
    try {
      const products = await repository.listProducts();
      const map = new Map(products.map((p) => [p.id, p]));
      for (const l of lines) {
        const p = map.get(l.productId);
        if (!p) return { ok: false as const, message: `${l.name} saiu do catálogo.` };
        if (p.stock < l.quantity) return { ok: false as const, message: `${l.name} tem apenas ${p.stock} em estoque.` };
      }
      return { ok: true as const };
    } catch {
      return { ok: false as const, message: 'Não foi possível verificar o estoque.' };
    }
  }, [lines]);

  if (lines.length === 0 && !submitting) {
    return (
      <div className="mx-auto max-w-screen2xl px-5 py-24 text-center sm:px-8">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Checkout</p>
        <h1 className="mt-4 font-display text-4xl">Seu carrinho está vazio.</h1>
        <Link to="/loja" className="mt-8 inline-flex h-11 items-center border border-ink px-6 text-xs uppercase tracking-wide2">
          Ver o catálogo
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(zodToFieldErrors(parsed.error));
      push('error', 'Verifique os campos destacados.');
      return;
    }
    setErrors({});
    setSubmitting(true);
    const stockCheck = await validateStock();
    if (!stockCheck.ok) {
      setSubmitting(false);
      push('error', stockCheck.message);
      return;
    }
    const trustedSubtotal =
      Math.round(lines.reduce((s, l) => s + l.price * l.quantity, 0) * 100) / 100;
    const trustedShipping = shippingFor(trustedSubtotal);
    const trustedTotal = totalFor(trustedSubtotal, trustedShipping);

    const order: Order = {
      id: uid('order'),
      number: orderNumber(),
      createdAt: new Date().toISOString(),
      customer: { name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone },
      shipping: {
        cep: parsed.data.cep, street: parsed.data.street, number: parsed.data.number,
        ...(parsed.data.complement ? { complement: parsed.data.complement } : {}),
        city: parsed.data.city, state: parsed.data.state,
      },
      items: lines,
      subtotal: trustedSubtotal,
      shippingCost: trustedShipping,
      total: trustedTotal,
      paymentMethod: parsed.data.paymentMethod,
      status: 'paid',
      demo: true,
    };

    try {
      await repository.addOrder(order);
      clear();
      push('success', 'Pedido simulado criado com sucesso.');
      navigate(`/pedido/${order.id}`);
    } catch (err) {
      setSubmitting(false);
      push('error', err instanceof Error ? err.message : 'Falha ao criar o pedido.');
    }
  };

  return (
    <div className="mx-auto max-w-screen2xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="mb-10 border-b border-line pb-8">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Checkout</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl">Finalizar pedido</h1>
        <p className="mt-4 max-w-2xl text-sm text-ash">
          Todos os dados abaixo ficam apenas no seu navegador. Nenhum pagamento real é processado.
        </p>
      </header>

      <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div className="space-y-12">
          <section>
            <h2 className="mb-6 font-display text-2xl">Contato</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="Nome completo" autoComplete="name" value={form.name}
                  error={errors.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <Input label="E-mail" type="email" autoComplete="email" value={form.email}
                error={errors.email} onChange={(e) => update('email', e.target.value)} />
              <Input label="Telefone" autoComplete="tel" value={form.phone}
                error={errors.phone} placeholder="(11) 91234-5678"
                onChange={(e) => update('phone', maskPhone(e.target.value))} />
            </div>
          </section>

          <section>
            <h2 className="mb-6 font-display text-2xl">Endereço de entrega</h2>
            <div className="grid gap-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <Input label="CEP" autoComplete="postal-code" value={form.cep}
                  error={errors.cep} placeholder="00000-000"
                  onChange={(e) => update('cep', maskCEP(e.target.value))} />
              </div>
              <div className="sm:col-span-4">
                <Input label="Endereço" autoComplete="street-address" value={form.street}
                  error={errors.street} onChange={(e) => update('street', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Input label="Número" value={form.number} error={errors.number}
                  onChange={(e) => update('number', e.target.value)} />
              </div>
              <div className="sm:col-span-4">
                <Input label="Complemento (opcional)" value={form.complement}
                  onChange={(e) => update('complement', e.target.value)} />
              </div>
              <div className="sm:col-span-4">
                <Input label="Cidade" value={form.city} error={errors.city}
                  onChange={(e) => update('city', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Input label="UF" value={form.state} error={errors.state} maxLength={2}
                  onChange={(e) => update('state', e.target.value.toUpperCase().slice(0, 2))} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 font-display text-2xl">Forma de pagamento</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENTS.map((p) => {
                const active = form.paymentMethod === p.value;
                return (
                  <button key={p.value} type="button" onClick={() => update('paymentMethod', p.value)}
                    aria-pressed={active}
                    className={'border p-4 text-left transition ' + (active ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink')}>
                    <span className="block text-xs font-medium uppercase tracking-wide2">{p.label}</span>
                    <span className={'mt-1 block text-[11px] leading-snug ' + (active ? 'text-paper/70' : 'text-ash')}>{p.hint}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-start gap-2 border border-line bg-bone/40 p-3 text-xs text-ash">
              <Lock size={14} className="mt-0.5 shrink-0" />
              <span>Nenhum dado de pagamento é coletado, transmitido ou armazenado.</span>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line bg-bone/40 p-6 sm:p-8">
            <h2 className="font-display text-2xl">Seu pedido</h2>
            <ul className="mt-6 space-y-4">
              {lines.map((l) => (
                <li key={`${l.productId}-${l.size}`} className="flex items-start gap-4">
                  <div className="w-16 shrink-0"><Img src={l.image} alt={l.name} ratio="portrait" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{l.name}</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wide2 text-ash">{l.size} · {l.quantity} un</p>
                  </div>
                  <p className="shrink-0 text-sm">{formatBRL(l.price * l.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-3 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-ash">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ash">Frete</dt><dd>{shipping === 0 ? 'Grátis' : formatBRL(shipping)}</dd></div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt className="font-medium">Total</dt><dd className="font-medium">{formatBRL(total)}</dd>
              </div>
            </dl>
            <Button type="submit" size="lg" full className="mt-8" disabled={submitting}>
              {submitting ? 'Processando…' : 'Confirmar pedido (demo)'}
            </Button>
            <Link to="/carrinho" className="mt-4 block text-center text-[11px] uppercase tracking-wide2 text-ash underline decoration-line underline-offset-4 hover:text-ink">
              Voltar ao carrinho
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
