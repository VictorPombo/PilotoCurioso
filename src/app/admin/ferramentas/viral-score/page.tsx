'use client';
import { BarChart3 } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';

export default function ViralScorePage() {
  return (
    <AIToolPage
      title="SCORE DE VIRALIZAÇÃO"
      description="Estimativas de performance antes de publicar"
      icon={<div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center"><BarChart3 className="w-6 h-6 text-[#F59E0B]" /></div>}
      inputLabel="Título + corpo da matéria"
      inputPlaceholder="Cole o título e corpo para análise..."
      apiEndpoint="/api/ai/viral-score"
      buildPayload={(input) => {
        const lines = input.split('\n');
        return { title: lines[0], body: lines.slice(1).join('\n') };
      }}
      renderResult={(data: unknown) => {
        const d = data as Record<string, unknown>;
        if (d.viral_score !== undefined) {
          return (
            <div className="space-y-4">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#F59E0B]" /> Análise de Potencial</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Viralização', value: `${d.viral_score}%`, color: '#E8002D' },
                  { label: 'SEO', value: `${d.seo_score}%`, color: '#0066FF' },
                  { label: 'Compartilhamento', value: `${d.share_score}%`, color: '#10B981' },
                  { label: 'Leitura', value: `${d.reading_time} min`, color: '#F59E0B' },
                  { label: 'CTR Estimado', value: `${d.ctr_estimate}%`, color: '#8B5CF6' },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-xl bg-surface-2 border border-white/5">
                    <p className="text-2xl font-display" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              {Array.isArray(d.suggestions) && d.suggestions.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-white text-sm mb-2">Sugestões de melhoria:</h4>
                  <ul className="space-y-1">
                    {(d.suggestions as string[]).map((s, i) => (
                      <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                        <span className="text-brand-red">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        }
        return <pre className="text-sm text-zinc-300 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
      }}
    />
  );
}
