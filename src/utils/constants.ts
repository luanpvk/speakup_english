export const APP_NAME = "SpeakUp English";
export const APP_DESCRIPTION =
  "Plataforma educacional de inglês gamificada e acessível para crianças.";

export const ROUTES = {
  home: "/",
  loginParent: "/login/parent",
  loginChild: "/login/child",
  loginChildFor: (username: string, displayName?: string) => {
    const params = new URLSearchParams({ username: username.toLowerCase() });
    if (displayName) params.set("name", displayName);
    return `/login/child?${params.toString()}`;
  },
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  lessons: "/dashboard/lessons",
  lesson: (slug: string) => `/dashboard/lessons/${slug}`,
  profile: "/dashboard/profile",
  shop: "/dashboard/shop",
  ranking: "/dashboard/ranking",
  progress: "/dashboard/progress",
  achievements: "/dashboard/achievements",
  avatar: "/dashboard/avatar",
  flashcards: "/dashboard/flashcards",
} as const;

export const MAX_DAILY_FLASHCARDS = 10;
