import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Coupon } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const coupons = await Coupon.find().sort('-createdAt');
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const data = await req.json();
  const coupon = await Coupon.create(data);
  return NextResponse.json({ coupon }, { status: 201 });
}
