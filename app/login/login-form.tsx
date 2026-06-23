'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { safeRedirectPath } from '@/lib/auth/login_guard';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Sign in failed');
        return;
      }
      const from = safeRedirectPath(params.get('from'));
      router.replace(from);
      router.refresh();
    } catch {
      setError('Could not reach the server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-semibold text-white">Heliolytics</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to view your health dashboard. Your API signing key stays on the server — you
          only enter this web password.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-sky-500 focus:ring-2"
            />
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-500 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-800 pt-5">
          <a
            href="/demo"
            className="flex w-full items-center justify-center rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 font-medium text-sky-300 hover:bg-sky-500/20"
          >
            Explore the live demo →
          </a>
          <p className="mt-2 text-center text-xs text-slate-500">
            Sample month of data — no device or password needed.
          </p>
        </div>
      </div>
    </main>
  );
}
