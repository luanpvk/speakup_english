export type UserRole = "parent" | "child";

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  childProfileId?: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  childProfileId?: string;
  avatarEmoji?: string;
}

export interface RegisterParentInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginParentInput {
  email: string;
  password: string;
}

export interface LoginChildInput {
  username: string;
  pin: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  accessibleFont: boolean;
  lowStimulusMode: boolean;
  soundEnabled: boolean;
}
