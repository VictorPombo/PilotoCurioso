import Link from 'next/link';
import type { Article, Category } from '@/types';
import { formatDateShort, truncate, estimateReadingTime } from '@/lib/slugify';
import { CategoryBadge } from '@/components/ui/CategoryBadge';

interface ArticleCardProps {
  article: Article & { category?: Category };
  variant?: 'default' | 'compact' | 'featured';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const readTime = article.reading_time || estimateReadingTime(article.body || '');

  if (variant === 'featured') {
    return (
      <Link
        href={`/f1/${article.slug}`}
        className="group relative flex flex-col lg:flex-row overflow-hidden rounded-2xl bg-surface-card border border-white/5 hover:border-brand-red/20 transition-all duration-300"
      >
        {article.cover_image && (
          <div className="relative lg:w-3/5 aspect-video lg:aspect-auto overflow-hidden">
            <img
              src={article.cover_image}
              alt={article.cover_image_alt || article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface-card/80 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent lg:hidden" />
          </div>
        )}
        <div className="flex flex-col justify-center gap-4 p-6 lg:p-10 lg:w-2/5">
          {article.category && (
            <CategoryBadge name={article.category.name} color={article.category.color} icon={article.category.icon} />
          )}
          <h2 className="font-accent text-2xl lg:text-3xl font-bold leading-tight text-white group-hover:text-brand-red transition-colors">
            {article.title}
          </h2>
          {article.brief && (
            <p className="text-zinc-400 leading-relaxed line-clamp-3">
              {truncate(article.brief, 200)}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-zinc-600">
            <span>Por <strong className="text-zinc-400">Enzo de Souza</strong></span>
            <span>·</span>
            <span>{readTime} min</span>
            {article.published_at && (
              <>
                <span>·</span>
                <span>{formatDateShort(article.published_at)}</span>
              </>
            )}
          </div>
          {article.is_sponsored && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              Conteúdo em parceria
            </span>
          )}
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/f1/${article.slug}`}
        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors"
      >
        {article.cover_image && (
          <img
            src={article.cover_image}
            alt={article.cover_image_alt || article.title}
            className="w-20 h-20 rounded-lg object-cover shrink-0"
            loading="lazy"
          />
        )}
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="font-accent font-semibold text-sm leading-tight text-zinc-200 group-hover:text-brand-red transition-colors line-clamp-2">
            {article.title}
          </h4>
          <span className="text-xs text-zinc-600">
            {readTime} min · {article.published_at ? formatDateShort(article.published_at) : ''}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/f1/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-surface-card border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5"
    >
      {article.cover_image && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.cover_image}
            alt={article.cover_image_alt || article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
        </div>
      )}
      <div className="flex flex-col gap-2 p-5 flex-1">
        {article.category && (
          <CategoryBadge name={article.category.name} color={article.category.color} icon={article.category.icon} size="sm" />
        )}
        <h3 className="font-accent text-lg font-bold leading-tight text-white group-hover:text-brand-red transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.brief && (
          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
            {truncate(article.brief, 120)}
          </p>
        )}
        <div className="mt-auto pt-3 flex items-center gap-3 text-xs text-zinc-600">
          <span>Enzo de Souza</span>
          <span>·</span>
          <span>{readTime} min</span>
          {article.published_at && (
            <>
              <span>·</span>
              <span>{formatDateShort(article.published_at)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
