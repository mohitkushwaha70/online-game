import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { authMiddleware } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();

    const { avatar } = await req.json();
    if (!avatar) return NextResponse.json({ error: 'Avatar URL or data required' }, { status: 400 });

    const updated = await User.findByIdAndUpdate(user.id, { avatar }, { new: true }).select('avatar');
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ avatar: updated.avatar });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
