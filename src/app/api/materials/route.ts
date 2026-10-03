import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'notes' | 'question-paper' | undefined;
    const department = searchParams.get('department') || undefined;
    const semester = searchParams.get('semester') || undefined;
    const subject = searchParams.get('subject') || undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const all = searchParams.get('all') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const materials = await DataService.getMaterials({
      type,
      department,
      semester,
      subject,
      category,
      search,
      publishedOnly: !all,
      limit,
    });

    return NextResponse.json({ success: true, count: materials.length, materials });
  } catch (error: any) {
    console.error('Error fetching materials:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.title || !body.type || !body.department || !body.semester || !body.subject) {
      return NextResponse.json(
        { error: 'Title, type, department, semester, and subject are required.' },
        { status: 400 }
      );
    }

    if (!body.fileSource || (body.fileSource !== 'cloudinary' && body.fileSource !== 'external')) {
      return NextResponse.json({ error: 'Valid file source is required.' }, { status: 400 });
    }

    if (body.fileSource === 'external' && !body.externalUrl) {
      return NextResponse.json({ error: 'External URL is required for external link source.' }, { status: 400 });
    }

    if (body.fileSource === 'cloudinary' && !body.cloudinaryUrl && !body.fileUrl) {
      return NextResponse.json({ error: 'Cloudinary URL is required for uploaded file.' }, { status: 400 });
    }

    const fileUrl = body.fileSource === 'cloudinary' ? body.cloudinaryUrl || body.fileUrl : body.externalUrl;

    const newMaterial = await DataService.saveMaterial({
      ...body,
      fileUrl,
      uploadedBy: user.name,
    });

    return NextResponse.json({ success: true, material: newMaterial }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating material:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
