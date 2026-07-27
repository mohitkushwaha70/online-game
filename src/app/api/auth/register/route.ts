import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { username, email, password } = await req.json();
    if (!username || !email || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    if (await User.findOne({ $or: [{ email }, { username }] })) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    const user = await User.create({ username, email, password, role: 'user', displayName: username });
    const token = signToken(user._id.toString(), user.role);
    return NextResponse.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role, displayName: user.displayName },
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
