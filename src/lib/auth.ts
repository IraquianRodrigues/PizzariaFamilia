import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret';

export interface AuthTokenPayload { uid: string; role: string; name: string; }

export function signToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: '12h' });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try { return jwt.verify(token, AUTH_SECRET) as AuthTokenPayload; } catch { return null; }
}

export async function authenticatePhone(phone: string, password: string) {
  const user = await prisma.user.findFirst({ where: { phone } });
  if (!user || !user.password) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  return user;
}
