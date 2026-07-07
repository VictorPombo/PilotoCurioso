import { Node, mergeAttributes } from '@tiptap/core';

export interface VideoOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string; vertical?: boolean }) => ReturnType;
    };
  }
}

/**
 * Extensão TipTap para inserir vídeos no corpo da matéria.
 * Suporta vídeos verticais (9:16, padrão) e horizontais (16:9).
 * Detecta automaticamente embeds de Instagram/YouTube vs vídeos diretos.
 */
export const Video = Node.create<VideoOptions>({
  name: 'video',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      vertical: {
        default: true,
        parseHTML: (element) => {
          return element.getAttribute('data-vertical') !== 'false';
        },
        renderHTML: (attributes) => {
          return { 'data-vertical': attributes.vertical ? 'true' : 'false' };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const isVertical = HTMLAttributes['data-vertical'] !== 'false';

    const style = isVertical
      ? 'max-width: 350px; aspect-ratio: 9/16; border-radius: 16px; margin: 1.5rem auto; display: block;'
      : 'max-width: 100%; border-radius: 12px; margin: 1rem 0;';

    return [
      'video',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        controls: true,
        playsinline: true,
        preload: 'metadata',
        style,
      }),
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              vertical: options.vertical ?? true,
            },
          });
        },
    };
  },
});
