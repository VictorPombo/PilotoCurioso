/**
 * Retorna a URL correta para exibir a imagem de capa de um artigo.
 * 
 * - Se a imagem já é local (ex: /images/...) → retorna direta.
 * - Se é uma URL externa → passa pelo proxy para evitar bloqueios de hot-linking.
 * - Se não existe → retorna o placeholder padrão.
 */
export function getCoverImageUrl(coverImage: string | null | undefined): string {
  if (!coverImage) return '/images/news-placeholder.png';

  // Imagem local: retorna direto
  if (coverImage.startsWith('/')) return coverImage;

  // URL do Supabase Storage: retorna direto (não sofre hot-linking)
  if (coverImage.includes('supabase.co') || coverImage.includes('supabase.in')) {
    return coverImage;
  }

  // URL externa: passar pelo proxy
  return `/api/image-proxy?url=${encodeURIComponent(coverImage)}`;
}
