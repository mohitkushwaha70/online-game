import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { authMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const u = await User.findById(user._id).populate('recentlyPlayed');
  return NextResponse.json({ recent: u?.recentlyPlayed?.reverse() || [] });
}
