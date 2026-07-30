import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Notification, User } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const notifications = await Notification.find().populate('user', 'username displayName').sort('-createdAt').limit(50);
  return NextResponse.json({ notifications });
}

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const { title, message, type, target } = await req.json();
  if (target === 'all') {
    const users = await User.find({ isActive: true }).select('_id');
    const notifications = users.map(u => ({ user: u._id, title, message, type: type || 'info' }));
    await Notification.insertMany(notifications);
  } else {
    await Notification.create({ user, title, message, type: type || 'info' });
  }
  return NextResponse.json({ success: true }, { status: 201 });
}
