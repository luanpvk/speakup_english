import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import {
  signAccessToken,
  signRefreshToken,
  type TokenUser,
} from "@/lib/auth/jwt";
import { hashPassword, comparePassword, hashPin, comparePin } from "@/lib/auth/password";
import {
  User,
  Parent,
  ChildProfile,
  AccessibilitySettings,
  Streak,
  RefreshToken,
  Avatar,
} from "@/modules/repositories/models";
import type { AuthUser } from "@/types";

function toAuthUser(
  user: { _id: { toString: () => string }; email: string; name: string; role: "parent" | "child" },
  childProfileId?: string,
  avatarEmoji?: string
): AuthUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    childProfileId,
    avatarEmoji,
  };
}

async function createRefreshTokenRecord(userId: string): Promise<string> {
  const tokenId = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId,
    tokenId,
    expiresAt,
  });

  return tokenId;
}

export async function registerParent(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
  await connectDB();

  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new Error("E-mail já cadastrado");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    email: input.email.toLowerCase(),
    passwordHash,
    name: input.name,
    role: "parent",
    isEmailVerified: false,
  });

  await Parent.create({
    userId: user._id,
    children: [],
  });

  await AccessibilitySettings.create({
    userId: user._id,
    reduceMotion: false,
    highContrast: false,
    accessibleFont: false,
    lowStimulusMode: false,
    soundEnabled: true,
  });

  const tokenUser: TokenUser = {
    userId: user._id.toString(),
    email: user.email,
    role: "parent",
  };

  const tokenId = await createRefreshTokenRecord(user._id.toString());
  const accessToken = signAccessToken(tokenUser);
  const refreshToken = signRefreshToken({ ...tokenUser, tokenId });

  return {
    user: toAuthUser(user),
    accessToken,
    refreshToken,
  };
}

export async function loginParent(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
  await connectDB();

  const user = await User.findOne({ email: input.email.toLowerCase() })
    .select("+passwordHash")
    .lean();

  if (!user || user.role !== "parent") {
    throw new Error("Credenciais inválidas");
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw new Error("Credenciais inválidas");
  }

  const tokenUser: TokenUser = {
    userId: user._id.toString(),
    email: user.email,
    role: "parent",
  };

  const tokenId = await createRefreshTokenRecord(user._id.toString());
  const accessToken = signAccessToken(tokenUser);
  const refreshToken = signRefreshToken({ ...tokenUser, tokenId });

  return {
    user: toAuthUser(user as Parameters<typeof toAuthUser>[0]),
    accessToken,
    refreshToken,
  };
}

export async function loginChild(input: {
  username: string;
  pin: string;
}): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
  await connectDB();

  const profile = await ChildProfile.findOne({
    username: input.username.toLowerCase(),
    isActive: true,
  })
    .select("+pinHash")
    .populate<{ userId: { _id: { toString: () => string }; email: string; name: string; role: string } }>("userId")
    .lean();

  if (!profile) {
    throw new Error("Usuário ou PIN incorretos");
  }

  const valid = await comparePin(input.pin, profile.pinHash);
  if (!valid) {
    throw new Error("Usuário ou PIN incorretos");
  }

  const childUser = profile.userId;
  const tokenUser: TokenUser = {
    userId: childUser._id.toString(),
    email: childUser.email,
    role: "child",
    childProfileId: profile._id.toString(),
  };

  const tokenId = await createRefreshTokenRecord(childUser._id.toString());
  const accessToken = signAccessToken(tokenUser);
  const refreshToken = signRefreshToken({ ...tokenUser, tokenId });

  return {
    user: {
      id: childUser._id.toString(),
      email: childUser.email,
      name: profile.displayName,
      role: "child",
      childProfileId: profile._id.toString(),
      avatarEmoji: profile.avatarEmoji,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshSession(
  refreshTokenValue: string
): Promise<{ accessToken: string; refreshToken: string }> {
  await connectDB();
  const { verifyRefreshToken } = await import("@/lib/auth/jwt");
  const payload = verifyRefreshToken(refreshTokenValue);

  const stored = await RefreshToken.findOne({
    tokenId: payload.tokenId,
    userId: payload.userId,
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new Error("Sessão expirada");
  }

  await RefreshToken.deleteOne({ _id: stored._id });
  const tokenId = await createRefreshTokenRecord(payload.userId);

  const tokenUser: TokenUser = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    childProfileId: payload.childProfileId,
  };

  const accessToken = signAccessToken(tokenUser);
  const refreshToken = signRefreshToken({ ...tokenUser, tokenId });

  return { accessToken, refreshToken };
}

export async function logoutUser(refreshTokenValue?: string): Promise<void> {
  if (!refreshTokenValue) return;
  await connectDB();
  try {
    const { verifyRefreshToken } = await import("@/lib/auth/jwt");
    const payload = verifyRefreshToken(refreshTokenValue);
    await RefreshToken.deleteOne({ tokenId: payload.tokenId });
  } catch {
    // Token invalid — ignore
  }
}

export async function forgotPassword(email: string): Promise<{ resetToken?: string }> {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase(), role: "parent" });
  if (!user) {
    return {};
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  return {
    resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
  };
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await connectDB();
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
    role: "parent",
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) {
    throw new Error("Token inválido ou expirado");
  }

  user.passwordHash = await hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
}

