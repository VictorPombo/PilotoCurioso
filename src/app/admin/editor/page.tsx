'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, FileText, Eye, Sparkles, Clock, CheckCircle, Send, Pencil, Trash2, Loader2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  brief: string | null;
  status: string;
  type: string;
  views: number;
  likes: number;
  reading_time: number;
  ia_generated: boolean;
  is_sponsored: boolean;
  published_at: string | null;
  created_at: string;
  category: { id: string; name: string } | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  published: { label: 'Publicada', color: 'text-emerald-400 bg-emerald-500/10', icon: CheckCircle },
  draft: { label: 'Rascunho', color: 'text-zinc-400 bg-zinc-500/10', icon: FileText },
  scheduled: { label: 'Agendada', color: 'text-purple-400 bg-purple-500/10', icon: Clock },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EditorListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoading(true);
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch {
      console.error('Erro ao carregar matérias');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta matéria?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      console.error('Erro ao excluir');
    } finally {
      setDeleting(null);
    }
  }

  const filtered = filter === 'all' ? articles : articles.filter((a) => a.status === filter);

  const counts = {
    all: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    draft: articles.filter((a) => a.status === 'draft').length,
    scheduled: articles.filter((a) => a.status === 'scheduled').length,
  };

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

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'published', 'draft', 'scheduled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-brand-red/20 text-brand-red border border-brand-red/30'
                : 'bg-surface-2 text-zinc-400 border border-white/5 hover:text-white'
            }`}
          >
            {f === 'all' ? 'Todas' : STATUS_CONFIG[f]?.label || f} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl bg-surface-card border border-white/5 p-10 text-center">
          <Loader2 className="w-8 h-8 text-zinc-500 mx-auto mb-3 animate-spin" />
          <p className="text-zinc-500">Carregando matérias...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl bg-surface-card border border-white/5 p-10 text-center">
          <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">
            {filter === 'all' ? 'Nenhuma matéria encontrada.' : `Nenhuma matéria com status "${STATUS_CONFIG[filter]?.label}".`}
          </p>
          <Link
            href="/admin/editor/new"
            className="inline-flex items-center gap-2 mt-4 text-sm text-brand-red hover:underline"
          >
            Criar primeira matéria →
          </Link>
        </div>
      )}

      {/* Articles list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((article) => {
            const statusCfg = STATUS_CONFIG[article.status] || STATUS_CONFIG.draft;
            const StatusIcon = statusCfg.icon;

            return (
              <div
                key={article.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-surface-card border border-white/5 hover:border-white/10 transition-colors group"
              >
                {/* Status icon */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${statusCfg.color}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-sm truncate">{article.title}</h3>
                    {article.ia_generated && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase shrink-0">
                        <Sparkles className="w-3 h-3" />
                        IA
                      </span>
                    )}
                    {article.is_sponsored && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase shrink-0">
                        Patrocinada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                    {article.category && (
                      <span className="text-zinc-400">{article.category.name}</span>
                    )}
                    <span>{formatDate(article.created_at)}</span>
                    {article.reading_time > 0 && <span>{article.reading_time} min leitura</span>}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-500 shrink-0">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {article.views || 0}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {article.status === 'published' && (
                    <Link
                      href={`/noticias/${article.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-surface-2 text-zinc-400 hover:text-white transition-colors"
                      title="Ver no portal"
                    >
                      <Send className="w-4 h-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/editor/${article.id}`}
                    className="p-2 rounded-lg bg-surface-2 text-zinc-400 hover:text-white transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    disabled={deleting === article.id}
                    className="p-2 rounded-lg bg-surface-2 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Excluir"
                  >
                    {deleting === article.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instagram integration */}
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
