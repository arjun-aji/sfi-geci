import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  MEMBER_POSITIONS,
  POSITION_LIMITS,
  normalizePosition,
  MemberPosition,
} from '@/lib/member-constants';

export { MEMBER_POSITIONS, POSITION_LIMITS, normalizePosition };
export type { MemberPosition };

export interface IUnitMember extends Document {
  name: string;
  position: MemberPosition | string;
  department: string;
  semester: string;
  academicYear: string;
  photoUrl: string;
  photoPublicId?: string;
  bio?: string;
  phone?: string;
  email?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UnitMemberSchema = new Schema<IUnitMember>(
  {
    name: { type: String, required: true, trim: true },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    department: { type: String, default: 'GECI', uppercase: true, trim: true },
    semester: { type: String, default: 'Unit', uppercase: true, trim: true },
    academicYear: { type: String, default: '2026-27', index: true },
    photoUrl: { type: String, default: '' },
    photoPublicId: { type: String },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UnitMemberSchema.index({ academicYear: 1, position: 1, order: 1 });

export const UnitMember: Model<IUnitMember> =
  mongoose.models.UnitMember || mongoose.model<IUnitMember>('UnitMember', UnitMemberSchema);
