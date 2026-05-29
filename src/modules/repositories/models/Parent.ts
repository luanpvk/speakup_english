import mongoose, { Schema, type Model } from "mongoose";
import type { IParent } from "@/modules/types/models";

const ParentSchema = new Schema<IParent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    phone: { type: String, trim: true },
    children: [{ type: Schema.Types.ObjectId, ref: "ChildProfile" }],
  },
  { timestamps: true }
);

export const Parent: Model<IParent> =
  mongoose.models.Parent ?? mongoose.model<IParent>("Parent", ParentSchema);
