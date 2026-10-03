import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComplaintCategory extends Document {
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintCategorySchema = new Schema<IComplaintCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ComplaintCategory: Model<IComplaintCategory> =
  mongoose.models.ComplaintCategory || mongoose.model<IComplaintCategory>('ComplaintCategory', ComplaintCategorySchema);
