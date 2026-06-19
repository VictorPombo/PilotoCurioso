'use client';

import { MessageCircle, Share2, MessageSquare } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
      color: '#25D366',
      bgHover: 'hover:bg-[#25D366]/10',
    },
    {
      label: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: MessageSquare,
      color: '#FFFFFF',
      bgHover: 'hover:bg-white/5',
    },
  ];

  async function handleNativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url });
    }
  }

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium transition-all ${link.bgHover}`}
          style={{ color: link.color }}
        >
          <link.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{link.label}</span>
        </a>
      ))}

      {typeof navigator !== 'undefined' && navigator.share && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-zinc-400 hover:bg-white/5 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Compartilhar</span>
        </button>
      )}
    </div>
  );
}
