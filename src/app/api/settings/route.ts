import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteConfig } from '@/lib/models';
export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const docs = await SiteConfig.find({});
  const settings: Record<string, any> = { siteName: 'ONLINE GAME', accentColor: '#6842FF', analyticsId: '' };
  for (const doc of docs) settings[doc.key] = doc.value;
  return NextResponse.json({ settings });
}
