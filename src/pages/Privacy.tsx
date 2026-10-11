import { useSeo } from '@/hooks/useSeo';

export default function Privacy() {
  useSeo({ title: 'Política de Privacidade', path: '/privacidade' });
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24 prose-vanta">
      <h1 className="font-display text-4xl sm:text-5xl">Política de Privacidade</h1>
      <p className="mt-4 text-sm text-ash">Última atualização: projeto fictício de portfólio.</p>
      <div className="mt-10 space-y-6 text-base leading-relaxed text-ink/85">
        <p><strong>VANTA STUDIO não é uma loja real.</strong> É um projeto de portfólio
          fictício. Nenhuma informação pessoal é transmitida a servidores externos.</p>
        <h2 className="mt-10 font-display text-2xl">Dados armazenados localmente</h2>
        <p>Todo o estado da aplicação (carrinho, catálogo editado no painel e pedidos
          simulados) fica em <code>localStorage</code> no seu próprio navegador.
          Você pode apagar tudo em qualquer momento com o botão "Resetar dados
          demo" no painel administrativo, ou limpando os dados do site.</p>
        <h2 className="mt-10 font-display text-2xl">Dados de pagamento</h2>
        <p>Nenhum dado de cartão, CVV, senha ou credencial de pagamento é solicitado,
          transmitido ou armazenado. As opções de pagamento apresentadas no checkout
          são apenas ilustrativas.</p>
        <h2 className="mt-10 font-display text-2xl">Cookies</h2>
        <p>Este site não utiliza cookies de rastreamento. Não há analytics de terceiros
          embutidos no código.</p>
        <h2 className="mt-10 font-display text-2xl">Contato</h2>
        <p>Para questões sobre este projeto, o desenvolvedor responsável deve ser
          contatado diretamente — o e-mail exibido é fictício.</p>
      </div>
    </article>
  );
}
