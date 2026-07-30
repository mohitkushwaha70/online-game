import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteConfig } from '@/lib/models';
import { authMiddleware, adminMiddleware } from '@/lib/auth';
export const dynamic = 'force-dynamic';

const defaults = { siteName: 'ONLINE GAME', siteUrl: '', accentColor: '#6842FF', analyticsId: '' };

async function loadSettings() {
  await connectDB();
  const docs = await SiteConfig.find({});
  const settings: Record<string, any> = { ...defaults };
  for (const doc of docs) settings[doc.key] = doc.value;
  return settings;
}

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  const settings = await loadSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || !await adminMiddleware(user)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  await connectDB();
  const data = await req.json();
  for (const [key, value] of Object.entries(data)) {
    await SiteConfig.findOneAndUpdate({ key }, { key, value }, { upsert: true });
  }
  const settings = await loadSettings();
  return NextResponse.json({ settings });
}
