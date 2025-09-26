import { NextRequest, NextResponse } from 'next/server';

// Desativa todo o painel /admin redirecionando para a home
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin')) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.delete('next');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
