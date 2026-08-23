'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4">
      <div className="card p-6">
        <p className="eyebrow mb-2 text-rose-200">Temporary issue</p>
        <h1 className="text-2xl font-black text-white">The picture could not load.</h1>
        <p className="mt-2 text-sm text-slate-400">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="button-primary mt-5"
        >
          Try again →
        </button>
      </div>
    </main>
  );
}
