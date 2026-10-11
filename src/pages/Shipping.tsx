import { useSeo } from '@/hooks/useSeo';

export default function Shipping() {
  useSeo({ title: 'Envio & Devoluções', path: '/envio-e-devolucoes' });
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
      <h1 className="font-display text-4xl sm:text-5xl">Envio & Devoluções</h1>
      <p className="mt-4 text-sm text-ash">Todas as informações abaixo são ficcionais e servem apenas para o demo.</p>
      <div className="mt-10 space-y-6 text-base leading-relaxed text-ink/85">
        <h2 className="font-display text-2xl">Prazos (simulados)</h2>
        <p>Envio para todo o Brasil em até 5 dias úteis após a "confirmação do
          pedido". Regiões Sul e Sudeste recebem em até 3 dias úteis.</p>
        <h2 className="font-display text-2xl">Frete</h2>
        <p>Frete grátis para pedidos acima de R$ 800. Abaixo desse valor, uma taxa
          fixa de R$ 29,90 é aplicada. Tudo isso é apenas lógica de demonstração,
          sem valor comercial real.</p>
        <h2 className="font-display text-2xl">Trocas e devoluções</h2>
        <p>Você tem 30 dias corridos a partir do recebimento para solicitar troca
          ou devolução. Como nada é realmente enviado neste projeto, este prazo
          existe apenas para ilustrar o fluxo de UX do e-commerce.</p>
        <h2 className="font-display text-2xl">Contato</h2>
        <p>Em caso de dúvidas sobre este projeto, o desenvolvedor responsável
          deve ser contatado diretamente.</p>
      </div>
    </article>
  );
}
