'use client';

import { useEffect, useState } from 'react';
import { Camera, Heart, Play, ExternalLink } from 'lucide-react';

interface InstagramPost {
  id: string;
  media_url: string;
  thumbnail_url?: string;
  caption: string;
  permalink: string;
  timestamp: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/instagram');
        if (res.ok) {
          const data = await res.json();
          if (data.data && Array.isArray(data.data)) {
            setPosts(data.data);
          } else {
            setPosts([]);
          }
        }
      } catch (error) {
        console.error('Failed to load Instagram feed', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {posts
          .sort((a, b) => {
            if (a.media_type === 'VIDEO' && b.media_type !== 'VIDEO') return -1;
            if (b.media_type === 'VIDEO' && a.media_type !== 'VIDEO') return 1;
            return 0;
          })
          .slice(0, 4)
          .map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-surface-1 rounded-2xl overflow-hidden border border-white/5 hover:border-brand-red/50 transition-all aspect-square flex flex-col"
          >
            {/* Background Image/Thumbnail */}
            <div className="absolute inset-0 bg-surface-2">
              <img
                src={post.thumbnail_url || post.media_url}
                alt={post.caption?.substring(0, 50) || 'Instagram post'}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  // Fallback para gradient vermelho se imagem não carregar (ex: mock local)
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-brand-red/20', 'to-black');
                }}
              />
            </div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Video Icon if applicable */}
            {post.media_type === 'VIDEO' && (
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
            )}

            {/* Content Bottom */}
            <div className="relative z-10 mt-auto p-6 text-white">
              <p className="text-sm line-clamp-3 text-zinc-300 mb-4 group-hover:text-white transition-colors">
                {post.caption}
              </p>
              
              <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-brand-red" />
                  Visualizar no Instagram
                </span>
                <span>
                  {new Date(post.timestamp).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="flex justify-center">
        <a
          href="https://instagram.com/pilotocurioso"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold tracking-wide hover:shadow-lg hover:shadow-[#fd1d1d]/20 transition-all hover:-translate-y-0.5"
        >
          <Camera className="w-5 h-5" />
          Ver Instagram Completo
          <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
        </a>
      </div>
    </div>
  );
}
