import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/auth/session';
import { sessionCookieSecure } from '@/lib/auth/cookie_options';

export async function POST(request: Request) {
  cookies().set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: sessionCookieSecure(request),
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return Response.json({ ok: true });
}