export async function getCurrentUser(userId: string): Promise<AuthUser | null> {
  await connectDB();
  const user = await User.findById(userId).lean();
  if (!user) return null;

  let childProfileId: string | undefined;
  let avatarEmoji: string | undefined;
  let displayName = user.name;

  if (user.role === "child") {
    const profile = await ChildProfile.findOne({ userId: user._id }).lean();
    childProfileId = profile?._id.toString();
    avatarEmoji = profile?.avatarEmoji;
    displayName = profile?.displayName ?? user.name;
  }

  return toAuthUser(
    { ...user, name: displayName } as Parameters<typeof toAuthUser>[0],
    childProfileId,
    avatarEmoji
  );
}

export async function createChildForParent(
  parentUserId: string,
  input: {
    displayName: string;
    username: string;
    pin: string;
    avatarEmoji?: string;
    birthYear?: number;
  }
): Promise<AuthUser> {
  await connectDB();

  const parentRecord = await Parent.findOne({ userId: parentUserId });
  if (!parentRecord) {
    throw new Error("Perfil de responsável não encontrado");
  }

  const username = input.username.toLowerCase();
  const exists = await ChildProfile.findOne({ username });
  if (exists) {
    throw new Error("Nome de usuário já em uso");
  }

  const pinHash = await hashPin(input.pin);
  const childEmail = `${username}@child.speakup.local`;

  const childUser = await User.create({
    email: childEmail,
    passwordHash: await hashPassword(crypto.randomBytes(16).toString("hex")),
    name: input.displayName,
    role: "child",
    parentId: parentRecord._id,
    isEmailVerified: true,
  });

  const profile = await ChildProfile.create({
    parentId: parentRecord._id,
    userId: childUser._id,
    displayName: input.displayName,
    username,
    pinHash,
    avatarEmoji: input.avatarEmoji ?? "🦊",
    birthYear: input.birthYear,
    ownedItemSlugs: ["hair-default", "clothes-default"],
  });

  parentRecord.children.push(profile._id);
  await parentRecord.save();

  await AccessibilitySettings.create({
    userId: childUser._id,
    childProfileId: profile._id,
    reduceMotion: false,
    highContrast: false,
    accessibleFont: true,
    lowStimulusMode: true,
    soundEnabled: true,
  });

  await Streak.create({
    childProfileId: profile._id,
    currentStreak: 0,
    longestStreak: 0,
  });

  await Avatar.create({
    childProfileId: profile._id,
    baseEmoji: profile.avatarEmoji,
    hairSlug: "hair-default",
    clothesSlug: "clothes-default",
  });

  return {
    id: childUser._id.toString(),
    email: childUser.email,
    name: input.displayName,
    role: "child",
    childProfileId: profile._id.toString(),
  };
}
