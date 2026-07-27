import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game, Analytics } from '@/lib/models';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const game = await Game.findOne({ slug });
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    game.totalPlays++;
    await game.save();
    await Analytics.create({ game: game._id, event: 'play', ip: req.headers.get('x-forwarded-for') || 'unknown', userAgent: req.headers.get('user-agent') || '' });
    return NextResponse.json({ success: true, totalPlays: game.totalPlays });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
