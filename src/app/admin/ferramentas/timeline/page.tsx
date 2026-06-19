'use client';
import { Clock } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';

export default function TimelinePage() {
  return (
    <AIToolPage
      title="TIMELINE INTELIGENTE"
      description="Histórico completo de qualquer tema da F1"
      icon={<div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center"><Clock className="w-6 h-6 text-[#8B5CF6]" /></div>}
      inputLabel="Tema para pesquisar"
      inputPlaceholder="Ex: Motor V10, Ground Effect, Safety Car, DRS..."
      apiEndpoint="/api/ai/f1-timeline"
      useTextarea={false}
      buildPayload={(input) => ({ topic: input })}
      renderResult={(data) => {
        if (Array.isArray(data)) {
          return (
            <div className="space-y-3">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-[#8B5CF6]" /> Timeline</h3>
              <div className="relative pl-6 border-l-2 border-brand-red/30 space-y-4">
                {data.map((item: Record<string, string>, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-brand-red/20 border-2 border-brand-red" />
                    <div className="p-4 rounded-xl bg-surface-2 border border-white/5">
                      <span className="text-brand-red font-display text-lg">{item.year || item.ano}</span>
                      <h4 className="font-bold text-white mt-1">{item.event || item.evento}</h4>
                      <p className="text-sm text-zinc-400 mt-1">{item.significance || item.significado}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return <pre className="text-sm text-zinc-300 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
      }}
    />
  );
}
