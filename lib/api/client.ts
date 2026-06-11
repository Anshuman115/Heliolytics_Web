import { mintHeliolyticsToken } from './signing';

function baseUrl() {
  return process.env.API_INTERNAL_URL ?? 'http://localhost:8080';
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    headers: { 'X-Heliolytics-Token': mintHeliolyticsToken() },
    cache: 'no-store',
  });
  if (res.status === 429) throw new Error('Rate limit exceeded');
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}
