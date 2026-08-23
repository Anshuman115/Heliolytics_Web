'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { safeRedirectPath } from '@/lib/auth/login_guard';
import { BrandMark } from '@/components/BrandMark';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? 'Sign in failed');
        return;
      }
      router.replace(safeRedirectPath(params.get('from')));
      router.refresh();
    } catch {
      setError('Could not reach the server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:min-h-[calc(100vh-4rem)] lg:justify-center lg:gap-20">
        <div className="flex items-center justify-between"><Link href="/about" aria-label="Heliolytics home"><BrandMark /></Link><Link href="/demo" className="text-sm font-semibold text-slate-400 hover:text-white">View demo →</Link></div>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
          <section>
            <p className="eyebrow mb-4 text-emerald-200">Welcome back</p>
            <h1 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl">Your health, in focus.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">Open your private Heliolytics console to see the latest picture from your strap.</p>
            <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-3">
              <Benefit title="Private" copy="Your server, your data." />
              <Benefit title="Clear" copy="Short, useful signals." />
              <Benefit title="Complete" copy="Sleep to activity." />
            </div>
          </section>
          <section className="card p-6 sm:p-8">
            <p className="eyebrow mb-2">Private console</p>
            <h2 className="text-2xl font-black tracking-tight text-white">Sign in</h2>
            <p className="mt-2 text-sm text-slate-400">Use the dashboard password for this instance.</p>
            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              <label className="block"><span className="text-sm font-semibold text-slate-200">Password</span><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-300/60" /></label>
              {error ? <p className="rounded-xl border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
              <button type="submit" disabled={loading} className="button-primary w-full disabled:cursor-wait disabled:opacity-60">{loading ? 'Opening console…' : 'Open console'}</button>
            </form>
            <p className="mt-6 border-t border-white/10 pt-5 text-center text-xs leading-5 text-slate-500">Just looking around? <Link href="/demo" className="font-semibold text-emerald-200 hover:text-white">Explore the sample workspace</Link></p>
          </section>
        </div>
      </div>
    </main>
  );
}

function Benefit({ title, copy }: { title: string; copy: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><p className="font-bold text-white">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{copy}</p></div>;
}
