import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Heliolytics | Your health, clearly',
    template: '%s | Heliolytics',
  },
  description: 'A private health console for sleep, recovery, activity, and vital trends.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
