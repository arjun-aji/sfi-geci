import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const material = await DataService.getMaterialById(id);
    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, material });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const fileUrl =
      body.fileSource === 'cloudinary'
        ? body.cloudinaryUrl || body.fileUrl
        : body.externalUrl || body.fileUrl;

    const updated = await DataService.saveMaterial({
      ...body,
      fileUrl,
      _id: id as any,
    });

    return NextResponse.json({ success: true, material: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await DataService.deleteMaterial(id);
    return NextResponse.json({ success: true, message: 'Material deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
