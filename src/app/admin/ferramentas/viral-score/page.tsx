'use client';

import { BarChart3, TrendingUp, Search, Share2, Clock, MousePointer, CheckCircle } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';
import { CopyButton } from '@/components/admin/CopyButton';
import { Tooltip } from '@/components/admin/Tooltip';

interface ViralScoreResult {
  viral_score?: number;
  seo_score?: number;
  share_score?: number;
  reading_time?: number;
  ctr_estimate?: number | string;
  suggestions?: any[];
  raw?: string;
}

function ScoreBar({ value, color, label, icon, tooltip }: { value: number; color: string; label: string; icon: React.ReactNode; tooltip: string }) {
  const getLevel = (v: number) => {
    if (v >= 80) return 'Excelente';
    if (v >= 60) return 'Bom';
    if (v >= 40) return 'Regular';
    return 'Baixo';
  };

  return (
    <div className="p-4 rounded-xl bg-surface-2 border border-white/5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
            {icon}
          </div>
          <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">{label}</span>
          <Tooltip text={tooltip} />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl" style={{ color }}>{value}</span>
          <span className="text-xs text-zinc-600">/100</span>
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color }}>
        {getLevel(value)}
      </span>
    </div>
  );
}

export default function ViralScorePage() {
  return (
    <AIToolPage
      title="SCORE DE VIRALIZAÇÃO"
      description="Estimativas de performance antes de publicar"
      icon={
        <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-[#F59E0B]" />
        </div>
      }
      inputLabel="Título + corpo da matéria"
      inputPlaceholder="Cole o título e corpo para análise..."
      apiEndpoint="/api/ai/viral-score"
      buildPayload={(input) => {
        const lines = input.split('\n');
        return { title: lines[0], body: lines.slice(1).join('\n') };
      }}
      renderResult={(data: unknown) => {
        const d = data as ViralScoreResult;

        if (d.viral_score === undefined) {
          return (
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          );
        }

        const allText = [
          `Score Viral: ${d.viral_score}/100`,
          `Score SEO: ${d.seo_score}/100`,
          `Score Compartilhamento: ${d.share_score}/100`,
          `Tempo de Leitura: ${d.reading_time} min`,
          `CTR Estimado: ${d.ctr_estimate}%`,
          '',
          'Sugestões:',
          ...(d.suggestions || []).map((s, i) => {
            const text = typeof s === 'string' ? s : typeof s === 'object' && s !== null ? (s.description || s.descricao || JSON.stringify(s)) : String(s);
            return `${i + 1}. ${text}`;
          }),
        ].join('\n');

        // Average score for the main indicator
        const avg = Math.round(((d.viral_score || 0) + (d.seo_score || 0) + (d.share_score || 0)) / 3);
        const avgColor = avg >= 70 ? '#10B981' : avg >= 45 ? '#F59E0B' : '#EF4444';

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#F59E0B]" /> Análise de Potencial
              </h3>
              <CopyButton text={allText} label="Copiar relatório" />
            </div>

            {/* Score Geral */}
            <div className="flex items-center justify-center p-6 rounded-2xl bg-surface-2 border border-white/5">
              <div className="text-center">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
                  Score Geral <Tooltip text="Média dos 3 scores (Viralização + SEO + Compartilhamento). Acima de 70 indica alto potencial de engajamento." />
                </p>
                <p className="font-display text-6xl" style={{ color: avgColor }}>{avg}</p>
                <p className="text-sm mt-1" style={{ color: avgColor }}>
                  {avg >= 70 ? '🔥 Alto potencial!' : avg >= 45 ? '⚡ Potencial moderado' : '📉 Precisa melhorar'}
                </p>
              </div>
            </div>

            {/* Score Bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ScoreBar
                value={d.viral_score || 0}
                color="#E8002D"
                label="Viralização"
                icon={<TrendingUp className="w-4 h-4" style={{ color: '#E8002D' }} />}
                tooltip="Probabilidade de o conteúdo se espalhar organicamente. Considera impacto emocional, curiosidade e timing do tema."
              />
              <ScoreBar
                value={d.seo_score || 0}
                color="#0066FF"
                label="SEO"
                icon={<Search className="w-4 h-4" style={{ color: '#0066FF' }} />}
                tooltip="Otimização para motores de busca. Avalia título, uso de palavras-chave, estrutura do texto e potencial para Google Discover."
              />
              <ScoreBar
                value={d.share_score || 0}
                color="#10B981"
                label="Compartilhamento"
                icon={<Share2 className="w-4 h-4" style={{ color: '#10B981' }} />}
                tooltip="Potencial de compartilhamento em redes sociais. Mede se o conteúdo gera identificação, opinião ou reação no leitor."
              />
            </div>

            {/* Métricas extras */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-surface-2 border border-white/5 flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#F59E0B]" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    Leitura <Tooltip text="Tempo estimado que o leitor leva para ler a matéria completa, baseado na quantidade de palavras." />
                  </p>
                  <p className="font-display text-xl text-[#F59E0B]">{d.reading_time} min</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface-2 border border-white/5 flex items-center gap-3">
                <MousePointer className="w-5 h-5 text-[#8B5CF6]" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    CTR Estimado <Tooltip text="Click-Through Rate: porcentagem estimada de pessoas que clicam ao ver o título nos resultados de busca ou redes sociais." />
                  </p>
                  <p className="font-display text-xl text-[#8B5CF6]">{d.ctr_estimate}%</p>
                </div>
              </div>
            </div>

            {/* Sugestões */}
            {Array.isArray(d.suggestions) && d.suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Sugestões de melhoria
                </h4>
                <div className="space-y-2">
                  {d.suggestions.map((s, i) => {
                    const text = typeof s === 'string' ? s : typeof s === 'object' && s !== null ? (s.description || s.descricao || JSON.stringify(s)) : String(s);
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2 border border-white/5 group">
                        <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-emerald-400 text-xs font-bold">{i + 1}</span>
                        </div>
                        <p className="text-sm text-zinc-300 flex-1">{text}</p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <CopyButton text={text} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
