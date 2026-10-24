export function cleanImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  let cleaned = url.trim();
  if (cleaned.includes('google.com/imgres') || cleaned.includes('imgurl=')) {
    try {
      const match = cleaned.match(/[?&]imgurl=([^&]+)/i);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    } catch {
      // fallback
    }
  }
  return cleaned;
}

/**
 * Retorna uma imagem contextual inteligente de fallback baseada no título da matéria,
 * ou o placeholder oficial do Piloto Curioso caso não haja correspondência.
 */
export function getSmartCoverImage(title?: string, coverImage?: string | null): string {
  if (coverImage && coverImage.trim()) {
    return getCoverImageUrl(coverImage);
  }
  if (title) {
    const t = title.toLowerCase();
    if (t.includes('slipstream') || t.includes('aerodinâmica') || t.includes('teto')) {
      return '/images/aerodinamica.png';
    }
    if (t.includes('pneu') || t.includes('degrad') || t.includes('pirelli')) {
      return '/images/pneus-f1.png';
    }
    if (t.includes('peso') || t.includes('balança') || t.includes('pesad')) {
      return '/images/peso-pilotos.png';
    }
    if (t.includes('volante') || t.includes('botões')) {
      return '/images/volante-f1.png';
    }
    if (t.includes('halo') || t.includes('segurança')) {
      return '/images/halo-f1.png';
    }
    if (t.includes('combustível') || t.includes('gasolina') || t.includes('tanque')) {
      return '/images/combustivel.png';
    }
    if (t.includes('enzo')) {
      return '/images/enzo.png';
    }
  }
  return '/images/news-placeholder.png';
}

/**
 * Retorna a URL correta para exibir a imagem de capa de um artigo.
 * 
 * - Se a imagem já é local (ex: /images/...) → retorna direta.
 * - Se é do Google Images → extrai a imagem real automaticamente.
 * - Se é do Supabase Storage → retorna direta.
 * - Se é uma URL externa → passa pelo proxy à prova de falhas.
 * - Se não existe → retorna o placeholder padrão do portal.
 */
export function getCoverImageUrl(coverImage: string | null | undefined): string {
  if (!coverImage || !coverImage.trim()) return '/images/news-placeholder.png';

  const cleaned = cleanImageUrl(coverImage);
  if (!cleaned) return '/images/news-placeholder.png';

  // Imagem local: retorna direto
  if (cleaned.startsWith('/')) return cleaned;

  // URL do Supabase Storage: retorna direto (não sofre hot-linking)
  if (cleaned.includes('supabase.co') || cleaned.includes('supabase.in')) {
    return cleaned;
  }

  // URL externa: passar pelo proxy
  return `/api/image-proxy?url=${encodeURIComponent(cleaned)}`;
}


/**
 * Comprime e redimensiona uma imagem no navegador antes do upload.
 * Converte imagens grandes (ex: fotos de 10MB+) em WebP/JPEG otimizado (~200KB-500KB),
 * evitando erros de limite de arquivo no Supabase Storage e acelerando o site.
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.85
): Promise<File> {
  // Preserva GIFs animados e SVGs
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      // Mantém a proporção redimensionando se exceder maxWidth/maxHeight
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Usar jpeg para fotos (comprime drasticamente mantendo qualidade visual)
      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // Se por algum motivo o blob não foi gerado ou ficou maior, usa o original
            resolve(file);
            return;
          }
          const ext = outputType === 'image/png' ? '.png' : '.jpg';
          const newName = file.name.replace(/\.[^/.]+$/, '') + ext;
          const compressedFile = new File([blob], newName, {
            type: outputType,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

