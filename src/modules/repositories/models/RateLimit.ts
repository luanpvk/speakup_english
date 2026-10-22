import mongoose, { Schema, type Model } from "mongoose";

interface IRateLimit {
  key: string;
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  // TTL: o Mongo apaga a janela expirada sozinho
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit ?? mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
