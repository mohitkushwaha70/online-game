import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    user.lastLogin = new Date();
    user.loginCount++;
    await user.save();
    const token = signToken(user._id.toString(), user.role);
    return NextResponse.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role, displayName: user.displayName, coins: user.coins, xp: user.xp, level: user.level, premium: user.premium, avatar: user.avatar },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
