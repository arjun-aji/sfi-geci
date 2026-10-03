import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { authenticateRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'notes' | 'question-paper' | undefined;
    const categories = await DataService.getCategories(type);
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.name || !body.type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }

    const slug = body.slug || slugify(body.name);
    const saved = await DataService.saveCategory({ ...body, slug });
    return NextResponse.json({ success: true, category: saved });
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

    await DataService.deleteCategory(id);
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
