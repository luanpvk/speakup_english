import mongoose, { Schema, type Model } from "mongoose";
import type { IUser } from "@/modules/types/models";
import type { UserRole } from "@/types";

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["parent", "child"] satisfies UserRole[],
      required: true,
    },
    parentId: { type: Schema.Types.ObjectId, ref: "Parent" },
    isEmailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);
