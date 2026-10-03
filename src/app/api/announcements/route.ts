import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const announcements = await DataService.getAnnouncements(!all);
    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.title || !body.shortDescription || !body.content) {
      return NextResponse.json({ error: 'Title, summary, and content are required' }, { status: 400 });
    }

    const saved = await DataService.saveAnnouncement(body);
    return NextResponse.json({ success: true, announcement: saved });
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

    await DataService.deleteAnnouncement(id);
    return NextResponse.json({ success: true, message: 'Announcement deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
