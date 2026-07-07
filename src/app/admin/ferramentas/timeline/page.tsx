'use client';

import { Clock } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';
import { CopyButton } from '@/components/admin/CopyButton';
import { Tooltip } from '@/components/admin/Tooltip';

interface TimelineEvent {
  year?: string;
  ano?: string;
  event?: string;
  evento?: string;
  significance?: string;
  significado?: string;
  importancia?: string;
}

export default function TimelinePage() {
  return (
    <AIToolPage
      title="TIMELINE INTELIGENTE"
      description="Histórico completo de qualquer tema da F1"
      icon={
        <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
          <Clock className="w-6 h-6 text-[#8B5CF6]" />
        </div>
      }
      inputLabel="Tema para pesquisar"
      inputPlaceholder="Ex: Motor V10, Ground Effect, Safety Car, DRS..."
      apiEndpoint="/api/ai/f1-timeline"
      useTextarea={false}
      buildPayload={(input) => ({ topic: input })}
      renderResult={(data) => {
        if (!Array.isArray(data)) {
          return (
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          );
        }

        const events = data as TimelineEvent[];
        const allText = events.map(e => {
          const year = e.year || e.ano || '';
          const event = e.event || e.evento || '';
          const sig = e.significance || e.significado || e.importancia || '';
          return `${year} — ${event}\n   ${sig}`;
        }).join('\n\n');

        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#8B5CF6]" /> {events.length} marcos históricos
                <Tooltip text="Eventos organizados cronologicamente com o contexto e a importância de cada um para a história da Fórmula 1." />
              </h3>
              <CopyButton text={allText} label="Copiar timeline" />
            </div>

            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#8B5CF6] via-brand-red/50 to-transparent" />

              <div className="space-y-4">
                {events.map((item, i) => {
                  const year = item.year || item.ano || '';
                  const event = item.event || item.evento || '';
                  const sig = item.significance || item.significado || item.importancia || '';

                  return (
                    <div key={i} className="relative group">
                      {/* Dot */}
                      <div className="absolute -left-[21px] top-5 w-4 h-4 rounded-full border-2 border-[#8B5CF6] bg-surface-card group-hover:bg-[#8B5CF6] transition-colors z-10" />

                      <div className="p-4 rounded-xl bg-surface-2 border border-white/5 group-hover:border-[#8B5CF6]/30 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="font-display text-lg text-[#8B5CF6]">{year}</span>
                            <h4 className="font-bold text-white mt-1">{event}</h4>
                            {sig && <p className="text-sm text-zinc-400 mt-1.5">{sig}</p>}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-1">
                            <CopyButton text={`${year} — ${event}: ${sig}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
