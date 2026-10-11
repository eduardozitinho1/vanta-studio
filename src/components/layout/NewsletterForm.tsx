import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { z } from 'zod';
import { cx } from '@/lib/format';

const schema = z.string().trim().email();

export function NewsletterForm({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'done' | 'error'>('idle');
  const dark = tone === 'dark';

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) { setState('error'); return; }
    setState('done');
    setEmail('');
  };

  if (state === 'done') {
    return (
      <p className={cx(
        'flex items-center gap-2 text-xs uppercase tracking-wide2',
        dark ? 'text-paper/80' : 'text-ink',
      )}>
        <Check size={14} /> Inscrição simulada confirmada (demo).
      </p>
    );
  }

  const inputId = `nl-${tone}`;

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-sm">
      <div className={cx('flex border-b', dark ? 'border-paper/30' : 'border-ink/30')}>
        <label htmlFor={inputId} className="sr-only">E-mail para newsletter</label>
        <input
          id={inputId} type="email" value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
          placeholder="seu@email.com"
          aria-invalid={state === 'error'}
          className={cx(
            'flex-1 bg-transparent py-2 text-sm placeholder:text-smoke focus:outline-none',
            dark ? 'text-paper' : 'text-ink',
          )}
        />
        <button type="submit" aria-label="Assinar newsletter"
          className={cx('px-2 transition',
            dark ? 'text-paper/70 hover:text-paper' : 'text-ash hover:text-ink')}>
          <ArrowRight size={16} />
        </button>
      </div>
      <p className={cx(
        'mt-2 text-[10px] uppercase tracking-wide2',
        state === 'error' ? 'text-red-500' : dark ? 'text-paper/40' : 'text-ash',
      )}>
        {state === 'error' ? 'E-mail inválido.' : 'Demonstração — nenhum e-mail é armazenado.'}
      </p>
    </form>
  );
}
