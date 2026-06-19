'use client';

import { Lightbulb } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';

const CATEGORIES = ['aerodinâmica', 'pneus', 'estratégia', 'história', 'acidentes', 'motores', 'pilotos', 'regras', 'curiosidades gerais'];

export default function CuriosidadesPage() {
  return (
    <AIToolPage
      title="BIBLIOTECA DE CURIOSIDADES"
      description="Gerador infinito de ideias de curiosidades sobre F1 ⭐"
      icon={<div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center"><Lightbulb className="w-6 h-6 text-brand-red" /></div>}
      inputLabel={`Categoria (${CATEGORIES.join(', ')})`}
      inputPlaceholder="Ex: motores"
      apiEndpoint="/api/ai/curiosity-bank"
      useTextarea={false}
      buildPayload={(input) => ({ category: input, used_titles: [] })}
      renderResult={(data) => {
        if (Array.isArray(data)) {
          return (
            <div className="space-y-3">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2"><Lightbulb className="w-5 h-5 text-brand-red" /> {data.length} curiosidades geradas</h3>
              {data.map((item: Record<string, string>, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-surface-2 border border-white/5 group hover:border-brand-red/20 transition-all">
                  <h4 className="font-bold text-white group-hover:text-brand-red transition-colors">
                    {item.title || item.titulo}
                  </h4>
                  <p className="text-sm text-zinc-400 mt-1">{item.description || item.descricao}</p>
                  <button className="mt-3 text-xs text-brand-red font-bold uppercase tracking-wider hover:underline">
                    → Enviar para o Editor
                  </button>
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
