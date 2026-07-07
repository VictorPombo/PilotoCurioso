'use client';

import { Lightbulb, Tag } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';
import { CopyButton } from '@/components/admin/CopyButton';
import { Tooltip } from '@/components/admin/Tooltip';

const CATEGORIES = ['aerodinâmica', 'pneus', 'estratégia', 'história', 'acidentes', 'motores', 'pilotos', 'regras', 'curiosidades gerais'];

const CATEGORY_EMOJIS: Record<string, string> = {
  aerodinâmica: '✈️',
  pneus: '🏎️',
  estratégia: '♟️',
  história: '📜',
  acidentes: '💥',
  motores: '🔧',
  pilotos: '🏁',
  regras: '📋',
  'curiosidades gerais': '⭐',
};

interface Curiosity {
  title?: string;
  titulo?: string;
  description?: string;
  descricao?: string;
  category?: string;
  categoria?: string;
}

export default function CuriosidadesPage() {
  return (
    <AIToolPage
      title="BIBLIOTECA DE CURIOSIDADES"
      description="Gerador infinito de ideias de curiosidades sobre F1 ⭐"
      icon={
        <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-brand-red" />
        </div>
      }
      inputLabel={`Categoria (${CATEGORIES.join(', ')})`}
      inputPlaceholder="Ex: motores"
      apiEndpoint="/api/ai/curiosity-bank"
      useTextarea={false}
      buildPayload={(input) => ({ category: input, used_titles: [] })}
      renderResult={(data) => {
        if (!Array.isArray(data)) {
          return (
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          );
        }

        const curiosities = data as Curiosity[];
        const allText = curiosities.map((c, i) => {
          const title = c.title || c.titulo || '';
          const desc = c.description || c.descricao || '';
          return `${i + 1}. ${title}\n   ${desc}`;
        }).join('\n\n');

        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-brand-red" /> {curiosities.length} curiosidades geradas
                <Tooltip text="Fatos inéditos ou pouco conhecidos sobre a Fórmula 1 para você transformar em matérias rápidas ou vídeos curtos." />
              </h3>
              <CopyButton text={allText} label="Copiar todas" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curiosities.map((item, i) => {
                const title = item.title || item.titulo || '';
                const desc = item.description || item.descricao || '';
                const cat = item.category || item.categoria || '';
                const emoji = CATEGORY_EMOJIS[cat.toLowerCase()] || '💡';

                return (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-surface-2 border border-white/5 group hover:border-brand-red/20 transition-all relative"
                  >
                    {/* Number badge */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
                      <span className="text-brand-red text-xs font-display">{i + 1}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white group-hover:text-brand-red transition-colors leading-tight">
                            {title}
                          </h4>
                          {cat && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Tag className="w-3 h-3 text-zinc-600" />
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{cat}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <button className="text-xs text-brand-red font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
                          → Enviar para o Editor
                          <Tooltip text="Abre o editor de matérias com esta curiosidade já pré-preenchida para você expandir e publicar." showIcon={false}>
                            <span className="text-zinc-500 hover:text-zinc-300 ml-1">ℹ️</span>
                          </Tooltip>
                        </button>
                        <CopyButton text={`${title}\n\n${desc}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
