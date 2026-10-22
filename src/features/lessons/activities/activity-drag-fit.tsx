"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { KidIcon } from "@/lib/icons/kid-icons";
import type { LessonActivityDragFit } from "@/types/lesson";
import { cn } from "@/lib/utils";
import { LessonFooter, playFeedback, speak } from "../lesson-kit";

interface Props {
  data: LessonActivityDragFit;
  onComplete: (correct: boolean) => void;
}

const DONE_MS = 1200;
/** Movimento mínimo para contar como arrasto (abaixo disso é um toque) */
const DRAG_THRESHOLD = 6;

type Drag = { pieceId: string; startX: number; startY: number; x: number; y: number; moved: boolean };

/**
 * Encaixe: funciona de três jeitos
 * - arrastar a palavra até o significado
 * - tocar na palavra e depois no significado
 * - tocar no significado e depois na palavra
 */
export function ActivityDragFit({ data, onComplete }: Props) {
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [wrongSlot, setWrongSlot] = useState<string | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [hoverSlot, setHoverSlot] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const placedPieces = new Set(Object.values(placed));
  const remaining = data.pieces.filter((p) => !placedPieces.has(p.id));
  const done = data.slots.every((s) => placed[s.id]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const tryPlace = (pieceId: string, slotId: string) => {
    const piece = data.pieces.find((p) => p.id === pieceId);
    if (!piece || placed[slotId]) return;
    setSelectedPiece(null);
    setSelectedSlot(null);

    if (piece.slotId === slotId) {
      const next = { ...placed, [slotId]: piece.id };
      setPlaced(next);
      if (data.slots.every((s) => next[s.id])) {
        playFeedback("complete");
        timer.current = window.setTimeout(() => onComplete(errors === 0), DONE_MS);
      } else {
        playFeedback("correct");
      }
    } else {
      playFeedback("wrong");
      setErrors((n) => n + 1);
      setWrongSlot(slotId);
      timer.current = window.setTimeout(() => setWrongSlot(null), 600);
    }
  };

  const tapPiece = (pieceId: string, word: string) => {
    speak(word);
    if (selectedSlot) {
      tryPlace(pieceId, selectedSlot);
      return;
    }
    setSelectedPiece((cur) => (cur === pieceId ? null : pieceId));
  };

  const tapSlot = (slotId: string) => {
    if (placed[slotId]) return;
    if (selectedPiece) {
      tryPlace(selectedPiece, slotId);
      return;
    }
    setSelectedSlot((cur) => (cur === slotId ? null : slotId));
  };

  /* ---------- Arrastar (mouse e toque) ---------- */

  const slotAt = (x: number, y: number) =>
    (document.elementFromPoint(x, y)?.closest("[data-slot-id]") as HTMLElement | null)?.dataset.slotId ?? null;

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>, pieceId: string) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ pieceId, startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY, moved: false });
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag) return;
    const moved =
      drag.moved || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > DRAG_THRESHOLD;
    setDrag({ ...drag, x: e.clientX, y: e.clientY, moved });
    if (moved) setHoverSlot(slotAt(e.clientX, e.clientY));
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>, word: string) => {
    if (!drag) return;
    const { pieceId, moved } = drag;
    setDrag(null);
    setHoverSlot(null);
    if (!moved) {
      tapPiece(pieceId, word);
      return;
    }
    const slotId = slotAt(e.clientX, e.clientY);
    if (slotId) tryPlace(pieceId, slotId);
  };

  const draggingPiece = drag?.moved ? data.pieces.find((p) => p.id === drag.pieceId) : undefined;
  const hint = selectedSlot
    ? "Agora toque na palavra em inglês."
    : selectedPiece
      ? "Agora toque no significado certo."
      : "Arraste a palavra até o significado, ou toque nos dois.";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="font-display text-xl font-bold">Encaixe as palavras</p>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {hint}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {data.slots.map((slot) => {
          const piece = data.pieces.find((p) => p.id === placed[slot.id]);
          const active = hoverSlot === slot.id || selectedSlot === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              data-slot-id={slot.id}
              onClick={() => tapSlot(slot.id)}
              disabled={Boolean(piece)}
              aria-pressed={selectedSlot === slot.id}
              className={cn(
                "flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 transition-all",
                piece
                  ? "border-primary bg-speakup-green-soft"
                  : wrongSlot === slot.id
                    ? "animate-shake border-destructive bg-destructive/10"
                    : active
                      ? "scale-[1.03] border-sky-500 bg-sky-500/10"
                      : selectedPiece || drag
                        ? "border-dashed border-sky-500/60"
                        : "border-dashed border-border hover:border-sky-500/60"
              )}
            >
              <KidIcon emoji={slot.emoji} word={slot.label} size="sm" variant="plain" />
              <span className="text-sm font-semibold">{slot.label}</span>
              {piece && <span className="font-display text-lg font-bold text-primary">{piece.english}</span>}
            </button>
          );
        })}
      </div>

      <div className="flex min-h-14 flex-wrap justify-center gap-2">
        {remaining.map((p) => {
          const isDragging = drag?.pieceId === p.id && drag.moved;
          return (
            <button
              key={p.id}
              type="button"
              onPointerDown={(e) => onPointerDown(e, p.id)}
              onPointerMove={onPointerMove}
              onPointerUp={(e) => onPointerUp(e, p.english)}
              onPointerCancel={() => {
                setDrag(null);
                setHoverSlot(null);
              }}
              // teclado: Enter/Espaço disparam click sem pointer
              onClick={(e) => e.detail === 0 && tapPiece(p.id, p.english)}
              aria-pressed={selectedPiece === p.id}
              className={cn(
                "press-3d touch-none select-none rounded-2xl border-2 px-4 py-2.5 font-display text-lg font-bold",
                isDragging && "opacity-30",
                selectedPiece === p.id
                  ? "border-sky-500 bg-sky-500 text-white shadow-[0_4px_0_#0369a1]"
                  : "cursor-grab border-border bg-card shadow-[0_4px_0_hsl(var(--border-shadow))] hover:bg-muted/50"
              )}
            >
              {p.english}
            </button>
          );
        })}
      </div>

      {/* Palavra seguindo o dedo/mouse durante o arrasto */}
      {draggingPiece &&
        drag &&
        createPortal(
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rotate-3 rounded-2xl border-2 border-sky-500 bg-sky-500 px-4 py-2.5 font-display text-lg font-bold text-white shadow-xl"
          style={{ left: drag.x, top: drag.y }}
          aria-hidden
        >
          {draggingPiece.english}
        </div>,
          document.body
        )}

      <LessonFooter
        status={done ? "correct" : "idle"}
        title="Tudo no lugar!"
        actionLabel="Continuar"
        disabled={!done}
        onAction={() => {
          window.clearTimeout(timer.current);
          onComplete(errors === 0);
        }}
      />
    </div>
  );
}
