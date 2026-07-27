import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select('username displayName avatar xp level coins premium isActive').sort('-xp').limit(20);
    return NextResponse.json({ leaderboard: users });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
