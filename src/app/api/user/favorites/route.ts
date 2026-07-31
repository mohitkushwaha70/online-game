import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { authMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const u = await User.findById(user._id).populate('favorites');
  return NextResponse.json({ favorites: u?.favorites || [] });
}

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { gameId } = await req.json();
  await connectDB();
  const u = await User.findById(user._id);
  if (!u) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (!u.favorites.some(id => id.toString() === gameId)) u.favorites.push(gameId);
  await u.save();
  const populated = await User.findById(user._id).populate('favorites');
  return NextResponse.json({ favorites: populated?.favorites || [] });
}

export async function DELETE(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { gameId } = await req.json();
  await connectDB();
  const u = await User.findById(user._id);
  if (!u) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  u.favorites = u.favorites.filter(id => id.toString() !== gameId);
  await u.save();
  const populated = await User.findById(user._id).populate('favorites');
  return NextResponse.json({ favorites: populated?.favorites || [] });
}
