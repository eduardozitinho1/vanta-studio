import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, ShoppingBag, LogOut, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cx } from '@/lib/format';

const NAV = [
  { to: '/admin/painel',   label: 'Painel',   icon: LayoutDashboard },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/colecoes', label: 'Coleções', icon: Layers },
  { to: '/admin/pedidos',  label: 'Pedidos',  icon: ShoppingBag },
];

export default function AdminLayout() {
  const { email, signOut, mode } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-ink text-paper lg:flex">
        <div className="border-b border-white/10 p-6">
          <p className="font-display text-2xl tracking-[0.2em]">VANTA</p>
          <p className="mt-1 text-[10px] uppercase tracking-ultra text-paper/50">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) => cx(
                'flex items-center gap-3 px-3 py-2.5 text-sm transition',
                isActive ? 'bg-paper/10 text-paper' : 'text-paper/70 hover:bg-paper/5 hover:text-paper',
              )}>
              <n.icon size={16} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-4 text-xs text-paper/60">
          <p className="truncate">{email}</p>
          <p className="text-[10px] uppercase tracking-ultra text-paper/40">
            {mode === 'demo' ? 'Autenticação demo' : 'Supabase Auth'}
          </p>
          <NavLink to="/" className="flex items-center gap-2 text-paper/70 hover:text-paper">
            <Home size={14} /> Ver site
          </NavLink>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-paper/70 hover:text-paper">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="border-b border-line px-6 py-4 lg:hidden">
          <p className="font-display text-xl tracking-[0.2em]">VANTA · ADMIN</p>
        </div>
        <div className="mx-auto max-w-screen2xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
