import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game, User, Category, Analytics } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await authMiddleware(req);
    if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    await connectDB();
    const totalGames = await Game.countDocuments();
    const activeGames = await Game.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments();
    const totalCategories = await Category.countDocuments();
    const tp = await Game.aggregate([{ $group: { _id: null, total: { $sum: '$totalPlays' } } }]);
    const tl = await Game.aggregate([{ $group: { _id: null, total: { $sum: '$totalLikes' } } }]);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayPlays = await Analytics.countDocuments({ event: 'play', timestamp: { $gte: today } });
    const topGames = await Game.find({ status: 'active' }).populate('category', 'name').sort('-totalPlays').limit(10);
    const recentPlays = await Analytics.find({ event: 'play' }).populate('game', 'name slug').sort('-timestamp').limit(20);
    const playsByDay = await Analytics.aggregate([
      { $match: { event: 'play', timestamp: { $gte: new Date(Date.now() - 7 * 864e5) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const categoryStats = await Category.aggregate([
      { $lookup: { from: 'games', localField: '_id', foreignField: 'category', as: 'games' } },
      { $project: { name: 1, gameCount: { $size: '$games' }, totalPlays: { $sum: '$games.totalPlays' } } },
      { $sort: { totalPlays: -1 } },
    ]);
    return NextResponse.json({
      stats: { totalGames, activeGames, totalUsers, totalCategories, todayPlays, totalPlays: tp[0]?.total || 0, totalLikes: tl[0]?.total || 0 },
      topGames, recentPlays, playsByDay, categoryStats,
    });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
