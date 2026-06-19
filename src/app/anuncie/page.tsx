import type { Metadata } from 'next';
import { CheckCircle, ArrowRight, Shield, TrendingUp, Search, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Anuncie — Apareça no Google',
  description: 'Tenha uma matéria profissional sobre você ou sua empresa publicada no Piloto Curioso, otimizada para SEO e indexada no Google.',
};

const BENEFICIOS = [
  { icon: Search, title: 'SEO otimizado', desc: 'Matéria escrita com técnicas de SEO para ranquear no Google.' },
  { icon: Globe, title: 'Indexação no Google', desc: 'Seu nome ou marca aparecendo nas buscas do Google.' },
  { icon: Shield, title: 'Credibilidade editorial', desc: 'Publicação em portal jornalístico especializado em F1.' },
  { icon: TrendingUp, title: 'Audiência qualificada', desc: 'Leitores apaixonados por automobilismo, 18-45 anos.' },
];

const COMO_FUNCIONA = [
  'Você entra em contato pelo WhatsApp ou e-mail',
  'Conversamos sobre o tema, objetivos e contexto',
  'Eu escrevo a matéria com otimização SEO profissional',
  'Você revisa e aprova antes da publicação',
  'A matéria é publicada e indexada no Google',
];

export default function AnunciePage() {
  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-20 lg:py-28">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 text-sm text-brand-red font-bold uppercase tracking-wider mb-6">
            Para empresas e pilotos
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mb-6">
            APAREÇA NO <span className="text-brand-red">GOOGLE</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Uma matéria profissional sobre você ou sua empresa,
            escrita pelo Enzo, publicada no Piloto Curioso e
            otimizada para aparecer nas buscas do Google.
          </p>
        </div>

        {/* Benefícios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-20">
          {BENEFICIOS.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-4 p-6 rounded-2xl bg-surface-card border border-white/5"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
                <b.icon className="w-5 h-5 text-brand-red" />
              </div>
              <div>
                <h3 className="font-accent font-bold text-white text-lg mb-1">{b.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Como funciona */}
        <div className="mb-20">
          <h2 className="font-display text-3xl text-white text-center mb-10">
            COMO <span className="text-brand-red">FUNCIONA</span>
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {COMO_FUNCIONA.map((step, i) => (
              <div key={i} className="flex items-center gap-4 p-5 rounded-xl bg-surface-card border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-brand-red/20 text-brand-red flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <p className="text-zinc-300">{step}</p>
                <CheckCircle className="w-5 h-5 text-zinc-700 ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-10 lg:p-16 rounded-3xl bg-gradient-to-br from-brand-red/10 to-transparent border border-brand-red/10">
          <h2 className="font-display text-4xl text-white mb-4">
            VAMOS CONVERSAR<span className="text-brand-red">?</span>
          </h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
            Negociação direta, sem burocracia. Me conta o que você precisa
            e eu monto a melhor estratégia de conteúdo pra você.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=5511976377682&text=Ol%C3%A1%20Enzo!%20Tenho%20interesse%20em%20uma%20mat%C3%A9ria%20no%20Piloto%20Curioso."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#25D366]/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.004 2C6.477 2 2 6.477 2 12.004c0 1.758.455 3.456 1.32 4.954L2 22l5.19-1.353a9.96 9.96 0 004.814 1.238c5.526 0 10.003-4.478 10.003-10.005C22.007 6.477 17.53 2 12.004 2z" />
              </svg>
              Falar no WhatsApp
            </a>
            <a
              href="mailto:contato@pilotocurioso.com.br"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white font-medium transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              Enviar e-mail
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
