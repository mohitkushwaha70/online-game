import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game, Category } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    let { category, search, label, sort = '-createdAt', page = '1', limit = '20', isPremium, status } = Object.fromEntries(searchParams);
    const p = parseInt(page); const l = parseInt(limit);
    const query: any = {};
    if (status) query.status = status; else query.status = 'active';
    if (category) { const c = await Category.findOne({ slug: category }); if (c) query.category = c._id; }
    if (isPremium === 'true') query.isPremium = true;
    if (label) query.labels = { $in: [label] };
    if (search) query.$text = { $search: search };
    const games = await Game.find(query).populate('category', 'name slug color').sort(sort).skip((p - 1) * l).limit(l);
    const total = await Game.countDocuments(query);
    return NextResponse.json({ games, total, page: p, pages: Math.ceil(total / l) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
