import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notícias do Automobilismo | Piloto Curioso',
  description: 'As principais notícias do automobilismo nacional e internacional. Fórmula 1, Stock Car, Porsche Cup e muito mais.',
};

const MOCK_NEWS = [
  {
    id: '1',
    title: 'Nova geração da Stock Car promete ser a mais rápida da história em Interlagos',
    brief: 'Com novos motores e ajustes aerodinâmicos agressivos, equipes já projetam quebra de recordes na próxima etapa.',
    slug: 'nova-geracao-stock-car',
    category: 'Stock Car',
    color: '#EF4444',
    image: '/images/news/stock-car.png',
    date: '18 Jun 2026',
    readTime: 4,
  },
  {
    id: '2',
    title: 'Porsche Cup Brasil anuncia calendário expandido com prova noturna',
    brief: 'Categoria monomarca confirma etapa em Goiânia debaixo das luzes, trazendo um novo desafio para os pilotos.',
    slug: 'porsche-cup-corrida-noturna',
    category: 'Automobilismo Brasileiro',
    color: '#FDE047',
    image: '/images/news/porsche-cup.png',
    date: '17 Jun 2026',
    readTime: 3,
  },
  {
    id: '3',
    title: 'Copa Truck: Piloto novato surpreende e vence na sua estreia',
    brief: 'Numa corrida caótica e cheia de disputas na chuva, o jovem talento conseguiu segurar a pressão dos veteranos.',
    slug: 'copa-truck-vitoria-novato',
    category: 'Automobilismo Brasileiro',
    color: '#FDE047',
    image: '/images/news/copa-truck.png',
    date: '16 Jun 2026',
    readTime: 5,
  },
  {
    id: '4',
    title: 'Fórmula 4 Brasil revela novos talentos que miram a elite europeia',
    brief: 'Acompanhe quem são os três pilotos brasileiros que estão se destacando na categoria de base e já negociam ida para a Europa.',
    slug: 'destaques-f4-brasil',
    category: 'Fórmula 2', // mockado assim pra mostrar outra cat
    color: '#1D4ED8',
    image: '/images/news/f4-br.png',
    date: '15 Jun 2026',
    readTime: 6,
  },
  {
    id: '5',
    title: 'Império Endurance Brasil tem grid recorde nas 4 Horas de Interlagos',
    brief: 'Protótipos e GTs dividem a pista em uma das corridas mais insanas do ano, com equipes de fábrica disputando a vitória.',
    slug: 'endurance-grid-recorde',
    category: 'Endurance',
    color: '#8B5CF6',
    image: '/images/news/endurance.png',
    date: '14 Jun 2026',
    readTime: 4,
  },
  {
    id: '6',
    title: 'Campeonato Brasileiro de Kart atrai pilotos da F1 para o kartódromo',
    brief: 'Evento tradicional em São Paulo contou com a presença ilustre de pilotos do grid atual da Fórmula 1 para prestigiar a base.',
    slug: 'kart-brasileiro-f1',
    category: 'Mercado de Pilotos',
    color: '#F59E0B',
    image: '/images/news/kart.png',
    date: '13 Jun 2026',
    readTime: 3,
  },
];

const CATEGORIES = [
  'Todas', 'Fórmula 1', 'Fórmula 2', 'Fórmula E', 'Automobilismo Brasileiro', 'Stock Car', 'Endurance', 'Mercado de Pilotos', 'Entrevistas'
];

export default function NoticiasPage() {
  return (
    <main className="min-h-screen bg-surface-0 pt-[100px] pb-20">
      <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8">
        
        {/* HEADER */}
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="font-display text-5xl md:text-6xl text-white uppercase tracking-wider mb-6">
            Últimas <span className="text-brand-red">Notícias</span>
          </h1>
          
          {/* CATEGORY TABS (Mockadas por enquanto) */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === 0 
                    ? 'bg-brand-red text-white' 
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* FEATURED NEWS (Primeira notícia) */}
        <div className="mb-12">
          <Link href={`/noticias/${MOCK_NEWS[0].slug}`} className="group relative block rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[21/7] bg-surface-1 border border-white/5">
            <div className="absolute inset-0">
              <img src={MOCK_NEWS[0].image} alt={MOCK_NEWS[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
              <span 
                className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded text-white mb-4"
                style={{ backgroundColor: MOCK_NEWS[0].color }}
              >
                {MOCK_NEWS[0].category}
              </span>
              <h2 className="font-display text-3xl md:text-5xl text-white uppercase tracking-wide leading-tight max-w-4xl mb-4 group-hover:text-brand-red transition-colors">
                {MOCK_NEWS[0].title}
              </h2>
              <p className="hidden md:block text-zinc-300 text-lg max-w-3xl mb-4">
                {MOCK_NEWS[0].brief}
              </p>
              <div className="flex items-center gap-4 text-sm text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {MOCK_NEWS[0].date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {MOCK_NEWS[0].readTime} min</span>
              </div>
            </div>
          </Link>
        </div>

        {/* NEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {MOCK_NEWS.slice(1).map((news) => (
            <Link key={news.id} href={`/noticias/${news.slug}`} className="group flex flex-col bg-surface-1 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-1">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span 
                    className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded text-white shadow-lg"
                    style={{ backgroundColor: news.color }}
                  >
                    {news.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-2xl text-white uppercase tracking-wide leading-snug mb-3 group-hover:text-brand-red transition-colors">
                  {news.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                  {news.brief}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {news.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {news.readTime} min</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
