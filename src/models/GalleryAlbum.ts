import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryImage {
  url: string;
  caption?: string;
  publicId?: string;
}

export interface IGalleryAlbum extends Document {
  title: string;
  description: string;
  date: Date;
  coverImageUrl: string;
  coverImagePublicId?: string;
  images: IGalleryImage[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>({
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  publicId: { type: String },
});

const GalleryAlbumSchema = new Schema<IGalleryAlbum>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    coverImageUrl: { type: String, required: true },
    coverImagePublicId: { type: String },
    images: [GalleryImageSchema],
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const GalleryAlbum: Model<IGalleryAlbum> =
  mongoose.models.GalleryAlbum || mongoose.model<IGalleryAlbum>('GalleryAlbum', GalleryAlbumSchema);
