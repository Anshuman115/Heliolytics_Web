/** Session cookies must not use Secure on plain HTTP (e.g. localhost:3000 in dev). */
export function sessionCookieSecure(request: Request): boolean {
  if (process.env.COOKIE_SECURE === 'true') return true;
  if (process.env.COOKIE_SECURE === 'false') return false;

  const proto = request.headers.get('x-forwarded-proto');
  if (proto) {
    return proto.split(',')[0]?.trim() === 'https';
  }

  try {
    return new URL(request.url).protocol === 'https:';
  } catch {
    return false;
  }
}
