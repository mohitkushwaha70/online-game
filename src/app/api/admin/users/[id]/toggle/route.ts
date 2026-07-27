import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authMiddleware(req);
    if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    await connectDB();
    const { id } = await params;
    const u = await User.findById(id);
    if (!u) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    u.isActive = !u.isActive;
    await u.save();
    return NextResponse.json({ user: { id: u._id, isActive: u.isActive } });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
