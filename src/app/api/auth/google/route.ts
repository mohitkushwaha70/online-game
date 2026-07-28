import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { signToken } from '@/lib/auth';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();
    if (!credential) {
      return NextResponse.json({ error: 'Google credential required' }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
    }

    await connectDB();

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      const username = payload.name?.replace(/\s+/g, '') || payload.email.split('@')[0];
      let finalUsername = username;
      let counter = 1;
      while (await User.findOne({ username: finalUsername })) {
        finalUsername = `${username}${counter}`;
        counter++;
      }

      user = await User.create({
        username: finalUsername,
        email: payload.email,
        password: Math.random().toString(36).slice(-16),
        role: 'user',
        displayName: payload.name || finalUsername,
        avatar: payload.picture || '',
        isActive: true,
        coins: 100,
        xp: 50,
        level: 1,
        premium: { isActive: false, expiresAt: null, plan: '' },
      });
    }

    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    if (payload.picture && !user.avatar) {
      user.avatar = payload.picture;
    }
    await user.save();

    const token = signToken(user._id.toString(), user.role);
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
        avatar: user.avatar,
        coins: user.coins,
        xp: user.xp,
        level: user.level,
        premium: user.premium,
      },
    });
  } catch (e: any) {
    console.error('Google auth error:', e);
    return NextResponse.json({ error: 'Google authentication failed: ' + e.message }, { status: 500 });
  }
}
