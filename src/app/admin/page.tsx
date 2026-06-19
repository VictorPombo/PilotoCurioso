'use client';

import Link from 'next/link';
import { FileText, Eye, PenSquare, Sparkles, TrendingUp, Clock } from 'lucide-react';

const STATS = [
  { label: 'Matérias', value: '—', icon: FileText, color: '#E8002D' },
  { label: 'Views Total', value: '—', icon: Eye, color: '#0066FF' },
  { label: 'Rascunhos', value: '—', icon: PenSquare, color: '#F59E0B' },
  { label: 'Agendadas', value: '—', icon: Clock, color: '#8B5CF6' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">DASHBOARD</h1>
        <p className="text-zinc-500 mt-1">Visão geral do Piloto Curioso</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-3 p-5 rounded-2xl bg-surface-card border border-white/5"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-display text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/editor/new"
          className="flex items-center gap-4 p-6 rounded-2xl bg-brand-red/5 border border-brand-red/20 hover:bg-brand-red/10 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center">
            <PenSquare className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <p className="font-accent font-bold text-white text-lg group-hover:text-brand-red transition-colors">
              Nova Matéria
            </p>
            <p className="text-sm text-zinc-500">Criar ou gerar com IA</p>
          </div>
        </Link>

        <Link
          href="/admin/ferramentas"
          className="flex items-center gap-4 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 hover:bg-purple-500/10 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="font-accent font-bold text-white text-lg group-hover:text-purple-400 transition-colors">
              Ferramentas IA
            </p>
            <p className="text-sm text-zinc-500">10 ferramentas de produtividade</p>
          </div>
        </Link>
      </div>

      {/* Placeholder for recent articles */}
      <div>
        <h2 className="font-accent font-bold text-white text-xl mb-4">Últimas matérias</h2>
        <div className="rounded-2xl bg-surface-card border border-white/5 p-10 text-center">
          <TrendingUp className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">Configure o Supabase para ver as matérias aqui.</p>
          <Link
            href="/admin/editor/new"
            className="inline-flex items-center gap-2 mt-4 text-sm text-brand-red hover:underline"
          >
            Criar primeira matéria →
          </Link>
        </div>
      </div>
    </div>
  );
}
