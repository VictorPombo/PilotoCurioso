export function SponsoredBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      <span className="font-medium uppercase tracking-wider">
        Conteúdo Patrocinado
      </span>
      <span className="text-zinc-600">· conforme normas CONAR</span>
    </div>
  );
}
