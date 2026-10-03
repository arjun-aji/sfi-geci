import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMaterial extends Document {
  title: string;
  description: string;
  type: 'notes' | 'question-paper';
  department: string; // CSE, IT, EEE, ECE, ME, RAI
  semester: string; // S1..S8
  subject: string; // Subject name or code
  academicYear?: string;
  category?: string; // Class Notes, Unit Notes, University Examination, etc.
  unitNumber?: number; // 1, 2, 3, 4, 5... (for notes)
  examYear?: number; // 2026, 2025, 2024... (for question papers)
  fileSource: 'cloudinary' | 'external';
  fileUrl: string; // resolved URL to access/download
  cloudinaryUrl?: string;
  externalUrl?: string;
  cloudinaryPublicId?: string;
  fileName?: string;
  fileSize?: number;
  downloadCount: number;
  isPublished: boolean;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['notes', 'question-paper'], required: true, index: true },
    department: { type: String, required: true, uppercase: true, trim: true, index: true },
    semester: { type: String, required: true, uppercase: true, trim: true, index: true },
    subject: { type: String, required: true, trim: true, index: true },
    academicYear: { type: String, trim: true, index: true },
    category: { type: String, trim: true, index: true },
    unitNumber: { type: Number },
    examYear: { type: Number, index: true },
    fileSource: { type: String, enum: ['cloudinary', 'external'], required: true },
    fileUrl: { type: String, required: true },
    cloudinaryUrl: { type: String },
    externalUrl: { type: String },
    cloudinaryPublicId: { type: String },
    fileName: { type: String },
    fileSize: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true, index: true },
    uploadedBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

// Compound index for academic query performance
MaterialSchema.index({ type: 1, department: 1, semester: 1, subject: 1 });
MaterialSchema.index({ type: 1, isPublished: 1, createdAt: -1 });

export const Material: Model<IMaterial> =
  mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);
