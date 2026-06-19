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
  { id: 1, name: 'Central de Oportunidades', desc: 'Temas com alta chance de tráfego', icon: TrendingUp, color: '#E8002D', href: '/admin/ferramentas/oportunidades' },
  { id: 2, name: 'Detector de Patrocinável', desc: 'Matérias que podem gerar venda', icon: Target, color: '#FF6B00', href: '/admin/ferramentas/patrocinavel' },
  { id: 3, name: 'Assistente de Entrevista', desc: 'Perguntas inteligentes para entrevistas', icon: Mic, color: '#0066FF', href: '/admin/ferramentas/entrevista' },
  { id: 4, name: 'Reaproveitamento', desc: '1 matéria → 5 conteúdos', icon: Repeat, color: '#10B981', href: '/admin/ferramentas/reaproveitamento' },
  { id: 5, name: 'Score de Viralização', desc: 'Estimativas antes de publicar', icon: BarChart3, color: '#F59E0B', href: '/admin/ferramentas/viral-score' },
  { id: 6, name: 'Banco de Fontes', desc: 'CRM de contatos jornalísticos', icon: Users, color: '#6366F1', href: '/admin/fontes' },
  { id: 7, name: 'Timeline Inteligente', desc: 'Histórico de temas da F1', icon: Clock, color: '#8B5CF6', href: '/admin/ferramentas/timeline' },
  { id: 8, name: 'Radar de Emergentes', desc: 'Pilotos em ascensão', icon: Radar, color: '#EC4899', href: '/admin/ferramentas/radar' },
  { id: 9, name: 'Mapa de Receita', desc: 'Controle financeiro', icon: DollarSign, color: '#22C55E', href: '/admin/receita' },
  { id: 10, name: 'Biblioteca de Curiosidades', desc: 'Gerador infinito de ideias ⭐', icon: Lightbulb, color: '#E8002D', href: '/admin/ferramentas/curiosidades' },
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
            className="group flex flex-col gap-4 p-6 rounded-2xl bg-surface-card border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5"
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
          </Link>
        ))}
      </div>
    </div>
  );
}
