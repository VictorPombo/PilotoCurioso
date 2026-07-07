'use client';

import { Radar, User, Trophy, AlertTriangle, Newspaper } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';
import { CopyButton } from '@/components/admin/CopyButton';
import { Tooltip } from '@/components/admin/Tooltip';

interface EmergingDriver {
  name?: string;
  nome?: string;
  age?: string | number;
  idade?: string | number;
  category?: string;
  categoria?: string;
  highlight?: string;
  destaque?: string;
  sponsor_potential?: string;
  potencial_patrocinio?: string;
  urgency?: string;
  urgencia?: string;
}

function getUrgencyStyle(urgency: string) {
  const u = urgency.toLowerCase();
  if (u.includes('alt') || u.includes('high') || u.includes('urgente')) {
    return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' };
  }
  if (u.includes('méd') || u.includes('med') || u.includes('moder')) {
    return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' };
  }
  return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
}

export default function RadarPage() {
  return (
    <AIToolPage
      title="RADAR DE EMERGENTES"
      description="Pilotos em ascensão nas categorias de base"
      icon={
        <div className="w-12 h-12 rounded-xl bg-[#EC4899]/10 flex items-center justify-center">
          <Radar className="w-6 h-6 text-[#EC4899]" />
        </div>
      }
      inputLabel="Contexto (opcional)"
      inputPlaceholder="Ex: Foco em pilotos brasileiros na F4 e F-Regional 2026..."
      apiEndpoint="/api/ai/emerging-drivers"
      buildPayload={(input) => ({ context: input })}
      renderResult={(data) => {
        if (!Array.isArray(data)) {
          return (
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          );
        }

        const drivers = data as EmergingDriver[];
        const allText = drivers.map((p, i) => {
          const name = p.name || p.nome || '';
          const age = p.age || p.idade || '';
          const cat = p.category || p.categoria || '';
          const highlight = p.highlight || p.destaque || '';
          const urgency = p.urgency || p.urgencia || '';
          return `${i + 1}. ${name} (${age}) — ${cat}\n   Destaque: ${highlight}\n   Urgência: ${urgency}`;
        }).join('\n\n');

        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2">
                <Radar className="w-5 h-5 text-[#EC4899]" /> {drivers.length} pilotos identificados
                <Tooltip text="Pilotos de base que estão se destacando e podem se tornar tendência. Fique de olho!" />
              </h3>
              <CopyButton text={allText} label="Copiar todos" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drivers.map((p, i) => {
                const name = p.name || p.nome || '';
                const age = p.age || p.idade || '';
                const cat = p.category || p.categoria || '';
                const highlight = p.highlight || p.destaque || '';
                const sponsor = p.sponsor_potential || p.potencial_patrocinio || '';
                const urgency = p.urgency || p.urgencia || '';
                const urgStyle = urgency ? getUrgencyStyle(urgency) : null;

                return (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-surface-2 border border-white/5 hover:border-[#EC4899]/20 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EC4899]/10 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-[#EC4899]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg group-hover:text-[#EC4899] transition-colors">
                            {name}
                          </h4>
                          <p className="text-xs text-zinc-500 flex items-center gap-2">
                            {age && <span>{age} anos</span>}
                            {cat && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                <span>{cat}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {urgStyle && urgency && (
                        <div className="flex items-center gap-1.5 shrink-0 max-w-[150px]">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${urgStyle.bg} ${urgStyle.text} ${urgStyle.border} border truncate`}>
                            {urgency}
                          </span>
                          <Tooltip text="Nível de urgência para cobrir este piloto. Alta urgência significa que ele está em evidência agora e pode gerar muito tráfego." />
                        </div>
                      )}
                    </div>

                    {highlight && (
                      <div className="mt-3 flex items-start gap-2">
                        <Trophy className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                        <p className="text-sm text-zinc-300">{highlight}</p>
                      </div>
                    )}

                    {sponsor && (
                      <div className="mt-2 flex items-start gap-2">
                        <Newspaper className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-500">
                          {sponsor}
                          <span className="inline-block ml-1">
                            <Tooltip text="Potencial do piloto para atrair reportagens especiais ou matérias patrocinadas." />
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                      <button className="text-xs text-[#EC4899] font-bold uppercase tracking-wider hover:underline">
                        → Criar matéria
                      </button>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text={`${name} (${age}) — ${cat}: ${highlight}`} />
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
