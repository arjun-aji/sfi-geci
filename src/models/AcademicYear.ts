import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAcademicYear extends Document {
  year: string; // e.g. "2026-27"
  isCurrent: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicYearSchema = new Schema<IAcademicYear>(
  {
    year: { type: String, required: true, unique: true, trim: true },
    isCurrent: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AcademicYear: Model<IAcademicYear> =
  mongoose.models.AcademicYear || mongoose.model<IAcademicYear>('AcademicYear', AcademicYearSchema);
