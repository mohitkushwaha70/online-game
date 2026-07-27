import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await authMiddleware(req);
    if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query: any = status ? { status } : {};
    const games = await Game.find(query).populate('category', 'name slug').sort('-createdAt').limit(100);
    const total = await Game.countDocuments(query);
    return NextResponse.json({ games, total });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authMiddleware(req);
    if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    await connectDB();
    const body = await req.json();
    const game = await Game.create({ ...body, createdBy: user._id });
    return NextResponse.json({ game }, { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
