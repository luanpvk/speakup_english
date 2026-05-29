import { connectDB } from "@/lib/mongodb";
import {
  Parent,
  ChildProfile,
} from "@/modules/repositories/models";
import * as authService from "@/modules/services/auth.service";

export interface ChildListItem {
  id: string;
  childProfileId: string;
  displayName: string;
  username: string;
  avatarEmoji: string;
  level: number;
  xp: number;
  isActive: boolean;
}

export async function getChildrenForParent(parentUserId: string): Promise<ChildListItem[]> {
  await connectDB();

  const parentRecord = await Parent.findOne({ userId: parentUserId }).lean();
  if (!parentRecord) {
    return [];
  }

  const profiles = await ChildProfile.find({ parentId: parentRecord._id })
    .sort({ createdAt: -1 })
    .lean();

  return profiles.map((p) => ({
    id: p.userId.toString(),
    childProfileId: p._id.toString(),
    displayName: p.displayName,
    username: p.username,
    avatarEmoji: p.avatarEmoji,
    level: p.level,
    xp: p.xp,
    isActive: p.isActive,
  }));
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
) {
  const user = await authService.createChildForParent(parentUserId, input);
  const profile = await ChildProfile.findOne({ userId: user.id }).lean();
  return {
    id: user.id,
    childProfileId: user.childProfileId!,
    displayName: input.displayName,
    username: input.username.toLowerCase(),
    avatarEmoji: profile?.avatarEmoji ?? input.avatarEmoji ?? "🦊",
    level: profile?.level ?? 1,
    xp: profile?.xp ?? 0,
    isActive: true,
  } satisfies ChildListItem;
}
