'use client';

import { Target, DollarSign, Users, Megaphone } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';
import { CopyButton } from '@/components/admin/CopyButton';
import { Tooltip } from '@/components/admin/Tooltip';

interface SponsorableResult {
  pode_gerar_venda?: string;
  can_generate_sales?: string;
  motivo?: string;
  reason?: string;
  alvos?: string[];
  targets?: string[];
  pitch?: string;
  valor_estimado?: string;
  estimated_value?: string;
  market_value?: string;
}

export default function PatrocinavelPage() {
  return (
    <AIToolPage
      title="DETECTOR DE PATROCINÁVEL"
      description="Identifica matérias que podem gerar vendas e patrocínios"
      icon={
        <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
          <Target className="w-6 h-6 text-[#FF6B00]" />
        </div>
      }
      inputLabel="Tema ou corpo da matéria"
      inputPlaceholder="Ex: Artigo sobre kart no Brasil, crescimento da categoria, novos talentos..."
      apiEndpoint="/api/ai/sponsorable"
      buildPayload={(input) => ({ topic: input })}
      renderResult={(data: unknown) => {
        const d = data as SponsorableResult;
        const canSell = d.pode_gerar_venda || d.can_generate_sales;
        const reason = d.motivo || d.reason;
        const targets = d.alvos || d.targets || [];
        const pitch = d.pitch;
        const value = d.valor_estimado || d.estimated_value || d.market_value;
        const isPositive = canSell?.toLowerCase().includes('sim') || canSell?.toLowerCase().includes('yes');

        if (!canSell) {
          return (
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          );
        }

        const fullText = [
          `Pode gerar venda: ${canSell}`,
          reason ? `Motivo: ${reason}` : '',
          targets.length > 0 ? `Alvos: ${targets.join(', ')}` : '',
          pitch ? `Pitch: ${pitch}` : '',
          value ? `Valor estimado: ${value}` : '',
        ].filter(Boolean).join('\n');

        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FF6B00]" /> Análise de Monetização
              </h3>
              <CopyButton text={fullText} label="Copiar tudo" />
            </div>

            {/* Veredicto */}
            <div className={`p-5 rounded-xl border ${
              isPositive 
                ? 'bg-emerald-500/5 border-emerald-500/20' 
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                <span className={`font-display text-xl flex items-center gap-2 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {canSell}
                  <Tooltip text="Veredicto da IA sobre se esta matéria tem potencial para atrair marcas parceiras." />
                </span>
              </div>
              {reason && (
                <p className="text-sm text-zinc-400 mt-2 pl-6">{reason}</p>
              )}
            </div>

            {/* Alvos de Prospecção */}
            {targets.length > 0 && (
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-300 uppercase tracking-widest">
                  <Users className="w-4 h-4 text-[#FF6B00]" /> Alvos de Prospecção
                  <Tooltip text="Tipos de empresas ou nichos de mercado que teriam interesse em patrocinar este conteúdo." />
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {targets.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
                        <span className="text-[#FF6B00] font-display text-sm">{i + 1}</span>
                      </div>
                      <span className="text-sm text-white">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pitch */}
            {pitch && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-300 uppercase tracking-widest">
                  <Megaphone className="w-4 h-4 text-[#FF6B00]" /> Pitch Sugerido
                  <Tooltip text="Uma frase comercial pronta que o seu time de vendas pode usar para abordar o patrocinador." />
                </h4>
                <div className="relative p-4 rounded-xl bg-surface-2 border border-white/5 group">
                  <p className="text-sm text-zinc-300 italic">&ldquo;{pitch}&rdquo;</p>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={pitch} />
                  </div>
                </div>
              </div>
            )}

            {/* Valor estimado */}
            {value && (
              <div className="p-4 rounded-xl bg-surface-2 border border-white/5">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                      Valor estimado do mercado
                      <Tooltip text="Uma estimativa realista de quanto o mercado costuma pagar por um publieditorial com este nível de entrega/engajamento." />
                    </p>
                    <p className="text-lg font-display text-emerald-400 mt-0.5">{value}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
