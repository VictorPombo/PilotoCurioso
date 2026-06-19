'use client';
import { Repeat } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';

export default function ReaproveitamentoPage() {
  return (
    <AIToolPage
      title="REAPROVEITAMENTO DE CONTEÚDO"
      description="1 matéria → roteiro YouTube, Reels, carrossel, LinkedIn e thread X"
      icon={<div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center"><Repeat className="w-6 h-6 text-[#10B981]" /></div>}
      inputLabel="Cole o título e corpo da matéria"
      inputPlaceholder="Título: ...\n\nCorpo: ..."
      apiEndpoint="/api/ai/repurpose"
      buildPayload={(input) => {
        const lines = input.split('\n');
        const titleLine = lines.find(l => l.toLowerCase().startsWith('título:') || l.toLowerCase().startsWith('titulo:'));
        const title = titleLine ? titleLine.replace(/^t[ií]tulo:\s*/i, '') : lines[0];
        const body = lines.slice(1).join('\n');
        return { title, body };
      }}
      renderResult={(data) => <pre className="text-sm text-zinc-300 whitespace-pre-wrap overflow-auto max-h-[60vh]">{JSON.stringify(data, null, 2)}</pre>}
    />
  );
}
