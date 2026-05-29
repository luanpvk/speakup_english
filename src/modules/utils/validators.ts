import { z } from "zod";

export const registerParentSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Za-z]/, "Senha deve conter letras")
    .regex(/[0-9]/, "Senha deve conter números"),
});

export const loginParentSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const loginChildSchema = z.object({
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
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Za-z]/, "Senha deve conter letras")
    .regex(/[0-9]/, "Senha deve conter números"),
});

export const registerChildSchema = z.object({
  displayName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  username: z
    .string()
    .min(3, "Usuário deve ter pelo menos 3 caracteres")
    .max(20, "Usuário deve ter no máximo 20 caracteres")
    .regex(/^[a-z0-9_]+$/, "Use apenas letras minúsculas, números e _"),
  pin: z
    .string()
    .length(4, "PIN deve ter 4 dígitos")
    .regex(/^\d+$/, "PIN deve conter apenas números"),
  avatarEmoji: z.string().optional(),
  birthYear: z
    .number()
    .int()
    .min(2000, "Ano inválido")
    .max(new Date().getFullYear(), "Ano inválido")
    .optional(),
});
