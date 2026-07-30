import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
  const collections = await db.listCollections().toArray();
  const data: Record<string, any> = {};
  for (const col of collections) {
    const docs = await db.collection(col.name).find({}).toArray();
    data[col.name] = docs;
  }
  return NextResponse.json({ collections: data });
}
