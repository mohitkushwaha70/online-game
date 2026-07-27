import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Game, Category } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authMiddleware(req);
    if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    await connectDB();
    const { id } = await params;
    const game = await Game.findById(id).populate('category', 'name slug');
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ game });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authMiddleware(req);
    if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const game = await Game.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true });
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ game });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authMiddleware(req);
    if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    await connectDB();
    const { id } = await params;
    const game = await Game.findByIdAndDelete(id);
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (game.category) await Category.findByIdAndUpdate(game.category, { $inc: { gameCount: -1 } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
