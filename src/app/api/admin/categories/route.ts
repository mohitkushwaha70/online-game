import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Category } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await Category.find().sort('sortOrder name');
    return NextResponse.json({ categories });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
