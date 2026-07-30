import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game, Analytics, User } from '@/lib/models';
import { authMiddleware } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const game = await Game.findOne({ slug });
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    game.totalPlays++;
    await game.save();
    await Analytics.create({ game: game._id, event: 'play', ip: req.headers.get('x-forwarded-for') || 'unknown', userAgent: req.headers.get('user-agent') || '' });
    const user = await authMiddleware(req);
    if (user) {
      const u = await User.findById(user._id);
      if (u) {
        u.recentlyPlayed = u.recentlyPlayed.filter(id => id.toString() !== game._id.toString());
        u.recentlyPlayed.push(game._id);
        if (u.recentlyPlayed.length > 20) u.recentlyPlayed = u.recentlyPlayed.slice(-20);
        await u.save();
      }
    }
    return NextResponse.json({ success: true, totalPlays: game.totalPlays });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
