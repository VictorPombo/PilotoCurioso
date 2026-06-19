import Parser from "rss-parser";

const parser = new Parser({
  headers: {
    "User-Agent": "Driver News-News-Bot/1.0 (+https://drivernews.com.br/bot)",
    "Accept": "application/rss+xml, application/xml, text/xml",
  },
});

export async function buscarRSS(url: string, limit: number = 50): Promise<string[]> {
  try {
    const feed = await parser.parseURL(url);
    const novasUrls: string[] = [];

    for (const item of feed.items) {
      if (item.link) {
        // Normaliza a URL retirando aspas duplas, escapes ou trailing spaces
        const canonic = item.link.trim();
        novasUrls.push(canonic);
      }
      if (novasUrls.length >= limit) {
        break;
      }
    }
    
    return novasUrls;
  } catch (err) {
    console.error(`Erro ao buscar RSS de ${url}:`, err);
    return [];
  }
}
