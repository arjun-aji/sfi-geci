import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updated = await DataService.incrementMaterialDownload(id);
    if (!updated) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      downloadCount: updated.downloadCount,
      fileUrl: updated.fileUrl,
      fileSource: updated.fileSource,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
