import { useSeo } from '@/hooks/useSeo';

export default function Terms() {
  useSeo({ title: 'Termos de Uso', path: '/termos' });
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
      <h1 className="font-display text-4xl sm:text-5xl">Termos de Uso</h1>
      <p className="mt-4 text-sm text-ash">Projeto fictício de portfólio.</p>
      <div className="mt-10 space-y-6 text-base leading-relaxed text-ink/85">
        <p>Este site é uma demonstração. Nenhum produto é vendido, nenhum serviço
          é prestado e nenhuma obrigação contratual é criada ao navegar pelas
          páginas ou ao "finalizar" um pedido simulado.</p>
        <h2 className="mt-10 font-display text-2xl">Uso permitido</h2>
        <p>Você pode explorar livremente o site para avaliar qualidade de design
          e engenharia, como faria em qualquer portfólio público.</p>
        <h2 className="mt-10 font-display text-2xl">Pedidos simulados</h2>
        <p>Pedidos criados neste site não são enviados, processados ou cobrados.
          Nenhuma transação financeira real ocorre em nenhum ponto do fluxo.</p>
        <h2 className="mt-10 font-display text-2xl">Marcas e conteúdo</h2>
        <p>"VANTA STUDIO" é uma marca fictícia. Todo o conteúdo textual e visual
          do catálogo foi inventado para este portfólio. Imagens são obtidas de
          bibliotecas públicas e não representam produtos reais.</p>
      </div>
    </article>
  );
}
