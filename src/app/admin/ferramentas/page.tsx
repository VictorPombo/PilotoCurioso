'use client';

import Link from 'next/link';
import {
  TrendingUp,
  Target,
  Mic,
  Repeat,
  BarChart3,
  Users,
  Clock,
  Radar,
  DollarSign,
  Lightbulb,
} from 'lucide-react';

const TOOLS = [
  {
    id: 1, name: 'Central de Oportunidades', desc: 'Temas com alta chance de tráfego',
    tooltip: 'A IA analisa tendências atuais da F1 e sugere temas com alto potencial de tráfego orgânico. Basta informar o contexto (próximo GP, pilotos em destaque, etc.).',
    icon: TrendingUp, color: '#E8002D', href: '/admin/ferramentas/oportunidades',
  },
  {
    id: 2, name: 'Detector de Patrocinável', desc: 'Matérias que podem gerar venda',
    tooltip: 'Cole o tema ou corpo de uma matéria e a IA identifica se ela pode atrair patrocinadores — incluindo alvos de prospecção, pitch sugerido e valor estimado de mercado.',
    icon: Target, color: '#FF6B00', href: '/admin/ferramentas/patrocinavel',
  },
  {
    id: 3, name: 'Assistente de Entrevista', desc: 'Perguntas inteligentes para entrevistas',
    tooltip: 'Informe quem será entrevistado e a IA gera ~20 perguntas divididas em categorias: Técnicas, Carreira, Bastidores e Polêmicas. Inclui dicas de follow-up.',
    icon: Mic, color: '#0066FF', href: '/admin/ferramentas/entrevista',
  },
  {
    id: 4, name: 'Reaproveitamento', desc: '1 matéria → 5 conteúdos',
    tooltip: 'Cole uma matéria publicada e a IA gera 5 versões prontas: roteiro YouTube (3-5 min), roteiro Reels (30-60s), carrossel Instagram, post LinkedIn e thread X/Twitter.',
    icon: Repeat, color: '#10B981', href: '/admin/ferramentas/reaproveitamento',
  },
  {
    id: 5, name: 'Score de Viralização', desc: 'Estimativas antes de publicar',
    tooltip: 'Cole título + corpo da matéria e receba scores de 0-100 para Viralização, SEO e Compartilhamento, além de tempo de leitura estimado, CTR e sugestões de melhoria.',
    icon: BarChart3, color: '#F59E0B', href: '/admin/ferramentas/viral-score',
  },
  {
    id: 6, name: 'Banco de Fontes', desc: 'CRM de contatos jornalísticos',
    tooltip: 'Gerencie seus contatos jornalísticos organizados por área de atuação. Ideal para agilizar apurações e encontrar fontes confiáveis rapidamente.',
    icon: Users, color: '#6366F1', href: '/admin/fontes',
  },
  {
    id: 7, name: 'Timeline Inteligente', desc: 'Histórico de temas da F1',
    tooltip: 'Digite qualquer tema da F1 (ex: Motor V10, DRS, Safety Car) e a IA cria uma timeline visual com marcos históricos, datas e significado de cada evento.',
    icon: Clock, color: '#8B5CF6', href: '/admin/ferramentas/timeline',
  },
  {
    id: 8, name: 'Radar de Emergentes', desc: 'Pilotos em ascensão',
    tooltip: 'A IA identifica pilotos em ascensão nas categorias de base (F4, F-Regional, Kart). Retorna nome, idade, categoria, destaques e potencial de matéria patrocinada.',
    icon: Radar, color: '#EC4899', href: '/admin/ferramentas/radar',
  },
  {
    id: 9, name: 'Mapa de Receita', desc: 'Controle financeiro',
    tooltip: 'Controle visual das receitas do portal — matérias patrocinadas, publicidade e outras fontes de renda organizadas por período.',
    icon: DollarSign, color: '#22C55E', href: '/admin/receita',
  },
  {
    id: 10, name: 'Biblioteca de Curiosidades', desc: 'Gerador infinito de ideias ⭐',
    tooltip: 'Escolha uma categoria (motores, pneus, história, pilotos, etc.) e a IA gera 10 curiosidades inéditas e verificáveis sobre F1. Pode enviar direto para o Editor.',
    icon: Lightbulb, color: '#E8002D', href: '/admin/ferramentas/curiosidades',
  },
];

export default function FerramentasPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">FERRAMENTAS IA</h1>
        <p className="text-zinc-500 mt-1">10 ferramentas para produzir mais e melhor</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group relative flex flex-col gap-4 p-6 rounded-2xl bg-surface-card border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${tool.color}15` }}
              >
                <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
              </div>
              <span className="text-xs text-zinc-600 font-mono">#{tool.id}</span>
            </div>
            <div>
              <h3 className="font-accent font-bold text-white text-lg group-hover:text-brand-red transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-zinc-500 mt-1">{tool.desc}</p>
            </div>

            {/* Tooltip no hover */}
            <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              <div className="w-full p-3 rounded-xl bg-zinc-900/95 border border-white/10 backdrop-blur-sm shadow-xl">
                <p className="text-xs text-zinc-300 leading-relaxed">{tool.tooltip}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
