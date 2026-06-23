import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { safeRedirectPath } from '@/lib/auth/login_guard';
import { SESSION_COOKIE, verifySessionValue } from '@/lib/auth/session';

async function isAuthed(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionValue(token ?? '', process.env.HELIOLYTICS_WEB_PASSWORD);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public: auth endpoints, framework assets, the demo, and the about page.
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/demo') ||
    pathname.startsWith('/about')
  ) {
    return NextResponse.next();
  }

  const authed = await isAuthed(request);

  if (pathname.startsWith('/login')) {
    if (authed) {
      const from = safeRedirectPath(request.nextUrl.searchParams.get('from'));
      return NextResponse.redirect(new URL(from, request.url));
    }
    return NextResponse.next();
  }

  if (authed) return NextResponse.next();

  const login = new URL('/login', request.url);
  if (pathname !== '/') login.searchParams.set('from', pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
