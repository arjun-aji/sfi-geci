import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'sfi-geci/general';
    let resourceType = (formData.get('resourceType') as 'auto' | 'image' | 'video' | 'raw') || 'auto';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type?.startsWith('video/')) {
      resourceType = 'video';
    } else if (file.type?.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf')) {
      resourceType = 'raw';
    }

    // Size limit check (max 100MB for video, 25MB for other)
    const maxLimit = resourceType === 'video' ? 100 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxLimit) {
      return NextResponse.json(
        { error: `File size exceeds ${resourceType === 'video' ? '100MB' : '25MB'} limit` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadBufferToCloudinary(
      buffer,
      folder,
      resourceType,
      file.name
    );

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      bytes: uploadResult.bytes,
      format: uploadResult.format,
      fileName: file.name,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
