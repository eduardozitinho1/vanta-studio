import { Img } from '@/components/ui/Image';
import { useSeo } from '@/hooks/useSeo';

export default function About() {
  useSeo({
    title: 'Sobre',
    description: 'VANTA STUDIO é um projeto fictício de portfólio criado para demonstrar qualidade de engenharia e design em e-commerce.',
    path: '/sobre',
  });
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
      <header>
        <p className="text-[10px] uppercase tracking-ultra text-ash">Sobre a marca</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
          Uma marca que nunca existiu — feita para existir bem.
        </h1>
      </header>
      <div className="mt-12 overflow-hidden">
        <Img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80"
          alt="Ateliê — bancada com tecidos e ferramentas de costura" ratio="landscape" />
      </div>
      <div className="mt-12 space-y-6 text-base leading-relaxed text-ink/85">
        <p>VANTA STUDIO é um projeto fictício de portfólio criado por um desenvolvedor
          que vende serviços de criação de sites — não roupas. Toda a narrativa,
          catálogo, preços e pedidos existem apenas para demonstrar qualidade de
          engenharia de front-end, UX/UI e integração de dados.</p>
        <p>O objetivo é servir como vitrine de trabalho: mostrar que um site de
          e-commerce premium pode ser construído com código limpo, tipado e
          acessível, sem comprometer a estética editorial.</p>
        <p>Nenhum item é vendido, nenhum pagamento é processado, nenhuma entrega
          acontece. A marca, os produtos e as coleções foram inventados — e devem
          permanecer assim.</p>
      </div>
    </article>
  );
}
