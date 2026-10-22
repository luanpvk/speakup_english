import { z } from "zod";
import { HYPERFOCUS_IDS } from "@/lib/data/hyperfocus";

/** Regras de senha: usadas na validação e no checklist ao vivo do formulário */
export const PASSWORD_RULES = [
  { label: "Pelo menos 8 caracteres", test: (v: string) => v.length >= 8 },
  { label: "Pelo menos uma letra", test: (v: string) => /[A-Za-z]/.test(v) },
  { label: "Pelo menos um número", test: (v: string) => /[0-9]/.test(v) },
] as const;

/** Lista tudo o que falta na senha de uma vez, não só o primeiro problema */
export const passwordSchema = z.string().max(72, "A senha pode ter no máximo 72 caracteres").superRefine((value, ctx) => {
  const missing = PASSWORD_RULES.filter((r) => !r.test(value)).map((r) => r.label.toLowerCase());
  if (missing.length > 0) {
    ctx.addIssue({ code: "custom", message: `Falta na senha: ${missing.join(", ")}` });
  }
});

export const registerParentSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(80, "Nome muito longo"),
  email: z.string().max(254).email("E-mail inválido"),
  password: passwordSchema,
});

export const loginParentSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória").max(200, "Senha inválida"),
});

export const loginChildSchema = z.object({
  parentEmail: z
    .string({ error: "Informe o e-mail do responsável" })
    .email("E-mail do responsável inválido"),
  username: z.string().min(3, "Usuário inválido"),
  pin: z
    .string()
    .length(4, "PIN deve ter 4 dígitos")
    .regex(/^\d+$/, "PIN deve conter apenas números"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/, "Link de redefinição inválido"),
  password: passwordSchema,
});

export const registerChildSchema = z.object({
  displayName: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(40, "Nome muito longo"),
  username: z
    .string()
    .min(3, "Usuário deve ter pelo menos 3 caracteres")
    .max(20, "Usuário deve ter no máximo 20 caracteres")
    .regex(/^[a-z0-9_]+$/, "Use apenas letras minúsculas, números e _"),
  pin: z
    .string()
    .length(4, "PIN deve ter 4 dígitos")
    .regex(/^\d+$/, "PIN deve conter apenas números"),
  avatarEmoji: z.string().max(16).optional(),
  hyperfocus: z.enum(HYPERFOCUS_IDS).optional(),
  birthYear: z
    .number()
    .int()
    .min(2000, "Ano inválido")
    .max(new Date().getFullYear(), "Ano inválido")
    .optional(),
});

export const updateChildProfileSchema = z.object({
  hyperfocus: z.enum(HYPERFOCUS_IDS).nullable().optional(),
});

const slugSchema = z.string().max(60).regex(/^[a-z0-9-]+$/, "Item inválido");

export const purchaseSchema = z.object({
  rewardSlug: slugSchema.optional(),
  itemSlug: slugSchema.optional(),
});

export const updateAvatarSchema = z.object({
  hairSlug: slugSchema.optional(),
  clothesSlug: slugSchema.optional(),
  accessorySlug: slugSchema.nullable().optional(),
  backgroundSlug: slugSchema.optional(),
  baseEmoji: z.string().max(16).optional(),
});

export const completeLessonSchema = z.object({
  score: z.coerce.number().min(0).max(100).catch(0),
  // até 4h por lição; evita somar tempo absurdo no progresso
  timeSpentSeconds: z.coerce.number().int().min(0).max(4 * 60 * 60).catch(0),
});

export const flashcardReviewSchema = z.object({
  cardId: z.string().regex(/^[a-f0-9]{24}$/, "Cartão inválido"),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});
