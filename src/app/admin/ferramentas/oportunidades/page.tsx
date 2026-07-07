'use client';

import { TrendingUp, Zap, BarChart, Gauge } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';
import { CopyButton } from '@/components/admin/CopyButton';
import { Tooltip } from '@/components/admin/Tooltip';

interface Opportunity {
  title?: string;
  titulo?: string;
  titulo_sugerido?: string;
  reason?: string;
  motivo?: string;
  why?: string;
  por_que_e_uma_oportunidade?: string;
  difficulty?: string;
  dificuldade?: string;
  dificuldade_estimada?: string;
  potential?: string;
  potencial?: string;
  traffic_potential?: string;
  potencial_de_trafego?: string;
}

function getDifficultyStyle(d: string) {
  const normalized = d.toLowerCase();
  if (normalized.includes('fácil') || normalized.includes('easy')) {
    return { color: '#10B981', label: 'Fácil' };
  }
  if (normalized.includes('difícil') || normalized.includes('hard')) {
    return { color: '#EF4444', label: 'Difícil' };
  }
  return { color: '#F59E0B', label: 'Médio' };
}

function getPotentialStyle(p: string) {
  const normalized = p.toLowerCase();
  if (normalized.includes('alt') || normalized.includes('high')) {
    return { color: '#10B981', label: 'Alto' };
  }
  if (normalized.includes('baixo') || normalized.includes('low')) {
    return { color: '#EF4444', label: 'Baixo' };
  }
  return { color: '#F59E0B', label: 'Médio' };
}

export default function OportunidadesPage() {
  return (
    <AIToolPage
      title="CENTRAL DE OPORTUNIDADES"
      description="Temas com alta chance de tráfego baseados em tendências atuais"
      icon={
        <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-brand-red" />
        </div>
      }
      inputLabel="Contexto (notícias recentes, eventos, etc.)"
      inputPlaceholder="Ex: Próximo GP é em Interlagos, Antonelli está em destaque, novo regulamento 2027..."
      apiEndpoint="/api/ai/opportunities"
      buildPayload={(input) => ({ context: input })}
      renderResult={(data) => {
        if (!Array.isArray(data)) {
          return (
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          );
        }

        const opportunities = data as Opportunity[];
        const allText = opportunities.map((o, i) => {
          const title = o.title || o.titulo || o.titulo_sugerido || '';
          const reason = o.reason || o.motivo || o.why || o.por_que_e_uma_oportunidade || '';
          const diff = o.difficulty || o.dificuldade || o.dificuldade_estimada || '';
          const pot = o.potential || o.potencial || o.traffic_potential || o.potencial_de_trafego || '';
          return `${i + 1}. ${title}\n   Motivo: ${reason}\n   Dificuldade: ${diff} | Potencial: ${pot}`;
        }).join('\n\n');

        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-red" /> {opportunities.length} oportunidades encontradas
                <Tooltip text="Ideias de matérias com base no contexto informado, focadas em atrair tráfego para o portal." />
              </h3>
              <CopyButton text={allText} label="Copiar todas" />
            </div>

            <div className="space-y-3">
              {opportunities.map((item, i) => {
                // Tenta pegar os valores padrões ou faz fallback iterando as chaves se não achar nada
                let title = item.title || item.titulo || item.titulo_sugerido || '';
                let reason = item.reason || item.motivo || item.why || item.por_que_e_uma_oportunidade || '';
                let difficulty = item.difficulty || item.dificuldade || item.dificuldade_estimada || '';
                let potential = item.potential || item.potencial || item.traffic_potential || item.potencial_de_trafego || '';

                // Fallback super seguro se a IA retornar chaves completamente malucas
                if (!title && !reason) {
                  const vals = Object.values(item);
                  if (vals[0]) title = String(vals[0]);
                  if (vals[1]) reason = String(vals[1]);
                  if (vals[2]) difficulty = String(vals[2]);
                  if (vals[3]) potential = String(vals[3]);
                }

                const diffStyle = difficulty ? getDifficultyStyle(difficulty) : null;
                const potStyle = potential ? getPotentialStyle(potential) : null;

                return (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-surface-2 border border-white/5 hover:border-brand-red/20 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Zap className="w-4 h-4 text-brand-red" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white group-hover:text-brand-red transition-colors">
                            {title}
                          </h4>
                          {reason && (
                            <p className="text-sm text-zinc-400 mt-1.5">{reason}</p>
                          )}

                          {(diffStyle || potStyle) && (
                            <div className="flex items-center gap-4 mt-3">
                              {diffStyle && (
                                <div className="flex items-center gap-1.5">
                                  <Gauge className="w-3.5 h-3.5" style={{ color: diffStyle.color }} />
                                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: diffStyle.color }}>
                                    {diffStyle.label}
                                  </span>
                                  <Tooltip text="Dificuldade de rankear no Google ou atrair cliques. Temas 'Fáceis' têm menos concorrência." />
                                </div>
                              )}
                              {potStyle && (
                                <div className="flex items-center gap-1.5">
                                  <BarChart className="w-3.5 h-3.5" style={{ color: potStyle.color }} />
                                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: potStyle.color }}>
                                    Potencial {potStyle.label}
                                  </span>
                                  <Tooltip text="Volume de tráfego esperado. Temas com 'Alto' potencial podem viralizar ou trazer muitos acessos sustentados." />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-zinc-600 font-mono">#{i + 1}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <CopyButton text={`${title}: ${reason}`} />
                        </div>
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
