import * as cheerio from "cheerio";

export interface OgMetadata {
  title: string | null;
  image: string | null;
  description: string | null;
  url: string;
  published_time: string | null;
}

export async function extrairOG(url: string): Promise<OgMetadata | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Driver News-News-Bot/1.0 (+https://drivernews.com.br/bot)",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429 || response.status === 403) {
        console.warn(`Acesso negado (${response.status}) ao domínio: ${url}`);
      }
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Estratégia Open Graph pura
    let title = $('meta[property="og:title"]').attr("content") || $("title").text() || null;
    let image = $('meta[property="og:image"]').attr("content") || null;
    let description = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || null;
    let ogUrl = $('meta[property="og:url"]').attr("content") || url;
    let published_time = $('meta[property="article:published_time"]').attr("content") || null;

    if (description && description.length > 200) {
      description = description.substring(0, 197) + "...";
    }

    // Validação mínima de imagem
    if (image && !image.startsWith("http")) {
      // Se a imagem for caminho relativo (ex: /img/logo.png)
      try {
        const urlObj = new URL(url);
        image = `${urlObj.protocol}//${urlObj.host}${image.startsWith('/') ? '' : '/'}${image}`;
      } catch (e) {
        image = null;
      }
    }

    if (!image) {
      return null; // Imagem é obrigatória para o layout
    }

    return {
      title,
      image,
      description,
      url: ogUrl,
      published_time
    };

  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn(`Timeout de 10s extraindo OG de: ${url}`);
    } else {
      console.error(`Erro ao extrair metadados OG de ${url}:`, error.message);
    }
    return null;
  }
}
