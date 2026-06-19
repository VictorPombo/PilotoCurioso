export function EnzoSignature() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-surface-2 border border-white/5 mt-10">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center text-white font-display text-2xl shrink-0">
        E
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-accent font-bold text-white text-lg">
          Enzo de Souza
        </span>
        <span className="text-sm text-zinc-500 leading-relaxed">
          Jornalista especializado em Fórmula 1. Curiosidades, bastidores e engenharia
          explicada para quem ama velocidade.
        </span>
        <a
          href="https://instagram.com/piloto__curioso"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-brand-red hover:underline mt-1 w-fit"
        >
          @piloto__curioso
        </a>
      </div>
    </div>
  );
}
