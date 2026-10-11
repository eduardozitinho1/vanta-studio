const ITEMS = [
  'PROJETO DE PORTFÓLIO — NENHUM PEDIDO REAL É PROCESSADO',
  'FRETE GRÁTIS ACIMA DE R$ 800 (DEMO)',
  'VOLUME I — MONOCHROME JÁ DISPONÍVEL',
  'ENVIAMOS PARA TODO O BRASIL (SIMULADO)',
];

export function AnnouncementBar() {
  const strip = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-b border-white/10 bg-ink py-2.5 text-paper">
      <div className="flex w-max animate-marquee gap-16 whitespace-nowrap will-change-transform">
        {strip.map((t, i) => (
          <span key={i} className="text-[10px] uppercase tracking-ultra text-paper/70">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
