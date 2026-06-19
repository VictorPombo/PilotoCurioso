'use client';
import { Radar } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';

export default function RadarPage() {
  return (
    <AIToolPage
      title="RADAR DE EMERGENTES"
      description="Pilotos em ascensão nas categorias de base"
      icon={<div className="w-12 h-12 rounded-xl bg-[#EC4899]/10 flex items-center justify-center"><Radar className="w-6 h-6 text-[#EC4899]" /></div>}
      inputLabel="Contexto (opcional)"
      inputPlaceholder="Ex: Foco em pilotos brasileiros na F4 e F-Regional 2026..."
      apiEndpoint="/api/ai/emerging-drivers"
      buildPayload={(input) => ({ context: input })}
      renderResult={(data) => {
        if (Array.isArray(data)) {
          return (
            <div className="space-y-3">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2"><Radar className="w-5 h-5 text-[#EC4899]" /> Pilotos em Ascensão</h3>
              {data.map((p: Record<string, string>, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-surface-2 border border-white/5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white">{p.name || p.nome}</h4>
                    {p.urgency && <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold">{p.urgency}</span>}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{p.category || p.categoria} · {p.age || p.idade}</p>
                  <p className="text-sm text-zinc-400 mt-2">{p.reason || p.motivo || p.why}</p>
                </div>
              ))}
            </div>
          );
        }
        return <pre className="text-sm text-zinc-300 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
      }}
    />
  );
}
