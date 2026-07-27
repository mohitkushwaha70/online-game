import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game } from '@/lib/models';
import { authMiddleware } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
    await connectDB();
    const { slug } = await params;
    const game = await Game.findOne({ slug });
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    game.totalLikes++;
    await game.save();
    return NextResponse.json({ success: true, totalLikes: game.totalLikes });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
