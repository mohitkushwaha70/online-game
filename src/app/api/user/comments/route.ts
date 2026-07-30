import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Comment } from '@/lib/models';
import { authMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const comments = await Comment.find({ user: user._id })
    .populate('game', 'name slug thumbnail color categorySlug')
    .sort('-createdAt')
    .limit(50);
  return NextResponse.json({ comments });
}
