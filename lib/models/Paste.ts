
import mongoose from "mongoose";

const PasteSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    expiresAt: Date,
    maxViews: Number,
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ DO NOT USE ARROW FUNCTION
PasteSchema.methods.isAvailable = function () {
  if (this.expiresAt && this.expiresAt < new Date()) return false;
  if (this.maxViews && this.views >= this.maxViews) return false;
  return true;
};

PasteSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

export const Paste =
  mongoose.models.Paste || mongoose.model("Paste", PasteSchema);
