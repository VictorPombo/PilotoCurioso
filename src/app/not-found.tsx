import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center px-4">
        <h1 className="font-display text-8xl text-brand-red mb-4">404</h1>
        <h2 className="font-accent text-2xl text-white mb-2">Página não encontrada</h2>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">
          Essa página saiu da pista. Mas não se preocupe, temos muitas curiosidades te esperando.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-bold uppercase tracking-wider transition-all"
        >
          ← Voltar para a Home
        </Link>
      </div>
    </main>
  );
}
