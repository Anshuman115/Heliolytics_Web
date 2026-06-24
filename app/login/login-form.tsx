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
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Brand / marketing */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-sky-300">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> Self-hosted health analytics
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white">Heliolytics</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-300">
            Your <span className="text-white">Amazfit Helio Strap</span> data — heart rate, sleep,
            recovery, and more — synced over Bluetooth to a server <span className="text-white">you own</span>.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
            <li className="flex items-center gap-3"><Dot c="bg-emerald-400" /> Runs on your own instance — no vendor cloud</li>
            <li className="flex items-center gap-3"><Dot c="bg-sky-400" /> Requires a paired Amazfit Helio Strap</li>
            <li className="flex items-center gap-3"><Dot c="bg-violet-400" /> Token-gated — only you can open it</li>
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/demo" className="rounded-lg bg-brand px-5 py-2.5 font-medium text-white hover:bg-brand-dark">
              Explore the demo →
            </a>
            <a href="/about" className="rounded-lg border border-white/15 px-5 py-2.5 font-medium text-slate-200 hover:bg-white/5">
              How it works
            </a>
          </div>
        </div>

        {/* Sign-in card */}
        <div className="card p-8">
          <p className="label mb-1">Sign in</p>
          <p className="mb-5 text-sm text-slate-400">Enter your dashboard password.</p>
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
          <p className="mt-5 text-center text-xs text-slate-500">
            No account? Try the <a href="/demo" className="text-sky-400 hover:underline">demo</a> — no device or password needed.
          </p>
        </div>
      </div>
    </main>
  );
}

function Dot({ c }: { c: string }) {
  return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c}`} />;
}
