export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-4 text-center">
      <div className="w-full"><p className="eyebrow mb-2">404</p><h1 className="text-3xl font-black text-white">That page is not here.</h1><p className="mt-2 text-slate-400">Try the demo or head back to the start.</p><div className="mt-6 flex justify-center gap-3"><a href="/about" className="button-secondary">Home</a><a href="/demo" className="button-primary">Demo →</a></div></div>
    </main>
  );
}
