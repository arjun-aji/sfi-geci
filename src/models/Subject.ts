import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string; // e.g. CST301
  department: string; // e.g. CSE
  semester: string; // e.g. S6
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    department: { type: String, required: true, uppercase: true, trim: true },
    semester: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SubjectSchema.index({ department: 1, semester: 1 });
SubjectSchema.index({ code: 1, department: 1, semester: 1 }, { unique: true });

export const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);
