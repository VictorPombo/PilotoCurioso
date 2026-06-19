import Link from 'next/link';
import { Lightbulb } from 'lucide-react';
import type { Article } from '@/types';
import { formatDateShort, truncate, estimateReadingTime } from '@/lib/slugify';

interface CuriosityCardProps {
  article: Article;
}

export function CuriosityCard({ article }: CuriosityCardProps) {
  const readTime = article.reading_time || estimateReadingTime(article.body || '');

  return (
    <Link
      href={`/f1/${article.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-card border border-white/5 hover:border-brand-red/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-red/5 hover:-translate-y-1"
    >
      {/* Image */}
      {article.cover_image && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={article.cover_image}
            alt={article.cover_image_alt || article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-red/90 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    <Lightbulb className="w-3 h-3" /> Você Sabia?
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <h3 className="font-accent text-lg font-bold leading-tight text-white group-hover:text-brand-red transition-colors line-clamp-3">
          {article.title}
        </h3>
        {article.brief && (
          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
            {truncate(article.brief, 120)}
          </p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-zinc-600">
          <span>{readTime} min de leitura</span>
          {article.published_at && <span>{formatDateShort(article.published_at)}</span>}
        </div>
      </div>
    </Link>
  );
}
