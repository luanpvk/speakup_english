"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;
/** Evita empilhar demais: mantém só os mais recentes na tela */
const MAX_VISIBLE = 4;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((s) => ({ toasts: [...s.toasts, { ...toast, id: nextId++ }].slice(-MAX_VISIBLE) })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

const show = (type: ToastType) => (title: string, description?: string) =>
  useToastStore.getState().push({ type, title, description });

/** Uso: toast.success("Perfil criado!", "Detalhe opcional") — funciona fora de componentes também */
export const toast = {
  success: show("success"),
  error: show("error"),
  warning: show("warning"),
  info: show("info"),
};
