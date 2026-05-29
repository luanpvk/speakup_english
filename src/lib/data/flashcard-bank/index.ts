import { buildFlashcardBank } from "./build-bank";

export type { FlashcardBankEntry } from "./types";

/** Banco global com 1000+ palavras e frases (deduplicado por palavra em inglês) */
export const FLASHCARD_BANK = buildFlashcardBank();

export const FLASHCARD_BANK_SIZE = FLASHCARD_BANK.length;
