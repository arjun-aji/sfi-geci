import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { authenticateRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const slug = searchParams.get('slug');

    if (slug) {
      const event = await DataService.getEventBySlug(slug);
      if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      return NextResponse.json({ success: true, event });
    }

    const events = await DataService.getEvents(!all);
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.title || !body.description || !body.venue || !body.eventDate) {
      return NextResponse.json({ error: 'Title, description, venue, and date are required' }, { status: 400 });
    }

    const slug = body.slug || slugify(body.title);
    const saved = await DataService.saveEvent({ ...body, slug });
    return NextResponse.json({ success: true, event: saved });
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

    await DataService.deleteEvent(id);
    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
