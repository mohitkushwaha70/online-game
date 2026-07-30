import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Coupon } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: any) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const data = await req.json();
  const { id } = await params;
  const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
  if (!coupon) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ coupon });
}

export async function DELETE(req: NextRequest, { params }: any) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const { id } = await params;
  await Coupon.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
