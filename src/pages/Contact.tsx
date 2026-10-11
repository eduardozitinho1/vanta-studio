import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import { useToast } from '@/context/ToastContext';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';

const schema = z.object({
  name: z.string().trim().min(2, 'Nome muito curto'),
  email: z.string().trim().email('E-mail inválido'),
  message: z.string().trim().min(10, 'Escreva ao menos 10 caracteres').max(1000),
});

export default function Contact() {
  useSeo({ title: 'Contato', description: 'Fale com a VANTA STUDIO. Projeto fictício de portfólio.', path: '/contato' });
  const { push } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string,string>>({});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string,string> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path.join('.');
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      push('error', 'Verifique os campos destacados.');
      return;
    }
    setErrors({});
    setForm({ name: '', email: '', message: '' });
    push('success', 'Mensagem simulada enviada (demo).');
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:py-24">
      <header>
        <p className="text-[10px] uppercase tracking-ultra text-ash">Contato</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl">Fale com a VANTA</h1>
        <p className="mt-4 max-w-xl text-sm text-ash">
          Este formulário é apenas uma demonstração. Nada é enviado ou armazenado.
        </p>
      </header>
      <form onSubmit={onSubmit} noValidate className="mt-12 space-y-5">
        <Input label="Nome" value={form.name} error={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="E-mail" type="email" value={form.email} error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Textarea label="Mensagem" value={form.message} error={errors.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          hint="Demonstração — nenhum envio real acontece." />
        <Button type="submit" size="lg">Enviar mensagem</Button>
      </form>
      <div className="mt-16 border-t border-line pt-8 text-sm text-ash">
        <p>Para fins de demonstração, o contato real do desenvolvedor deve ser</p>
        <p>adicionado aqui pelo autor antes de publicar. Este site não representa</p>
        <p>uma empresa real.</p>
      </div>
    </div>
  );
}
