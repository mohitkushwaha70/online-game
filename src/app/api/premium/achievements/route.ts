import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
    return NextResponse.json({ achievements: user.achievements || [] });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
