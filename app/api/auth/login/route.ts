import { cookies } from 'next/headers';
import {
  createSessionValue,
  passwordsMatch,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SEC,
} from '@/lib/auth/session';
import { sessionCookieSecure } from '@/lib/auth/cookie_options';
import { loginRateLimited } from '@/lib/auth/login_guard';

export async function POST(request: Request) {
  if (loginRateLimited(request)) {
    return Response.json({ error: 'Too many attempts — try again later' }, { status: 429 });
  }

  const configured = process.env.HELIOLYTICS_WEB_PASSWORD;
  if (!configured) {
    return Response.json({ error: 'Web login is not configured on the server' }, { status: 503 });
  }

  let password = '';
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? '';
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!passwordsMatch(password, configured)) {
    return Response.json({ error: 'Wrong password' }, { status: 401 });
  }

  cookies().set(SESSION_COOKIE, await createSessionValue(configured), {
    httpOnly: true,
    secure: sessionCookieSecure(request),
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SEC,
    path: '/',
  });

  return Response.json({ ok: true });
}
