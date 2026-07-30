import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Banner } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const banners = await Banner.find().sort('sortOrder');
  return NextResponse.json({ banners });
}

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const data = await req.json();
  const banner = await Banner.create(data);
  return NextResponse.json({ banner }, { status: 201 });
}
