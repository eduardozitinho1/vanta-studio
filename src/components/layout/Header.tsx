import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cx } from '@/lib/format';

const NAV = [
  { to: '/loja', label: 'Loja' },
  { to: '/colecoes/monochrome', label: 'Coleções' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
];

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : prev;
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-screen2xl items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
        <button
          type="button"
          className="-ml-2 p-2 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <NavLink
              key={n.to} to={n.to}
              className={({ isActive }) => cx(
                'text-[11px] uppercase tracking-wide2 transition-colors',
                isActive ? 'text-ink' : 'text-ash hover:text-ink',
              )}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 select-none lg:static lg:translate-x-0"
          aria-label="VANTA STUDIO — página inicial"
        >
          <span className="font-display text-2xl tracking-[0.2em] lg:text-3xl">VANTA</span>
          <span className="ml-2 hidden text-[9px] uppercase tracking-ultra text-ash lg:inline">
            Studio
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/busca" aria-label="Buscar" className="p-2 text-ink transition-colors hover:text-ash">
            <Search size={18} />
          </Link>
          <Link
            to="/carrinho"
            aria-label={`Carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}
            className="relative p-2 text-ink transition-colors hover:text-ash"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[9px] font-medium text-paper">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 z-40 h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-paper lg:hidden">
          <nav className="flex flex-col px-5 py-6" aria-label="Mobile">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}
                className="border-b border-line py-4 font-display text-3xl text-ink">
                {n.label}
              </NavLink>
            ))}
            <Link to="/busca" className="border-b border-line py-4 font-display text-3xl text-ink">
              Busca
            </Link>
            <Link to="/carrinho" className="border-b border-line py-4 font-display text-3xl text-ink">
              Carrinho {count > 0 && <span className="ml-2 text-base text-ash">({count})</span>}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
