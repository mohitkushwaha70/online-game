import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { authMiddleware } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
    await connectDB();
    const u = await User.findById(user._id);
    if (!u) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const today = new Date().toDateString();
    const lastReward = (u as any).lastDailyReward;
    if (lastReward && new Date(lastReward).toDateString() === today) {
      return NextResponse.json({ error: 'Already claimed today' }, { status: 400 });
    }
    u.coins += 100;
    u.xp += 50;
    u.level = Math.floor(u.xp / 100) + 1;
    (u as any).lastDailyReward = new Date();
    await u.save();
    return NextResponse.json({ coins: u.coins, xp: u.xp, level: u.level, reward: { coins: 100, xp: 50 } });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
