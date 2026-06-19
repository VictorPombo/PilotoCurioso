'use client';

import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';

export default function EditorListPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-white tracking-wide">MATÉRIAS</h1>
          <p className="text-zinc-500 mt-1">Gerencie todas as matérias do portal</p>
        </div>
        <Link
          href="/admin/editor/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova
        </Link>
      </div>

      <div className="rounded-2xl bg-surface-card border border-white/5 p-10 text-center">
        <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-500">Configure o Supabase para listar matérias.</p>
        <Link
          href="/admin/editor/new"
          className="inline-flex items-center gap-2 mt-4 text-sm text-brand-red hover:underline"
        >
          Criar primeira matéria →
        </Link>
      </div>
      <div className="mt-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/5 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Integração Instagram</h2>
          <p className="text-sm text-zinc-400">
            Conecte a conta do Instagram do Piloto Curioso para exibir os vídeos automaticamente na home.
          </p>
        </div>
        <a
          href="/api/instagram/auth"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shrink-0"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          Conectar Instagram
        </a>
      </div>
    </div>
  );
}
