const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

type Entry = { count: number; resetAt: number };

const byIp = new Map<string, Entry>();

function clientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export function loginRateLimited(request: Request): boolean {
  const ip = clientIp(request);
  const now = Date.now();
  let entry = byIp.get(ip);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    byIp.set(ip, entry);
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export function safeRedirectPath(from: string | null): string {
  if (!from || !from.startsWith('/') || from.startsWith('//')) return '/';
  return from;
}
