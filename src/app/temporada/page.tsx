import type { Metadata } from 'next';
import { Calendar, Trophy, History } from 'lucide-react';
import { RaceCalendar } from '@/components/blocks/RaceCalendar';
import { Standings } from '@/components/blocks/Standings';
import { RaceHistory } from '@/components/blocks/RaceHistory';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Temporada F1 - Calendário e Classificação',
  description: 'Acompanhe o calendário completo da Fórmula 1, classificação do campeonato de pilotos e construtores e histórico de corridas.',
};

function LoadingBlock() {
  return (
    <div className="py-20 flex justify-center border border-white/5 rounded-xl bg-surface-1">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red"></div>
    </div>
  );
}

export default function TemporadaPage() {
  return (
    <main className="min-h-screen bg-surface-0 pt-[100px] pb-20">
      <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8">
        
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="font-display text-5xl md:text-6xl text-white uppercase tracking-wider mb-4">
            Temporada <span className="text-brand-red">F1</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Tudo o que você precisa saber sobre o campeonato atual: corridas, classificação em tempo real e resultados históricos.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lado Esquerdo: Calendário */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-surface-1 border border-white/5 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-brand-red" />
                </div>
                <h2 className="font-display text-2xl text-white uppercase tracking-wider">
                  Calendário de Corridas
                </h2>
              </div>
              
              <Suspense fallback={<LoadingBlock />}>
                <RaceCalendar />
              </Suspense>
            </section>

            <section className="bg-surface-1 border border-white/5 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <History className="w-5 h-5 text-zinc-400" />
                </div>
                <h2 className="font-display text-2xl text-white uppercase tracking-wider">
                  Histórico e Resultados
                </h2>
              </div>
              
              <Suspense fallback={<LoadingBlock />}>
                <RaceHistory />
              </Suspense>
            </section>
          </div>

          {/* Lado Direito: Classificação / Ranking */}
          <div className="space-y-8">
            <section className="bg-surface-1 border border-white/5 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#d4af37]" />
                </div>
                <h2 className="font-display text-2xl text-white uppercase tracking-wider">
                  Classificação
                </h2>
              </div>
              
              {/* Standings é um Client Component que faz seu próprio fetch on mount */}
              <Standings />
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}
