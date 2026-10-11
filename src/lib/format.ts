const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL',
  minimumFractionDigits: 2, maximumFractionDigits: 2,
});

export const formatBRL = (v: number): string => BRL.format(v);

export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(iso));

export const formatDateTime = (iso: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));

export const slugify = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
   .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const cx = (...p: Array<string | false | null | undefined>): string =>
  p.filter(Boolean).join(' ');

export const orderNumber = (): string => {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const rand = Math.random().toString(36).slice(2,7).toUpperCase();
  return `VNT-${stamp}-${rand}`;
};

export const uid = (prefix = 'id'): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

export const maskCEP = (v: string): string =>
  v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

export const maskPhone = (v: string): string => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
};
