import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatDate, estimateReadingTime } from '@/lib/slugify';
import { ShareButtons } from '@/components/article/ShareButtons';
import { SponsoredBadge } from '@/components/article/SponsoredBadge';
import { EnzoSignature } from '@/components/article/EnzoSignature';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import type { Article, Category } from '@/types';

interface PageProps {
  params: { slug: string };
}

async function getArticle(slug: string): Promise<(Article & { category?: Category }) | null> {
  try {
    const { data } = await supabase
      .from('articles')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Matéria não encontrada' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://piloto-curioso.vercel.app';
  const url = `${siteUrl}/f1/${article.slug}`;

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.brief || '',
    openGraph: {
      type: 'article',
      title: article.seo_title || article.title,
      description: article.seo_description || article.brief || '',
      url,
      siteName: 'Piloto Curioso',
      images: article.og_image || article.cover_image
        ? [{ url: article.og_image || article.cover_image! }]
        : [],
      publishedTime: article.published_at || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo_title || article.title,
      description: article.seo_description || article.brief || '',
      images: article.og_image || article.cover_image
        ? [article.og_image || article.cover_image!]
        : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://piloto-curioso.vercel.app';
  const url = `${siteUrl}/f1/${article.slug}`;
  const readTime = article.reading_time || estimateReadingTime(article.body || '');

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.brief,
    image: article.cover_image ? [article.cover_image] : [],
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: 'Enzo de Souza',
      url: `${siteUrl}/sobre`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Piloto Curioso',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo-limpo.png`,
      },
    },
    url,
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <article className="max-w-[760px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              {article.category && (
                <CategoryBadge
                  name={article.category.name}
                  color={article.category.color}
                  icon={article.category.icon}
                />
              )}
              {article.is_sponsored && <SponsoredBadge />}
            </div>

            <h1 className="font-accent text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-[1.15] text-white mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 font-mono">
              <span>
                Por <strong className="text-zinc-300">Enzo de Souza</strong>
              </span>
              <span className="text-zinc-700">·</span>
              {article.published_at && (
                <time dateTime={article.published_at}>
                  {formatDate(article.published_at)}
                </time>
              )}
              <span className="text-zinc-700">·</span>
              <span>{readTime} min de leitura</span>
              <span className="text-zinc-700">·</span>
              <span>{article.views} views</span>
            </div>
          </header>

          {/* Cover image */}
          {article.cover_image && (
            <figure className="relative rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-black/50">
              <img
                src={article.cover_image}
                alt={article.cover_image_alt || article.title}
                className="w-full aspect-video object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-1/50 to-transparent pointer-events-none" />
            </figure>
          )}

          {/* Body */}
          <div
            className="article-body text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.body || '' }}
          />

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-sm text-zinc-500 mb-4 font-medium">Compartilhar:</p>
            <ShareButtons title={article.title} url={url} />
          </div>

          {/* Enzo signature */}
          <EnzoSignature />
        </article>
      </main>
    </>
  );
}
