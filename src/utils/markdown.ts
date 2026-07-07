/**
 * Converte markdown básico para HTML.
 * Usado para sanitizar output da IA que às vezes retorna markdown 
 * em vez de HTML esperado pelo TipTap.
 */
export function markdownToHtml(text: string): string {
  if (!text) return '';

  // Se já contém tags HTML significativas, provavelmente não é markdown
  if (/<(?:p|h[1-6]|ul|ol|li|strong|em|blockquote|div)\b/i.test(text)) {
    // Ainda pode ter markdown misturado — limpar apenas os padrões markdown
    return cleanMixedMarkdown(text);
  }

  let html = text;

  // Headings: ## Título → <h2>Título</h2>
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold: **texto** → <strong>texto</strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *texto* → <em>texto</em> (cuidado para não pegar os já processados)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Blockquote: > texto → <blockquote>texto</blockquote>
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered list: - item → <li>item</li>
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Links: [texto](url) → <a href="url">texto</a>
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Paragraphs: double newline → paragraph break
  html = html
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      // Don't wrap blocks that are already block-level elements
      if (/^<(?:h[1-6]|ul|ol|blockquote|div|p)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    })
    .filter(Boolean)
    .join('\n');

  // Clean up any remaining single newlines within paragraphs
  html = html.replace(/(?<!>)\n(?!<)/g, '<br>');

  return html;
}

/**
 * Limpa markdown residual em texto que já contém HTML.
 * Ex: `<p>O piloto **Hamilton** venceu</p>` → `<p>O piloto <strong>Hamilton</strong> venceu</p>`
 */
function cleanMixedMarkdown(html: string): string {
  // Bold dentro de tags HTML
  let cleaned = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic dentro de tags HTML
  cleaned = cleaned.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  return cleaned;
}

/**
 * Detecta se o texto é markdown (em vez de HTML).
 */
export function isMarkdown(text: string): boolean {
  if (!text) return false;
  
  // Padrões típicos de markdown
  const markdownPatterns = [
    /\*\*.+?\*\*/,        // **bold**
    /^#{1,3} .+/m,        // ## heading
    /^[-*] .+/m,          // - list item
    /^> .+/m,             // > blockquote
    /\[.+?\]\(.+?\)/,     // [link](url)
  ];

  const hasMarkdown = markdownPatterns.some((p) => p.test(text));
  const hasHtml = /<(?:p|h[1-6]|strong|em|ul|ol|li|div|blockquote)\b/i.test(text);

  // Se tem markdown e pouco/nenhum HTML, é markdown
  return hasMarkdown && !hasHtml;
}
