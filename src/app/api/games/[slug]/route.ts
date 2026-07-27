import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game } from '@/lib/models';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const game = await Game.findOne({ slug, status: 'active' }).populate('category', 'name slug color');
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ game });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
