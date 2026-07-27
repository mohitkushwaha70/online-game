import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Comment, Game } from '@/lib/models';
import { authMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const game = await Game.findOne({ slug });
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const comments = await Comment.find({ game: game._id, isReported: false }).populate('user', 'username displayName avatar').sort('-createdAt').limit(50);
    return NextResponse.json({ comments });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
    await connectDB();
    const { slug } = await params;
    const { text, rating } = await req.json();
    if (!text) return NextResponse.json({ error: 'Comment text required' }, { status: 400 });
    const game = await Game.findOne({ slug });
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const comment = await Comment.create({ game: game._id, user: user._id, text, rating: rating || 5 });
    game.totalComments++;
    await game.save();
    return NextResponse.json({ comment }, { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
