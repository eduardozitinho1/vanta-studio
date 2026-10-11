import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { CATEGORIES, SIZES, type Category, type Product, type Size } from '@/types';
import { repository } from '@/lib/repository';
import { productSchema, zodToFieldErrors, type FieldErrors } from '@/lib/validation';
import { slugify, uid } from '@/lib/format';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useSeo } from '@/hooks/useSeo';

interface Props { mode: 'create' | 'edit'; }

type Form = {
  name: string; slug: string; description: string; price: string;
  category: Category; stock: string; sizes: Size[]; images: string;
  featured: boolean; details: string;
};

const empty: Form = {
  name: '', slug: '', description: '', price: '', category: 'outerwear',
  stock: '', sizes: [], images: '', featured: false, details: '',
};

export default function AdminProductForm({ mode }: Props) {
  useSeo({ title: mode === 'create' ? 'Novo produto' : 'Editar produto', noindex: true });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(mode === 'edit');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    repository.listProducts().then((list) => {
      const p = list.find((x) => x.id === id);
      if (!p) { push('error', 'Produto não encontrado.'); navigate('/admin/produtos'); return; }
      setForm({
        name: p.name, slug: p.slug, description: p.description, price: String(p.price),
        category: p.category, stock: String(p.stock), sizes: p.sizes,
        images: p.images.join('\n'), featured: p.featured, details: p.details.join('\n'),
      });
      setLoading(false);
    }).catch(() => { push('error', 'Falha ao carregar produto.'); navigate('/admin/produtos'); });
  }, [id, mode, navigate, push]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k as string]; return n; });
  };

  const toggleSize = (s: Size) => {
    const next = form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s];
    set('sizes', next);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const images = form.images.split('\n').map((s) => s.trim()).filter(Boolean);
    const details = form.details.split('\n').map((s) => s.trim()).filter(Boolean);
    const parsed = productSchema.safeParse({
      name: form.name, slug: form.slug || slugify(form.name),
      description: form.description, price: Number(form.price),
      category: form.category, stock: Number(form.stock),
      sizes: form.sizes, images, featured: form.featured,
    });
    if (!parsed.success) {
      setErrors(zodToFieldErrors(parsed.error));
      push('error', 'Verifique os campos destacados.');
      return;
    }
    setBusy(true);
    try {
      const all = await repository.listProducts();
      const existing = mode === 'edit' ? all.find((p) => p.id === id) : undefined;
      const product: Product = {
        id: existing?.id ?? uid('p'),
        slug: parsed.data.slug,
        name: parsed.data.name,
        description: parsed.data.description,
        details: details.length ? details : existing?.details ?? [],
        price: parsed.data.price,
        category: parsed.data.category,
        collectionIds: existing?.collectionIds ?? [],
        sizes: parsed.data.sizes,
        images: parsed.data.images,
        stock: parsed.data.stock,
        featured: parsed.data.featured,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };
      const next = existing ? all.map((p) => (p.id === product.id ? product : p)) : [product, ...all];
      await repository.saveProducts(next);
      push('success', mode === 'edit' ? 'Produto atualizado.' : 'Produto criado.');
      navigate('/admin/produtos');
    } catch {
      push('error', 'Falha ao salvar. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="space-y-3">{[0,1,2,3,4].map((i) => <div key={i} className="h-12 animate-pulse bg-line" />)}</div>;
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <header className="mb-8 flex items-end justify-between border-b border-line pb-6">
        <div>
          <button type="button" onClick={() => navigate('/admin/produtos')}
            className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-ultra text-ash hover:text-ink">
            <ArrowLeft size={12} /> Voltar
          </button>
          <h1 className="font-display text-4xl">
            {mode === 'create' ? 'Novo produto' : 'Editar produto'}
          </h1>
        </div>
        <Button type="submit" disabled={busy}><Save size={14} /> {busy ? 'Salvando…' : 'Salvar'}</Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Input label="Nome" value={form.name} error={errors.name}
          onChange={(e) => { set('name', e.target.value); if (!form.slug) set('slug', slugify(e.target.value)); }} />
        <Input label="Slug" value={form.slug} error={errors.slug}
          hint="a-z, 0-9, hífen" onChange={(e) => set('slug', e.target.value)} />
        <div className="lg:col-span-2">
          <Textarea label="Descrição" value={form.description} error={errors.description}
            onChange={(e) => set('description', e.target.value)} />
        </div>
        <Input label="Preço (R$)" type="number" step="0.01" value={form.price}
          error={errors.price} onChange={(e) => set('price', e.target.value)} />
        <Input label="Estoque" type="number" value={form.stock}
          error={errors.stock} onChange={(e) => set('stock', e.target.value)} />
        <Select label="Categoria" value={form.category}
          onChange={(e) => set('category', e.target.value as Category)}>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </Select>
        <label className="flex items-center gap-2 self-end text-sm">
          <input type="checkbox" checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 accent-ink" />
          Destacar na página inicial
        </label>

        <div className="lg:col-span-2">
          <p className="mb-2 text-[11px] uppercase tracking-wide2 text-ash">Tamanhos</p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => {
              const active = form.sizes.includes(s);
              return (
                <button key={s} type="button" onClick={() => toggleSize(s)} aria-pressed={active}
                  className={'h-10 min-w-[3rem] border px-3 text-xs uppercase tracking-wide2 transition ' +
                    (active ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink')}>
                  {s}
                </button>
              );
            })}
          </div>
          {errors.sizes && <p className="mt-2 text-xs text-red-700">{errors.sizes}</p>}
        </div>

        <div className="lg:col-span-2">
          <Textarea label="URLs de imagens (uma por linha)" value={form.images}
            error={errors.images} onChange={(e) => set('images', e.target.value)} />
        </div>
        <div className="lg:col-span-2">
          <Textarea label="Detalhes (uma linha por item)" value={form.details}
            onChange={(e) => set('details', e.target.value)} />
        </div>
      </div>
    </form>
  );
}
