import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  imagePublicId?: string;
  priority: 'normal' | 'important' | 'urgent';
  publishedAt: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String },
    priority: { type: String, enum: ['normal', 'important', 'urgent'], default: 'normal' },
    publishedAt: { type: Date, default: Date.now, index: true },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
