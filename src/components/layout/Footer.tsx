import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

const cols = [
  { title: 'Loja', links: [
    { to: '/loja', label: 'Todas as peças' },
    { to: '/colecoes/monochrome', label: 'Volume I — Monochrome' },
    { to: '/colecoes/atelier-essentials', label: 'Atelier Essentials' },
    { to: '/colecoes/noir', label: 'Noir' },
    { to: '/colecoes/terrace', label: 'Terrace' },
  ]},
  { title: 'Institucional', links: [
    { to: '/sobre', label: 'Sobre a marca' },
    { to: '/contato', label: 'Contato' },
    { to: '/admin', label: 'Painel administrativo' },
  ]},
  { title: 'Ajuda', links: [
    { to: '/envio-e-devolucoes', label: 'Envio & devoluções' },
    { to: '/privacidade', label: 'Política de privacidade' },
    { to: '/termos', label: 'Termos de uso' },
  ]},
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-screen2xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-3xl tracking-[0.2em]">VANTA</div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              Vestuário contemporâneo de silhueta editorial. Projeto fictício
              criado como portfólio de desenvolvimento web.
            </p>
            <div className="mt-6"><NewsletterForm tone="dark" /></div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="mb-4 text-[10px] uppercase tracking-ultra text-paper/50">
                {c.title}
              </h3>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-sm text-paper/80 transition-colors hover:text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VANTA STUDIO — projeto fictício.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:contato@vanta.studio" className="flex items-center gap-1.5 hover:text-paper">
              <Mail size={14} /> contato@vanta.studio
            </a>
            <span className="flex items-center gap-1.5"><Instagram size={14} /> @vanta.studio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
