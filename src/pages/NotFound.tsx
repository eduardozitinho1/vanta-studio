import { Link } from 'react-router-dom';
import { useSeo } from '@/hooks/useSeo';

export default function NotFound() {
  useSeo({ title: 'Página não encontrada', noindex: true });
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <p className="text-[10px] uppercase tracking-ultra text-ash">Erro 404</p>
      <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl">Perdido no off-white.</h1>
      <p className="mt-6 max-w-md text-sm text-ash">
        A página que você procurava não existe — ou saiu do catálogo.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link to="/" className="inline-flex h-11 items-center bg-ink px-6 text-xs uppercase tracking-wide2 text-paper transition hover:bg-ink-700">
          Voltar ao início
        </Link>
        <Link to="/loja" className="inline-flex h-11 items-center border border-ink px-6 text-xs uppercase tracking-wide2 text-ink transition hover:bg-ink hover:text-paper">
          Ver o catálogo
        </Link>
      </div>
    </div>
  );
}
