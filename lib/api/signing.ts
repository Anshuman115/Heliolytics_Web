import crypto from 'crypto';

export function mintHeliolyticsToken(): string {
  const secret = process.env.HELIOLYTICS_SIGNING_SECRET;
  if (!secret) throw new Error('HELIOLYTICS_SIGNING_SECRET not set');
  const ts = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomBytes(16).toString('hex');
  const sig = crypto
    .createHmac('sha256', secret)
    .update(`${ts}:${nonce}`)
    .digest('hex');
  return `${ts}.${nonce}.${sig}`;
}
