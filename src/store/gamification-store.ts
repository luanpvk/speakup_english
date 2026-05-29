import { create } from "zustand";

interface CelebrationState {
  show: boolean;
  title: string;
  message: string;
  xp?: number;
  coins?: number;
}

interface GamificationStore {
  celebration: CelebrationState;
  showCelebration: (data: Omit<CelebrationState, "show">) => void;
  hideCelebration: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
}

export const useGamificationStore = create<GamificationStore>((set) => ({
  celebration: { show: false, title: "", message: "" },
  showCelebration: (data) =>
    set({ celebration: { ...data, show: true } }),
  hideCelebration: () =>
    set((s) => ({ celebration: { ...s.celebration, show: false } })),
  soundEnabled: true,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
}));
