import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  posterUrl: string;
  posterPublicId?: string;
  eventDate: Date;
  eventTime: string;
  venue: string;
  category: string; // Cultural, Technical, Academic, Social, Sports
  registrationUrl?: string;
  images: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    posterUrl: { type: String, default: '' },
    posterPublicId: { type: String },
    eventDate: { type: Date, required: true, index: true },
    eventTime: { type: String, default: '10:00 AM' },
    venue: { type: String, required: true },
    category: { type: String, default: 'General' },
    registrationUrl: { type: String, default: '' },
    images: [{ type: String }],
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
