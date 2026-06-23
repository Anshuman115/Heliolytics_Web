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
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Heliolytics</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Self-hosted health analytics for the <span className="text-slate-200">Amazfit Helio Strap</span>.
          Your strap data is synced over Bluetooth to <span className="text-slate-200">your own server</span> —
          this dashboard is token-gated, so only you can open it.
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-slate-400">
          <li className="flex gap-2"><span>🔒</span> Runs on your own instance — no vendor cloud</li>
          <li className="flex gap-2"><span>⌚</span> Requires a paired Amazfit Helio Strap</li>
          <li className="flex gap-2"><span>🔑</span> Access gated by your web password</li>
        </ul>
      </div>

      <div className="card p-8">
        <p className="label mb-4">Sign in</p>
        <form onSubmit={onSubmit} className="space-y-4">
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

        <div className="mt-6 space-y-2 border-t border-white/10 pt-5">
          <a
            href="/demo"
            className="flex w-full items-center justify-center rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 font-medium text-sky-300 hover:bg-sky-500/20"
          >
            Explore the live demo →
          </a>
          <a
            href="/about"
            className="flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-slate-200"
          >
            How it works & what the Helio Strap is →
          </a>
          <p className="text-center text-xs text-slate-500">
            Demo is a sample month — no device or password needed.
          </p>
        </div>
      </div>
    </main>
  );
}
