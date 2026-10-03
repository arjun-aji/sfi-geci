import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISemester extends Document {
  code: string; // S1, S2, S3, S4, S5, S6, S7, S8
  name: string; // Semester 1, Semester 2...
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SemesterSchema = new Schema<ISemester>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    order: { type: Number, required: true, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Semester: Model<ISemester> =
  mongoose.models.Semester || mongoose.model<ISemester>('Semester', SemesterSchema);
