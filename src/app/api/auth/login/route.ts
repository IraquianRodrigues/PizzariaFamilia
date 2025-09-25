import { NextRequest, NextResponse } from 'next/server';
import { authenticatePhone, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=>null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  const { phone, password } = body as { phone?: string; password?: string };
  if (!phone || !password) return NextResponse.json({ error: 'Credenciais ausentes' }, { status: 400 });
  const user = await authenticatePhone(phone, password);
  if (!user) return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  const token = signToken({ uid: user.id, role: user.role, name: user.name });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth_token', token, { httpOnly: true, path: '/', maxAge: 60*60*12 });
  return res;
}
