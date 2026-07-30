import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Notification } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: any) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const { id } = await params;
  await Notification.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
