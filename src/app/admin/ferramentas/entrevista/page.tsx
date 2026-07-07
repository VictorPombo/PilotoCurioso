'use client';

import { useState } from 'react';
import { Mic } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';
import { CopyButton } from '@/components/admin/CopyButton';
import { Tooltip } from '@/components/admin/Tooltip';

interface InterviewQuestion {
  category?: string;
  categoria?: string;
  question?: string;
  pergunta?: string;
  follow_up_tip?: string;
  dica_follow_up?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  técnicas: '#0066FF',
  technical: '#0066FF',
  carreira: '#10B981',
  career: '#10B981',
  bastidores: '#F59E0B',
  backstage: '#F59E0B',
  behind_the_scenes: '#F59E0B',
  'polêmicas/curiosas': '#EC4899',
  polêmicas: '#EC4899',
  controversial: '#EC4899',
  curiosas: '#EC4899',
};

function getCategoryColor(cat: string): string {
  const normalized = cat.toLowerCase().trim();
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (normalized.includes(key)) return color;
  }
  return '#6366F1';
}

function CategoryFilter({ categories, active, onToggle }: {
  categories: string[];
  active: string | null;
  onToggle: (cat: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onToggle(null)}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
          active === null
            ? 'bg-white/10 text-white'
            : 'bg-surface-2 text-zinc-500 hover:text-white'
        }`}
      >
        Todas ({categories.length > 0 ? 'ver tudo' : '0'})
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onToggle(active === cat ? null : cat)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            active === cat
              ? 'text-white'
              : 'bg-surface-2 text-zinc-500 hover:text-white'
          }`}
          style={active === cat ? { backgroundColor: `${getCategoryColor(cat)}20`, color: getCategoryColor(cat) } : undefined}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default function EntrevistaPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <AIToolPage
      title="ASSISTENTE DE ENTREVISTA"
      description="Gera ~20 perguntas inteligentes divididas por categoria"
      icon={
        <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center">
          <Mic className="w-6 h-6 text-[#0066FF]" />
        </div>
      }
      inputLabel="Quem será entrevistado?"
      inputPlaceholder="Ex: Piloto da F4 Brasil, 18 anos, disputando campeonato paulista"
      apiEndpoint="/api/ai/interview"
      buildPayload={(input) => ({ subject: input, context: '' })}
      renderResult={(data) => {
        if (!Array.isArray(data)) {
          return (
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          );
        }

        const questions = data as InterviewQuestion[];
        const allText = questions.map((q, i) => {
          const cat = q.category || q.categoria || '';
          const question = q.question || q.pergunta || '';
          const tip = q.follow_up_tip || q.dica_follow_up || '';
          return `${i + 1}. [${cat}] ${question}${tip ? ` (Dica: ${tip})` : ''}`;
        }).join('\n');

        const categories = [...new Set(questions.map(q => q.category || q.categoria || 'Geral'))];

        const filtered = activeCategory
          ? questions.filter(q => (q.category || q.categoria) === activeCategory)
          : questions;

        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#0066FF]" /> {questions.length} perguntas geradas
                <Tooltip text="Filtre as perguntas clicando nas categorias abaixo para montar o seu roteiro." />
              </h3>
              <CopyButton text={allText} label="Copiar todas" />
            </div>

            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onToggle={setActiveCategory}
            />

            <div className="space-y-3">
              {filtered.map((q, i) => {
                const cat = q.category || q.categoria || 'Geral';
                const question = q.question || q.pergunta || '';
                const tip = q.follow_up_tip || q.dica_follow_up;
                const color = getCategoryColor(cat);

                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-surface-2 border border-white/5 group hover:border-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md"
                            style={{ color, backgroundColor: `${color}15` }}
                          >
                            {cat}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-mono">
                            #{questions.indexOf(q) + 1}
                          </span>
                        </div>
                        <p className="font-medium text-white text-sm">{question}</p>
                        {tip && (
                          <p className="text-xs text-zinc-500 mt-2 italic flex items-center gap-1.5">
                            <span className="text-[#0066FF] shrink-0">💡</span> {tip}
                            <Tooltip text="Dica de follow-up: use esta abordagem caso o entrevistado dê uma resposta muito superficial." />
                          </p>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-1">
                        <CopyButton text={question} />
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
