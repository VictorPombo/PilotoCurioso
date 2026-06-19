import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre o Enzo de Souza',
  description: 'Conheça Enzo de Souza, jornalista especializado em Fórmula 1, criador do Piloto Curioso.',
};

export default function SobrePage() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <img
            src="/images/enzo.png"
            alt="Enzo de Souza"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shrink-0 shadow-2xl shadow-brand-red/20 ring-4 ring-brand-red/20"
          />
          <div className="text-center md:text-left">
            <h1 className="font-display text-5xl md:text-6xl text-white mb-3">
              ENZO DE <span className="text-brand-red">SOUZA</span>
            </h1>
            <p className="text-lg text-zinc-400">
              Jornalista · Criador do Piloto Curioso · Especialista em F1
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <a
                href="https://instagram.com/piloto__curioso"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-red hover:border-brand-red/30 transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:contato@pilotocurioso.com.br"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-red hover:border-brand-red/30 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-6 text-zinc-300 leading-relaxed text-lg">
            <p>
              Desde criança, a Fórmula 1 sempre foi mais do que um esporte para mim.
              Era um universo inteiro de histórias não contadas, engenharia impossível
              e personagens que mereciam ser conhecidos.
            </p>
            <p>
              O <strong className="text-white">Piloto Curioso</strong> nasceu dessa paixão:
              trazer para você as curiosidades, bastidores e análises que você não encontra
              em nenhum outro lugar. Cada matéria é pesquisada, verificada e escrita por mim
              — com o objetivo de fazer você aprender algo novo em poucos minutos.
            </p>
            <p>
              Além do portal, produzo conteúdo diário no{' '}
              <a href="https://instagram.com/piloto__curioso" className="text-brand-red hover:underline" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-surface-card border border-white/5 text-center">
          <h2 className="font-display text-3xl text-white mb-3">
            QUER APARECER NO <span className="text-brand-red">GOOGLE?</span>
          </h2>
          <p className="text-zinc-500 mb-6 max-w-lg mx-auto">
            Escrevo matérias profissionais otimizadas para SEO sobre pilotos, equipes e
            empresas do automobilismo. Indexação garantida.
          </p>
          <Link
            href="/anuncie"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-bold uppercase tracking-wider transition-all"
          >
            Saiba como funciona <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
