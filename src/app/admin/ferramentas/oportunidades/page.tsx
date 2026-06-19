'use client';

import { TrendingUp } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';

export default function OportunidadesPage() {
  return (
    <AIToolPage
      title="CENTRAL DE OPORTUNIDADES"
      description="Temas com alta chance de tráfego baseados em tendências atuais"
      icon={<div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-brand-red" /></div>}
      inputLabel="Contexto (notícias recentes, eventos, etc.)"
      inputPlaceholder="Ex: Próximo GP é em Interlagos, Antonelli está em destaque, novo regulamento 2027..."
      apiEndpoint="/api/ai/opportunities"
      buildPayload={(input) => ({ context: input })}
      renderResult={(data) => {
        if (Array.isArray(data)) {
          return (
            <div className="space-y-4">
              <h3 className="font-accent font-bold text-white text-lg">Oportunidades encontradas</h3>
              {data.map((item: Record<string, string>, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-surface-2 border border-white/5">
                  <h4 className="font-bold text-white">{item.title || item.titulo}</h4>
                  <p className="text-sm text-zinc-400 mt-1">{item.reason || item.motivo || item.why}</p>
                  <div className="flex gap-3 mt-2 text-xs text-zinc-500">
                    {item.difficulty && <span>Dificuldade: {item.difficulty}</span>}
                    {item.potential && <span>Potencial: {item.potential}</span>}
                  </div>
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
