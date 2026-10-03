import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || undefined;
    const semester = searchParams.get('semester') || undefined;
    const all = searchParams.get('all') === 'true';

    const subjects = await DataService.getSubjects(department, semester, !all);
    return NextResponse.json({ success: true, subjects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.name || !body.code || !body.department || !body.semester) {
      return NextResponse.json({ error: 'Name, code, department, and semester are required.' }, { status: 400 });
    }

    const saved = await DataService.saveSubject(body);
    return NextResponse.json({ success: true, subject: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await DataService.deleteSubject(id);
    return NextResponse.json({ success: true, message: 'Subject deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
