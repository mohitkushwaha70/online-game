import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game } from '@/lib/models';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    await connectDB();
    const games = await Game.find({ status: 'active', isOriginal: true }).populate('category', 'name slug color').sort('-totalPlays').limit(20);
    return NextResponse.json({ games });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
