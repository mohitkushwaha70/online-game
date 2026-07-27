import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import connectDB from './mongodb';
import { User, IUser } from './models';

const JWT_SECRET = process.env.JWT_SECRET || 'online-game-premium-secret-2026';

export function signToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function authMiddleware(req: NextRequest): Promise<IUser | null> {
  try {
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) return null;
    const decoded = verifyToken(auth.split(' ')[1]);
    if (!decoded) return null;
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}

export async function adminMiddleware(user: IUser | null): Promise<boolean> {
  return !!user && ['admin', 'superadmin'].includes(user.role);
}
