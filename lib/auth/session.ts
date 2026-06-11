export const SESSION_COOKIE = 'heliolytics_session';
export const SESSION_MAX_AGE_SEC = 7 * 24 * 60 * 60;

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const byte = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) return null;
    bytes[i] = byte;
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function signExpiryHex(exp: number, password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(exp)));
  return bytesToHex(new Uint8Array(sig));
}

export async function createSessionValue(password: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  return `${exp}.${await signExpiryHex(exp, password)}`;
}

export async function verifySessionValue(
  token: string,
  password: string | undefined,
): Promise<boolean> {
  if (!password) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const exp = Number.parseInt(parts[0] ?? '', 10);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const want = await signExpiryHex(exp, password);
  const got = hexToBytes(parts[1] ?? '');
  const expected = hexToBytes(want);
  if (!got || !expected) return false;
  return timingSafeEqual(got, expected);
}

export function passwordsMatch(given: string, expected: string | undefined): boolean {
  if (!expected) return false;
  return timingSafeEqual(new TextEncoder().encode(given), new TextEncoder().encode(expected));
}
