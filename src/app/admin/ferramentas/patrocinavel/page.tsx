'use client';
import { Target } from 'lucide-react';
import { AIToolPage } from '@/components/admin/AIToolPage';

export default function PatrocinavelPage() {
  return (
    <AIToolPage
      title="DETECTOR DE PATROCINÁVEL"
      description="Identifica matérias que podem gerar vendas"
      icon={<div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center"><Target className="w-6 h-6 text-[#FF6B00]" /></div>}
      inputLabel="Tema ou corpo da matéria"
      inputPlaceholder="Ex: Artigo sobre kart no Brasil, crescimento da categoria, novos talentos..."
      apiEndpoint="/api/ai/sponsorable"
      buildPayload={(input) => ({ topic: input })}
      renderResult={(data) => <pre className="text-sm text-zinc-300 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>}
    />
  );
}
