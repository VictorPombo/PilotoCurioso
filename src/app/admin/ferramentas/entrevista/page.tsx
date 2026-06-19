'use client';
import { Mic } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';

export default function EntrevistaPage() {
  return (
    <AIToolPage
      title="ASSISTENTE DE ENTREVISTA"
      description="Gera ~20 perguntas inteligentes para entrevistas"
      icon={<div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center"><Mic className="w-6 h-6 text-[#0066FF]" /></div>}
      inputLabel="Quem será entrevistado?"
      inputPlaceholder="Ex: Piloto da F4 Brasil, 18 anos, disputando campeonato paulista"
      apiEndpoint="/api/ai/interview"
      buildPayload={(input) => ({ subject: input, context: '' })}
      renderResult={(data) => {
        if (Array.isArray(data)) {
          return (
            <div className="space-y-3">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2"><Mic className="w-5 h-5 text-[#0066FF]" /> {data.length} perguntas geradas</h3>
              {data.map((q: Record<string, string>, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-surface-2 border border-white/5">
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">{q.category || q.categoria}</span>
                  <p className="font-medium text-white mt-1">{q.question || q.pergunta}</p>
                  {q.follow_up_tip && <p className="text-xs text-zinc-500 mt-2 italic">Dica: {q.follow_up_tip}</p>}
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
