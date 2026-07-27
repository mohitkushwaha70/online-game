import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await authMiddleware(req);
    if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    await connectDB();
    const users = await User.find().select('-password').sort('-createdAt');
    return NextResponse.json({ users });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
