import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { password, ...u } = user.toObject();
    return NextResponse.json({ user: u });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
