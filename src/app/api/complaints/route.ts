import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { authenticateRequest } from '@/lib/auth';

// Admin GET all complaints (strict authorization)
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const priority = searchParams.get('priority') || undefined;

    const complaints = await DataService.getComplaints({ status, category, priority });
    return NextResponse.json({ success: true, count: complaints.length, complaints });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Student POST new complaint (public grievance submission)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.department || !body.semester || !body.category || !body.subject || !body.description) {
      return NextResponse.json(
        { error: 'Department, semester, category, subject, and description are required.' },
        { status: 400 }
      );
    }

    const created = await DataService.createComplaint({
      studentName: body.studentName,
      email: body.email,
      department: body.department,
      semester: body.semester,
      category: body.category,
      subject: body.subject,
      description: body.description,
      attachmentUrl: body.attachmentUrl,
      isAnonymous: Boolean(body.isAnonymous),
    });

    return NextResponse.json(
      {
        success: true,
        complaintNumber: created.complaintNumber,
        message: 'Your grievance has been lodged securely. Please save your reference ID for tracking.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
