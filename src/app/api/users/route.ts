import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Superadmin privileges required' }, { status: 403 });
    }

    const users = await DataService.getUsers();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Superadmin privileges required' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const saved = await DataService.saveUser(body);
    return NextResponse.json({ success: true, user: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Superadmin privileges required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await DataService.deleteUser(id);
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
