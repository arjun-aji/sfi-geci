import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComplaintStatusHistory {
  status: string;
  comment?: string;
  changedBy: string;
  changedAt: Date;
}

export interface IComplaintInternalNote {
  note: string;
  author: string;
  createdAt: Date;
}

export interface IComplaint extends Document {
  complaintNumber: string; // e.g. SFI-2026-00001
  studentName?: string;
  email?: string;
  department: string;
  semester: string;
  category: string;
  subject: string;
  description: string;
  attachmentUrl?: string;
  isAnonymous: boolean;
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Rejected' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedTo?: string;
  internalNotes: IComplaintInternalNote[];
  statusHistory: IComplaintStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const StatusHistorySchema = new Schema<IComplaintStatusHistory>({
  status: { type: String, required: true },
  comment: { type: String, default: '' },
  changedBy: { type: String, default: 'Admin' },
  changedAt: { type: Date, default: Date.now },
});

const InternalNoteSchema = new Schema<IComplaintInternalNote>({
  note: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now },
});

const ComplaintSchema = new Schema<IComplaint>(
  {
    complaintNumber: { type: String, required: true, unique: true, index: true },
    studentName: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    department: { type: String, required: true, uppercase: true },
    semester: { type: String, required: true, uppercase: true },
    category: { type: String, required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    attachmentUrl: { type: String, default: '' },
    isAnonymous: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected', 'Closed'],
      default: 'Submitted',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
      index: true,
    },
    assignedTo: { type: String, default: 'Unassigned' },
    internalNotes: [InternalNoteSchema],
    statusHistory: [StatusHistorySchema],
  },
  { timestamps: true }
);

ComplaintSchema.index({ department: 1, status: 1 });
ComplaintSchema.index({ createdAt: -1 });

export const Complaint: Model<IComplaint> =
  mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
