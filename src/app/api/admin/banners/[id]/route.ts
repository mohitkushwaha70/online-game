import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Banner } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: any) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const data = await req.json();
  const { id } = await params;
  const banner = await Banner.findByIdAndUpdate(id, data, { new: true });
  if (!banner) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ banner });
}

export async function DELETE(req: NextRequest, { params }: any) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const { id } = await params;
  await Banner.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
