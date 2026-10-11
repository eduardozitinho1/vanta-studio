import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().trim().min(3, 'Informe o nome completo').max(120),
  email: z.string().trim().email('E-mail inválido').max(160),
  phone: z.string().trim()
    .regex(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, 'Telefone inválido (ex: (11) 91234-5678)'),
  cep: z.string().trim().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  street: z.string().trim().min(3, 'Informe o endereço').max(160),
  number: z.string().trim().min(1, 'Obrigatório').max(10),
  complement: z.string().trim().max(80).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Informe a cidade').max(80),
  state: z.string().trim().regex(/^[A-Za-z]{2}$/, 'UF com 2 letras')
    .transform((s) => s.toUpperCase()),
  paymentMethod: z.enum(['pix', 'card', 'boleto']),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export interface FieldErrors { [k: string]: string; }

export function zodToFieldErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.join('.') || '_';
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Nome muito curto').max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, 'a-z, 0-9 e hífen').max(120),
  description: z.string().trim().min(10, 'Descrição muito curta').max(600),
  price: z.coerce.number().positive('Preço deve ser positivo').max(100000),
  category: z.enum(['outerwear','knitwear','shirts','trousers','accessories']),
  stock: z.coerce.number().int('Use número inteiro').min(0).max(100000),
  sizes: z.array(z.enum(['XS','S','M','L','XL','ONE SIZE'])).min(1, 'Escolha um tamanho'),
  images: z.array(z.string().url('URL inválida')).min(1, 'Adicione uma imagem'),
  featured: z.boolean(),
});
export type ProductInput = z.infer<typeof productSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(4, 'Senha muito curta'),
});
export type LoginInput = z.infer<typeof loginSchema>;
