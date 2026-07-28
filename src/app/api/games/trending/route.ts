import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game } from '@/lib/models';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    await connectDB();
    const games = await Game.find({ status: 'active' }).populate('category', 'name slug color').sort('-totalPlays').limit(20);
    const res = NextResponse.json({ games });
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return res;
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
