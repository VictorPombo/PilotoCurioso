import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

export const revalidate = 600; // 10 min cache (notícias mais frescas)

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  image_url: string;
  category: string;
  tipo: 'br';
  published_at: string;
  abstract: string;
}

const parser = new Parser({
  timeout: 8000,
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'dcCreator'],
    ],
  },
});

// ═══════════════════════════════════════════
//  FEEDS BRASILEIROS — MÚLTIPLAS FONTES
// ═══════════════════════════════════════════
const FEEDS_BRASIL = [
  // ── Motorsport BR (UOL) — feeds ESPECÍFICOS por categoria ──
  { url: "https://motorsport.uol.com.br/rss/f1/news/",           name: "Motorsport Brasil", cat: "F1" },
  { url: "https://motorsport.uol.com.br/rss/motogp/news/",       name: "Motorsport Brasil", cat: "MotoGP" },
  { url: "https://motorsport.uol.com.br/rss/stockcar-br/news/",  name: "Motorsport Brasil", cat: "Stock Car" },
  { url: "https://motorsport.uol.com.br/rss/wec/news/",          name: "Motorsport Brasil", cat: "WEC" },
  { url: "https://motorsport.uol.com.br/rss/indycar/news/",      name: "Motorsport Brasil", cat: "IndyCar" },
  { url: "https://motorsport.uol.com.br/rss/nascar-cup/news/",   name: "Motorsport Brasil", cat: "NASCAR" },
  { url: "https://motorsport.uol.com.br/rss/wrc/news/",          name: "Motorsport Brasil", cat: "WRC" },
  { url: "https://motorsport.uol.com.br/rss/formula-e/news/",    name: "Motorsport Brasil", cat: "F1" },

  // ── Motorsport BR (domínio antigo / fallback) ──
  { url: "https://br.motorsport.com/rss/f1/news/",           name: "Motorsport BR", cat: "F1" },
  { url: "https://br.motorsport.com/rss/motogp/news/",       name: "Motorsport BR", cat: "MotoGP" },
  { url: "https://br.motorsport.com/rss/stockcar-br/news/",  name: "Motorsport BR", cat: "Stock Car" },
  { url: "https://br.motorsport.com/rss/wec/news/",          name: "Motorsport BR", cat: "WEC" },
  { url: "https://br.motorsport.com/rss/indycar/news/",      name: "Motorsport BR", cat: "IndyCar" },
  { url: "https://br.motorsport.com/rss/nascar-cup/news/",   name: "Motorsport BR", cat: "NASCAR" },
  { url: "https://br.motorsport.com/rss/wrc/news/",          name: "Motorsport BR", cat: "WRC" },

  // ── Grande Prêmio (multi-categoria: F1, MotoGP, Stock Car, etc.) ──
  // Usa "Geral" para que inferCategory classifique corretamente cada artigo
  { url: "https://grandepremio.com.br/feed",                  name: "Grande Prêmio", cat: "Geral" },

  // ── F1Mania (multi-categoria: F1, Porsche Cup, Copa Truck, etc.) ──
  // Usa "Geral" para classificação automática por título/URL
  { url: "https://f1mania.net/feed/",                         name: "F1Mania",       cat: "Geral" },

  // ── Band Esporte / Automobilismo ──
  { url: "https://band.uol.com.br/rss/automobilismo.xml",    name: "Band Esporte",  cat: "Geral" },
];

// ═══════════════════════════════════════════
//  EXTRAÇÃO DE IMAGEM (ROBUSTA)
// ═══════════════════════════════════════════
function extractImage(item: any): string {
  // 1. enclosure (padrão RSS)
  if (item.enclosure?.url) return item.enclosure.url;

  // 2. media:content
  if (item['media:content']) {
    const mc = item['media:content'];
    if (typeof mc === 'string') return mc;
    if (mc['$']?.url) return mc['$'].url;
    if (mc.url) return mc.url;
  }

  // 3. media:thumbnail
  if (item['media:thumbnail']) {
    const mt = item['media:thumbnail'];
    if (typeof mt === 'string') return mt;
    if (mt['$']?.url) return mt['$'].url;
  }

  // 4. Thumbnail direto
  if (item.thumbnail) return item.thumbnail;

  // 5. Regex em content/contentEncoded
  const contentStr = item.contentEncoded || item.content || item['content:encoded'] || '';
  if (contentStr) {
    const imgMatch = contentStr.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) return imgMatch[1];
  }

  // 6. Fallback premium escuro
  return 'https://images.unsplash.com/photo-1541344983572-c511a5fe03fd?q=80&w=1200&auto=format&fit=crop';
}

// ═══════════════════════════════════════════
//  EXTRAÇÃO DE RESUMO
// ═══════════════════════════════════════════
function extractAbstract(item: any): string {
  if (item.contentSnippet) {
    return item.contentSnippet.replace(/\s+/g, ' ').trim().substring(0, 180);
  }
  const raw = item.content || item.contentEncoded || '';
  if (raw) {
    return raw.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().substring(0, 180);
  }
  return '';
}

