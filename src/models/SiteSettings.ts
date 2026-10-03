import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  websiteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  announcementTicker: string;
  contactEmail: string;
  phone: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl?: string;
  youtubeUrl: string;
  footerText: string;
  aboutText: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    websiteName: { type: String, default: "SFI GECI" },
    tagline: { type: String, default: "Students' Federation of India - Government Engineering College Idukki" },
    heroTitle: { type: String, default: "STUDY & STRUGGLE" },
    heroSubtitle: {
      type: String,
      default: "Official digital portal and academic resource sanctuary of SFI Government Engineering College Idukki Unit.",
    },
    announcementTicker: { type: String, default: "Welcome to SFI GECI Portal • KTU B.Tech Notes & Previous Question Papers Repository now updated!" },
    contactEmail: { type: String, default: "sfigecidukkiunit@gmail.com" },
    phone: { type: String, default: "+91 92078 81324" },
    address: { type: String, default: "Government Engineering College Idukki, Painavu, Idukki, Kerala 685603" },
    instagramUrl: { type: String, default: "https://www.instagram.com/sfigeci?stkn=eGpvMTR5NGcycWw2" },
    facebookUrl: { type: String, default: "https://www.facebook.com/share/19TYtp22RP/?mibextid=wwXIfr" },
    whatsappUrl: { type: String, default: "https://whatsapp.com/channel/0029VaWgEOBC1Fu36Tlm0L0Q" },
    youtubeUrl: { type: String, default: "https://youtube.com/@sfigeci" },
    footerText: { type: String, default: "Students' Federation of India - GEC Idukki Unit. Independence, Democracy, Socialism." },
    aboutText: {
      type: String,
      default:
        "SFI GECI represents the vibrant student community of Government Engineering College Idukki, standing steadfast for student rights, progressive education, and holistic academic welfare.",
    },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
