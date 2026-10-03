import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const complaintNumber = searchParams.get('number');

    if (!complaintNumber) {
      return NextResponse.json({ error: 'Complaint reference number is required' }, { status: 400 });
    }

    const complaint = await DataService.getComplaintByNumber(complaintNumber);
    if (!complaint) {
      return NextResponse.json(
        { error: 'No complaint found with this reference number. Please verify the ID.' },
        { status: 404 }
      );
    }

    // Strictly sanitized output - zero internal notes or admin identifiers
    const sanitized = {
      complaintNumber: complaint.complaintNumber,
      subject: complaint.subject,
      category: complaint.category,
      department: complaint.department,
      semester: complaint.semester,
      status: complaint.status,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      timeline: ((complaint as any).statusHistory || []).map((h: any) => ({
        status: h.status,
        comment: h.comment,
        changedAt: h.changedAt,
      })),
    };

    return NextResponse.json({ success: true, tracking: sanitized });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
