import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { authenticateRequest } from '@/lib/auth';
import { MEMBER_POSITIONS, POSITION_LIMITS, normalizePosition, MemberPosition } from '@/models/UnitMember';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const academicYear = searchParams.get('academicYear') || undefined;
    const all = searchParams.get('all') === 'true';

    const members = await DataService.getMembers(academicYear, !all);
    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const position = normalizePosition(body.position);
    const academicYear = body.academicYear?.trim() || '2026-27';
    const department = body.department?.trim() || 'GECI';
    const semester = body.semester?.trim() || 'Unit';

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: 'Name is required.' },
        { status: 400 }
      );
    }

    // Validate leadership position limits per academic year when active
    const isActive = body.isActive !== false;
    const limit = POSITION_LIMITS[position];

    if (isActive && limit !== undefined) {
      const existingMembers = await DataService.getMembers(academicYear, true);
      const currentCount = existingMembers.filter(
        (m: any) =>
          normalizePosition(m.position) === position &&
          String(m._id) !== String(body._id || '')
      ).length;

      if (currentCount >= limit) {
        const title = limit === 1 ? `one active ${position}` : `${limit} active ${position}s`;
        return NextResponse.json(
          { error: `Only ${title} can be assigned for academic year ${academicYear}.` },
          { status: 400 }
        );
      }
    }

    // Normalize payload with standardized position and defaults
    const payload = {
      ...body,
      name: body.name.trim(),
      position,
      department,
      semester,
      academicYear,
      phone: body.phone?.trim() || '',
      photoUrl: body.photoUrl?.trim() || '',
      order: typeof body.order === 'number' ? body.order : parseInt(body.order, 10) || 0,
      isActive,
    };

    const saved = await DataService.saveMember(payload);
    return NextResponse.json({ success: true, member: saved });
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

    await DataService.deleteMember(id);
    return NextResponse.json({ success: true, message: 'Member deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
