'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lightbulb, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCoverImageUrl } from '@/utils/image';

const ITEMS_PER_PAGE = 6;

interface LatestArticlesProps {
  initialArticles: any[];
  initialTotalPages: number;
}

export function LatestArticles({ initialArticles, initialTotalPages }: LatestArticlesProps) {
  const [articles, setArticles] = useState<any[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    async function fetchArticles() {
      setLoading(true);
      
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await supabase
        .from('articles')
        .select('*, category:categories(*)', { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        setArticles(data);
        if (count !== null) {
          setTotalPages(Math.max(1, Math.ceil(count / ITEMS_PER_PAGE)));
        }
      }
      
      setLoading(false);
    }

    fetchArticles();
  }, [page]);

  return (
    <div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {articles.map((item, i) => (
          <Link
            key={item.id}
            href={`/noticias/${item.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-card border border-white/5 hover:border-brand-red/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-red/5 hover:-translate-y-1"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="relative aspect-[16/10] bg-gradient-to-br from-surface-3 to-surface-2 overflow-hidden">
              <img
                src={getCoverImageUrl(item.cover_image)}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.src = '/images/news-placeholder.png';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-red/90 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                <Lightbulb className="w-3 h-3" /> {item.category?.name || 'Matéria'}
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
                <span>{item.reading_time || 2} min de leitura</span>
                <ChevronRight className="w-4 h-4 text-brand-red opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-2 border border-white/10 hover:border-brand-red hover:bg-brand-red/10 text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-brand-red" />
            ) : (
              <span className="text-sm font-bold tracking-widest text-zinc-400">
                <span className="text-white">{page}</span> / {totalPages}
              </span>
            )}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-2 border border-white/10 hover:border-brand-red hover:bg-brand-red/10 text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Próxima página"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
