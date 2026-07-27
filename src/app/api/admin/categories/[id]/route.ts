import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Category, Game } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authMiddleware(req);
    if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const category = await Category.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true });
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ category });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authMiddleware(req);
    if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    await connectDB();
    const { id } = await params;
    const gc = await Game.countDocuments({ category: id });
    if (gc > 0) return NextResponse.json({ error: 'Category has games' }, { status: 400 });
    const c = await Category.findByIdAndDelete(id);
    if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted' });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
