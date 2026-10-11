import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '@/context/AuthContext';
import { loginSchema } from '@/lib/validation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';

export default function AdminLogin() {
  useSeo({ title: 'Login administrativo', noindex: true });
  const { signIn, isAuthenticated, mode } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin/painel" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errs: Record<string,string> = {};
      for (const i of parsed.error.issues) errs[i.path.join('.')] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    const res = await signIn(parsed.data.email, parsed.data.password);
    setBusy(false);
    if (res.ok) navigate(loc.state?.from ?? '/admin/painel', { replace: true });
    else setErrors({ password: res.error });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-paper lg:grid-cols-2">
      <div className="hidden bg-ink text-paper lg:flex lg:flex-col lg:justify-between lg:p-16">
        <Link to="/" className="font-display text-3xl tracking-[0.2em]">VANTA</Link>
        <div>
          <p className="text-[10px] uppercase tracking-ultra text-paper/50">Painel administrativo</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.02]">
            Gerencie o conteúdo fictício desta demonstração.
          </h1>
        </div>
        <p className="text-xs text-paper/50">
          Este site é um projeto de portfólio. Não há dados reais protegidos.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={onSubmit} noValidate className="w-full max-w-md space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-ultra text-ash">Entrar</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Painel administrativo</h2>
          </div>

          {mode === 'demo' && (
            <div className="border border-line bg-bone/50 p-4 text-xs text-ash">
              <p className="font-medium text-ink">Modo demo</p>
              <p className="mt-1">Esta é uma autenticação fictícia. Nenhum dado real está em jogo.</p>
              <p className="mt-2 tabular-nums">
                <span className="text-ash">E-mail: </span>
                <code className="text-ink">{DEMO_CREDENTIALS.email}</code>
                <br />
                <span className="text-ash">Senha: </span>
                <code className="text-ink">{DEMO_CREDENTIALS.password}</code>
              </p>
            </div>
          )}

          <Input label="E-mail" type="email" autoComplete="username" value={email}
            error={errors.email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Senha" type="password" autoComplete="current-password" value={password}
            error={errors.password} onChange={(e) => setPassword(e.target.value)} />

          <Button type="submit" size="lg" full disabled={busy}>
            {busy ? 'Entrando…' : 'Entrar'}
          </Button>

          <p className="flex items-center gap-2 text-[11px] text-ash">
            <Lock size={12} /> Autenticação de demonstração — não é segurança real.
          </p>

          <Link to="/" className="block text-center text-[11px] uppercase tracking-wide2 text-ash underline decoration-line underline-offset-4 hover:text-ink">
            Voltar ao site
          </Link>
        </form>
      </div>
    </div>
  );
}
