import Link from 'next/link';
import {
  Lightbulb,
  Clapperboard,
  Cog,
  History,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Trophy,
  ChevronRight,
  Mail,
  Zap,
  Mic,
} from 'lucide-react';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { InstagramFeed } from '@/components/ui/InstagramFeed';
import { Camera } from 'lucide-react';

/* ---------- Editorias estáticas (fallback sem banco) ---------- */
const EDITORIAS = [
  { name: 'Você Sabia?', slug: 'voce-sabia', icon: Lightbulb, color: '#E8002D' },
  { name: 'Bastidores da F1', slug: 'bastidores', icon: Clapperboard, color: '#FF6B00' },
  { name: 'Engenharia Explicada', slug: 'engenharia', icon: Cog, color: '#0066FF' },
  { name: 'História da F1', slug: 'historia', icon: History, color: '#8B5CF6' },
  { name: 'Pilotos e Equipes', slug: 'pilotos-equipes', icon: Users, color: '#10B981' },
  { name: 'Análise de Corrida', slug: 'analise', icon: BarChart3, color: '#F59E0B' },
];

/* ---------- Curiosidades demo (será substituído pelo Supabase) ---------- */
const CURIOSIDADES_DEMO = [
  {
    title: 'Por que os pilotos de F1 são pesados DEPOIS da corrida?',
    brief: 'A FIA pesa pilotos + carro para garantir que o peso mínimo foi respeitado. Mas o motivo vai além...',
    slug: 'por-que-pilotos-pesados-depois-corrida',
    readTime: 2,
    image: '/images/peso-pilotos.png',
  },
  {
    title: 'O volante de F1 custa mais que um carro popular',
    brief: 'Com mais de 25 botões e um display integrado, o volante pode custar até R$ 300.000.',
    slug: 'volante-f1-mais-caro-que-carro',
    readTime: 3,
    image: '/images/volante-f1.png',
  },
  {
    title: 'A razão secreta por trás do "halo" que salvou vidas',
    brief: 'Rejeitado por pilotos no início, o halo já salvou pelo menos 7 vidas desde 2018.',
    slug: 'halo-f1-salvou-vidas',
    readTime: 4,
    image: '/images/halo-f1.png',
  },
  {
    title: 'Por que a F1 não usa pneus que não se desgastam?',
    brief: 'A Pirelli poderia fazer pneus indestrutíveis, mas a FIA proíbe. Entenda a estratégia por trás.',
    slug: 'f1-pneus-desgaste-proposital',
    readTime: 3,
    image: '/images/pneus-f1.png',
  },
  {
    title: 'Os carros de F1 podem andar de cabeça para baixo?',
    brief: 'A partir de 150 km/h, a força aerodinâmica é tão grande que o carro poderia rodar pelo teto de um túnel.',
    slug: 'f1-carros-cabeca-para-baixo',
    readTime: 2,
    image: '/images/aerodinamica.png',
  },
  {
    title: 'Quanto combustível um carro de F1 gasta por volta?',
    brief: 'Cada carro consome cerca de 2,1kg de combustível por volta. Mas há um limite máximo de 110kg por corrida.',
    slug: 'combustivel-f1-por-volta',
    readTime: 2,
    image: '/images/combustivel.png',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* ============ HERO ============ */}
      <section className="relative min-h-[75vh] flex flex-col justify-center bg-black">
        {/* Background base */}
        <div className="absolute inset-0 z-0 bg-black" />

        <div className="absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute bottom-0 right-0 w-full lg:w-[60%] h-full flex items-end pointer-events-none">
          <img
            src="/f1-bg.png"
            alt="F1 Car"
            className="w-full h-auto object-contain opacity-25 sm:opacity-35 lg:opacity-100"
          />
          </div>
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black via-black/90 lg:via-black/70 to-transparent" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black via-transparent to-black/40" />

        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 lg:px-8 pt-28 pb-10 flex flex-col">
          <h1 className="font-display italic text-6xl md:text-7xl lg:text-[100px] xl:text-[120px] uppercase leading-[0.85] tracking-tight text-white mb-2 animate-slide-up">
            CURIOSIDADES<br/>
            <span className="text-brand-red">E BASTIDORES</span>
          </h1>
          
          <div className="flex items-center gap-4 my-6 sm:my-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="h-[2px] w-8 sm:w-16 bg-brand-red" />
            <h2 className="font-display uppercase text-xl sm:text-2xl tracking-[0.3em] text-white">
              DA FÓRMULA 1
            </h2>
            <div className="h-[2px] w-8 sm:w-16 bg-brand-red" />
          </div>

          <p className="text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Curiosidades que você nunca ouviu, bastidores que
            ninguém conta e engenharia explicada de um jeito simples.
            <br className="hidden sm:block" />
            <br className="hidden sm:block" />
            Por <span className="text-brand-red font-bold">Enzo de Souza</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <a
              href="#curiosidades"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold uppercase tracking-wider transition-all"
            >
              <Lightbulb className="w-5 h-5 fill-white" />
              VER CURIOSIDADES
            </a>
            <Link
              href="/sobre"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-transparent border border-white/20 text-zinc-300 hover:text-white hover:border-white/50 font-bold uppercase tracking-wider transition-all"
            >
              CONHECER O ENZO
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="relative z-20 max-w-[1400px] w-full mx-auto px-4 lg:px-8 mt-8 pb-6 lg:pb-0 lg:translate-y-1/2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:gap-[1px] bg-white/10 shadow-2xl shadow-black/50 overflow-hidden">
            {[
              { title: 'CURIOSIDADES', desc: 'Fatos que você nunca imaginou.', icon: Zap },
              { title: 'ENGENHARIA', desc: 'Tecnologia e inovação além das pistas.', icon: Cog },
              { title: 'BASTIDORES', desc: 'O que acontece longe das câmeras.', icon: Mic },
              { title: 'HISTÓRIA', desc: 'Grandes momentos do automobilismo.', icon: Trophy },
              { title: 'PERSONAGENS', desc: 'Pilotos, equipes e suas trajetórias.', icon: Users },
            ].map((feature, i) => (
              <div key={i} className="p-6 flex items-center gap-4 hover:bg-white/5 bg-[#0f0f0f] transition-colors group">
                <div className="w-12 h-12 rounded-full border border-brand-red/30 flex items-center justify-center shrink-0 group-hover:bg-brand-red/10 transition-colors">
                  <feature.icon className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{feature.title}</h3>
                  <p className="text-xs text-zinc-400 leading-snug">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INSTAGRAM FEED ============ */}
      <section className="pt-24 lg:pt-32 pb-12 bg-surface-0">
        <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-brand-red text-sm font-bold uppercase tracking-widest mb-3">
                <Camera className="w-4 h-4" />
                No Paddock
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white">
                ÚLTIMOS BASTIDORES NO <span className="text-brand-red">INSTAGRAM</span>
              </h2>
              <p className="text-zinc-500 mt-2 max-w-lg">
                Conteúdo rápido, curiosidades e vídeos diários direto do paddock.
              </p>
            </div>
          </div>
          <InstagramFeed />
        </div>
      </section>

      {/* ============ CURIOSIDADES (DESTAQUE PRINCIPAL) ============ */}
      <section id="curiosidades" className="pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-brand-red text-sm font-bold uppercase tracking-widest mb-3">
                <Lightbulb className="w-4 h-4" />
                Destaque
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-white">
                VOCÊ SABIA<span className="text-brand-red">?</span>
              </h2>
              <p className="text-zinc-500 mt-2 max-w-lg">
                Curiosidades rápidas sobre F1 para você aprender algo novo em 30 segundos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CURIOSIDADES_DEMO.map((item, i) => (
              <Link
                key={item.slug}
                href={`/f1/${item.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-card border border-white/5 hover:border-brand-red/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-red/5 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative aspect-[16/10] bg-gradient-to-br from-surface-3 to-surface-2 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-red/90 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    <Lightbulb className="w-3 h-3" /> Você Sabia?
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-5 flex-1">
                  <h3 className="font-accent text-lg font-bold leading-tight text-white group-hover:text-brand-red transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                    {item.brief}
                  </p>
                  <div className="mt-auto pt-3 flex items-center justify-between text-xs text-zinc-600">
                    <span>{item.readTime} min de leitura</span>
                    <ChevronRight className="w-4 h-4 text-brand-red opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EDITORIAS ============ */}
      <section id="editorias" className="py-12 lg:py-16 bg-surface-0">
        <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl text-white mb-3">
              EDITORIAS
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              Conteúdo autoral organizado por tema. Escolha o que mais te interessa.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {EDITORIAS.map((ed) => (
              <Link
                key={ed.slug}
                href={`/#${ed.slug}`}
                className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-surface-card border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${ed.color}15` }}
                >
                  <ed.icon className="w-6 h-6" style={{ color: ed.color }} />
                </div>
                <span className="text-sm font-accent font-bold text-zinc-300 text-center leading-tight group-hover:text-white transition-colors">
                  {ed.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,0,45,0.06),transparent_70%)]" />
        <div className="relative max-w-[1400px] w-full mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
              <Mail className="w-7 h-7 text-brand-red" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white">
              BRIEFING ANTES DAS <span className="text-brand-red">8H</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed max-w-lg">
              Toda manhã, direto do Enzo pra você: o que rolou de mais interessante
              no mundo da F1 — com curiosidades que você não vai achar em nenhum outro lugar.
            </p>
            <NewsletterForm />
            <p className="text-xs text-zinc-600">
              Sem spam. Cancele quando quiser.
            </p>
          </div>
        </div>
      </section>




      {/* ============ CTA ANUNCIE ============ */}
      <section className="py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 via-transparent to-transparent" />
        <div className="relative max-w-[1400px] w-full mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 p-10 lg:p-16 rounded-3xl bg-surface-card border border-white/5">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
                APAREÇA NO <span className="text-brand-red">GOOGLE</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed max-w-xl">
                Matéria profissional otimizada para SEO, escrita pelo Enzo,
                publicada no Piloto Curioso e indexada no Google.
                Ideal para pilotos, equipes, categorias e empresas do automobilismo.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <a
                href="https://api.whatsapp.com/send?phone=5511976377682&text=Ol%C3%A1%20Enzo!%20Tenho%20interesse%20em%20uma%20mat%C3%A9ria%20no%20Piloto%20Curioso."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#25D366]/20"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.004 2C6.477 2 2 6.477 2 12.004c0 1.758.455 3.456 1.32 4.954L2 22l5.19-1.353a9.96 9.96 0 004.814 1.238c5.526 0 10.003-4.478 10.003-10.005C22.007 6.477 17.53 2 12.004 2z" />
                </svg>
                Falar com o Enzo
              </a>
              <Link
                href="/anuncie"
                className="text-center text-sm text-zinc-500 hover:text-white transition"
              >
                Saiba mais sobre o serviço →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
