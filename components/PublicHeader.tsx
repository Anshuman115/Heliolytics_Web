import Link from 'next/link';
import { BrandMark } from './BrandMark';

type PublicHeaderProps = {
  action?: 'demo' | 'login';
};

export function PublicHeader({ action = 'login' }: PublicHeaderProps) {
  const isDemo = action === 'demo';
  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
      <Link href="/about" aria-label="Heliolytics home" className="rounded-lg">
        <BrandMark />
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/about" className="hidden px-3 py-2 text-slate-400 hover:text-white sm:block">
          How it works
        </Link>
        <Link
          href={isDemo ? '/login' : '/demo'}
          className="button-secondary px-3 py-2 text-xs sm:text-sm"
        >
          {isDemo ? 'Sign in' : 'View demo'}
        </Link>
      </nav>
    </header>
  );
}