// ═══════════════════════════════════════════
//  CATEGORIZAÇÃO AUTOMÁTICA
// ═══════════════════════════════════════════
function inferCategory(item: any, feedCat: string): string {
  // Se a categoria do feed já é específica, usar ela
  if (feedCat !== 'Geral') return feedCat;

  // Inferir da URL, título, categorias RSS e conteúdo
  const text = (
    (item.title || '') + ' ' + 
    (item.link || '') + ' ' + 
    (item.categories?.join(' ') || '') + ' ' +
    (item.contentSnippet || '').substring(0, 200)
  ).toLowerCase();

  // ── MotoGP (antes de F1 porque "moto" pode dar match falso) ──
  if (text.includes('motogp') || text.includes('moto gp') || text.includes('moto2') || text.includes('moto3') || text.includes('motoe') || text.includes('superbike') || text.includes('sbk') || (text.includes('ducati') && text.includes('moto'))) return 'MotoGP';
  
  // ── Stock Car / Corridas BR ──
  if (text.includes('stock car') || text.includes('stockcar') || text.includes('copa truck') || text.includes('porsche cup') || text.includes('porsche supercup') || text.includes('fórmula 4 brasil') || text.includes('f4 brasil') || text.includes('copa hyundai') || text.includes('corridas de turismo')) return 'Stock Car';

  // ── WEC / Endurance ──
  if (text.includes('wec') || text.includes('le mans') || text.includes('endurance') || text.includes('hypercar') || text.includes('lmgt') || text.includes('24 horas') || text.includes('imsa') || (text.includes('daytona') && !text.includes('nascar')) || text.includes('sebring') || text.includes('lmdh')) return 'WEC';

  // ── NASCAR ──
  if (text.includes('nascar') || text.includes('cup series') || text.includes('xfinity') || text.includes('craftsman truck')) return 'NASCAR';

  // ── IndyCar ──
  if (text.includes('indycar') || text.includes('indy 500') || text.includes('indianapolis') || (text.includes('caio collet') && text.includes('indy')) || text.includes('fórmula indy')) return 'IndyCar';

  // ── WRC / Rally ──
  if (text.includes('wrc') || text.includes('rally') || text.includes('rali') || text.includes('dakar') || text.includes('ogier') || text.includes('t\u00e4nak') || text.includes('neuville') || text.includes('rallycross')) return 'WRC';

  // ── F1 (default para automobilismo geral) ──
  if (text.includes('f1') || text.includes('fórmula 1') || text.includes('formula 1') || text.includes('formula one') || text.includes('verstappen') || text.includes('hamilton') || text.includes('ferrari') || text.includes('mercedes') || text.includes('mclaren') || text.includes('red bull') || text.includes('leclerc') || text.includes('norris') || text.includes('piastri') || text.includes('russell') || text.includes('antonelli') || text.includes('senna') || text.includes('schumacher') || text.includes('fia') || text.includes('grid') || text.includes('gp ') || text.includes('grande prêmio') || text.includes('grande premio')) return 'F1';
  
  return 'F1'; // Default
}

// ═══════════════════════════════════════════
//  FETCH E PROCESSA FEEDS
// ═══════════════════════════════════════════
async function fetchAndProcessFeeds(): Promise<NewsItem[]> {
  const promises = FEEDS_BRASIL.map(async feedConf => {
    try {
      const feed = await parser.parseURL(feedConf.url);
      return feed.items.map(item => ({
        id: item.guid || item.link || Math.random().toString(36),
        title: (item.title || '').trim(),
        source: feedConf.name,
        url: item.link || '',
        image_url: extractImage(item),
        category: inferCategory(item, feedConf.cat),
        tipo: 'br' as const,
        published_at: item.pubDate || item.isoDate || new Date().toISOString(),
        abstract: extractAbstract(item),
      }));
    } catch (err) {
      console.warn(`[News] Failed: ${feedConf.name} (${feedConf.url})`, (err as Error).message);
      return [];
    }
  });

  const results = await Promise.all(promises);
  let allNews: NewsItem[] = results.flat();

  // ── Deduplicação Profissional ──
  const seenTitles = new Set<string>();
  const seenUrls = new Set<string>();

  allNews = allNews.filter(n => {
    if (!n.title || n.title.length < 10) return false;

    // Dedup por URL (ignora query params)
    const cleanUrl = n.url.split('?')[0].toLowerCase();
    if (seenUrls.has(cleanUrl)) return false;
    seenUrls.add(cleanUrl);

    // Dedup por título normalizado (primeiros 40 chars)
    const shortTitle = n.title.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúüç\s]/g, '').trim().substring(0, 40);
    if (seenTitles.has(shortTitle)) return false;
    seenTitles.add(shortTitle);

    return true;
  });

  // ── Ordenação por data decrescente ──
  allNews.sort((a, b) => {
    const da = new Date(a.published_at).getTime() || 0;
    const db = new Date(b.published_at).getTime() || 0;
    return db - da;
  });

  // Limite para performance (40 notícias — nunca acumula além disso)
  return allNews.slice(0, 200);
}

// ═══════════════════════════════════════════
//  GET HANDLER
// ═══════════════════════════════════════════
export async function GET() {
  try {
    const brNews = await fetchAndProcessFeeds();

    // Contagens por categoria
    const catCounts: Record<string, number> = {};
    brNews.forEach(n => {
      catCounts[n.category] = (catCounts[n.category] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      total: brNews.length,
      sources: [...new Set(brNews.map(n => n.source))],
      categories: catCounts,
      data: {
        br: brNews
      }
    });

  } catch (error) {
    console.error("[API News] Pipeline Error:", error);
    return NextResponse.json({ error: "Failed to fetch feeds" }, { status: 500 });
  }
}
