'use client';

import { useState } from 'react';
import { Repeat, Play, Video, SquarePlay, Briefcase, MessageCircle } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';
import { CopyButton } from '@/components/admin/CopyButton';
import { Tooltip } from '@/components/admin/Tooltip';

interface RepurposeResult {
  youtube?: string;
  roteiro_youtube?: string;
  reels?: string;
  roteiro_reels?: string;
  carrossel?: string;
  carrossel_instagram?: string;
  linkedin?: string;
  post_linkedin?: string;
  twitter?: string;
  thread_twitter?: string;
  thread_x?: string;
  [key: string]: unknown;
}

interface TabConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  extractor: (d: RepurposeResult) => string;
}

const TABS: TabConfig[] = [
  {
    key: 'youtube',
    label: 'YouTube',
    icon: <Play className="w-4 h-4" />,
    color: '#FF0000',
    extractor: (d) => stringify(d.youtube || d.roteiro_youtube || findKeyByRegex(d, /youtube/i)),
  },
  {
    key: 'reels',
    label: 'Reels',
    icon: <Video className="w-4 h-4" />,
    color: '#E4405F',
    extractor: (d) => stringify(d.reels || d.roteiro_reels || findKeyByRegex(d, /reels/i)),
  },
  {
    key: 'carrossel',
    label: 'Carrossel IG',
    icon: <SquarePlay className="w-4 h-4" />,
    color: '#C13584',
    extractor: (d) => stringify(d.carrossel || d.carrossel_instagram || findKeyByRegex(d, /carrossel|instagram|ig/i)),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: <Briefcase className="w-4 h-4" />,
    color: '#0A66C2',
    extractor: (d) => stringify(d.linkedin || d.post_linkedin || findKeyByRegex(d, /linkedin/i)),
  },
  {
    key: 'twitter',
    label: 'X / Twitter',
    icon: <MessageCircle className="w-4 h-4" />,
    color: '#1DA1F2',
    extractor: (d) => stringify(d.twitter || d.thread_twitter || d.thread_x || findKeyByRegex(d, /twitter|tweet|x/i)),
  },
];

function findKeyByRegex(d: RepurposeResult, regex: RegExp): unknown {
  for (const key in d) {
    if (regex.test(key)) return d[key];
  }
  return null;
}

function stringify(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  
  if (Array.isArray(value)) {
    return value.map((item, i) => {
      const parsed = stringify(item);
      // Se for apenas uma string simples, adiciona número, se for um bloco de texto, separa por quebra de linha
      return parsed.includes('\n') ? parsed : `${i + 1}. ${parsed}`;
    }).join('\n\n');
  }
  
  if (typeof value === 'object') {
    // Flatten objects to readable text instead of JSON syntax
    const obj = value as Record<string, unknown>;
    return Object.entries(obj).map(([k, v]) => {
      const cleanKey = k.replace(/_/g, ' ').toUpperCase();
      const cleanVal = stringify(v);
      // Se o valor tiver múltiplas linhas, coloca a chave como título
      if (cleanVal.includes('\n')) {
        return `[${cleanKey}]\n${cleanVal}`;
      }
      return `${cleanKey}: ${cleanVal}`;
    }).join('\n\n');
  }
  
  return String(value);
}

export default function ReaproveitamentoPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <AIToolPage
      title="REAPROVEITAMENTO DE CONTEÚDO"
      description="1 matéria → roteiro YouTube, Reels, carrossel, LinkedIn e thread X"
      icon={
        <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
          <Repeat className="w-6 h-6 text-[#10B981]" />
        </div>
      }
      inputLabel="Cole o título e corpo da matéria"
      inputPlaceholder="Título: ...&#10;&#10;Corpo: ..."
      apiEndpoint="/api/ai/repurpose"
      buildPayload={(input) => {
        const lines = input.split('\n');
        const titleLine = lines.find(l => l.toLowerCase().startsWith('título:') || l.toLowerCase().startsWith('titulo:'));
        const title = titleLine ? titleLine.replace(/^t[ií]tulo:\s*/i, '') : lines[0];
        const body = lines.slice(1).join('\n');
        return { title, body };
      }}
      renderResult={(data: unknown) => {
        const d = data as RepurposeResult;

        // If it's a raw text response
        if (d.raw) {
          return (
            <div className="relative">
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap">{d.raw as string}</pre>
              <div className="absolute top-0 right-0">
                <CopyButton text={d.raw as string} label="Copiar" />
              </div>
            </div>
          );
        }

        const currentTab = TABS[activeTab];
        const content = currentTab.extractor(d);

        // Collect all content for "copy all"
        const allContent = TABS.map(tab => {
          const tabContent = tab.extractor(d);
          return tabContent ? `=== ${tab.label.toUpperCase()} ===\n\n${tabContent}` : '';
        }).filter(Boolean).join('\n\n---\n\n');

        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-accent font-bold text-white text-lg flex items-center gap-2">
                <Repeat className="w-5 h-5 text-[#10B981]" /> 5 formatos gerados
                <Tooltip text="A IA reescreveu a sua matéria em 5 formatos diferentes, já adequando a linguagem e o tamanho para cada rede social." />
              </h3>
              <CopyButton text={allContent} label="Copiar tudo" />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-surface-2 overflow-x-auto">
              {TABS.map((tab, i) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    i === activeTab
                      ? 'text-white shadow-lg'
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                  style={i === activeTab ? { backgroundColor: `${tab.color}20`, color: tab.color } : undefined}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="relative p-5 rounded-xl bg-surface-2 border border-white/5 min-h-[200px]">
              {content ? (
                <>
                  <div className="absolute top-4 right-4">
                    <CopyButton text={content} label="Copiar" />
                  </div>
                  <div className="pr-20">
                    <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {content}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
                  Nenhum conteúdo gerado para este formato.
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
