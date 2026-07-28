import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Category, Game } from '@/lib/models';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const category = await Category.findOne({ slug, isActive: true });
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const games = await Game.find({ category: category._id, status: 'active' }).populate('category', 'name slug color').sort('-totalPlays').limit(50);
    const res = NextResponse.json({ category, games });
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return res;
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
