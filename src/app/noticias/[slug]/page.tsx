import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Eye, ArrowLeft, Tag, Sparkles } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

interface Article {
  id: string;
  title: string;
  slug: string;
  brief: string | null;
  body: string | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  status: string;
  type: string;
  views: number;
  likes: number;
  reading_time: number;
  ia_generated: boolean;
  is_sponsored: boolean;
  sponsor_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
  category: { id: string; name: string; slug: string } | null;
}

async function getArticle(slug: string): Promise<Article | null> {
  const sb = getClient();
  const { data } = await sb
    .from('articles')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (data) {
    // Incrementar views
    await sb.from('articles').update({ views: (data.views || 0) + 1 }).eq('id', data.id);
  }

  return data;
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  reading_time: number;
}

async function getRelatedArticles(categoryId: string | undefined, currentId: string): Promise<RelatedArticle[]> {
  if (!categoryId) return [];
  const sb = getClient();
  const { data } = await sb
    .from('articles')
    .select('id, title, slug, cover_image, reading_time')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(3);

  return (data as RelatedArticle[]) || [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: 'Matéria não encontrada | Piloto Curioso' };
  }

  return {
    title: article.seo_title || `${article.title} | Piloto Curioso`,
    description: article.seo_description || article.brief || '',
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.brief || '',
      type: 'article',
      publishedTime: article.published_at || undefined,
      ...(article.cover_image && { images: [article.cover_image] }),
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelatedArticles(article.category?.id, article.id);

  return (
    <main className="min-h-screen bg-surface-0 pt-[100px] pb-20">
      {/* Hero / Cover */}
      {article.cover_image && (
        <div className="relative w-full max-w-[1400px] mx-auto aspect-[21/9] md:aspect-[21/7] rounded-2xl overflow-hidden mb-10 mx-4 lg:mx-auto">
          <img
            src={article.cover_image}
            alt={article.cover_image_alt || article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>
      )}

      <div className="max-w-[800px] w-full mx-auto px-4 lg:px-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Início
          </Link>
          <span>/</span>
          <Link href="/noticias" className="hover:text-white transition-colors">
            Notícias
          </Link>
          {article.category && (
            <>
              <span>/</span>
              <span className="text-zinc-400">{article.category.name}</span>
            </>
          )}
        </div>

        {/* Sponsored badge */}
        {article.is_sponsored && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
            Matéria Patrocinada {article.sponsor_name && `— ${article.sponsor_name}`}
          </div>
        )}

        {/* Category */}
        {article.category && (
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded bg-brand-red text-white mb-4">
            {article.category.name}
          </span>
        )}

        {/* Title */}
        <h1 className="font-display text-4xl md:text-6xl text-white uppercase tracking-wide leading-tight mb-6">
          {article.title}
        </h1>

        {/* Brief */}
        {article.brief && (
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-8 border-l-2 border-brand-red pl-4">
            {article.brief}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-10 pb-8 border-b border-white/10">
          {article.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(article.published_at)}
            </span>
          )}
          {article.reading_time > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.reading_time} min de leitura
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {article.views || 0} visualizações
          </span>
          {article.ia_generated && (
            <span className="flex items-center gap-1.5 text-purple-400">
              <Sparkles className="w-4 h-4" />
              Gerada com IA
            </span>
          )}
        </div>

        {/* Article body */}
        {article.body && (
          <div
            className="article-body text-base md:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
              <Tag className="w-4 h-4" />
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 text-sm hover:bg-white/10 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10">
            <h2 className="font-display text-3xl text-white uppercase tracking-wide mb-8">
              Leia <span className="text-brand-red">Também</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/noticias/${r.slug}`}
                  className="group flex flex-col bg-surface-1 border border-white/5 rounded-xl overflow-hidden hover:border-white/15 transition-all"
                >
                  {r.cover_image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={r.cover_image}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4 flex-1">
                    <h3 className="font-accent text-lg font-bold text-white leading-snug group-hover:text-brand-red transition-colors">
                      {r.title}
                    </h3>
                    {r.reading_time > 0 && (
                      <span className="text-xs text-zinc-500 mt-2 block">{r.reading_time} min de leitura</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
