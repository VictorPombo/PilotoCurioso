'use client';

import { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, X, Check, AlertTriangle, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { compressImage, cleanImageUrl, getCoverImageUrl } from '@/utils/image';

const PRESET_BANNERS = [
  { label: 'Padrão Oficial', url: '/images/news-placeholder.png', icon: '🛡️' },
  { label: 'Aerodinâmica', url: '/images/aerodinamica.png', icon: '🏎️' },
  { label: 'Pneus F1', url: '/images/pneus-f1.png', icon: '🏁' },
  { label: 'Peso dos Pilotos', url: '/images/peso-pilotos.png', icon: '⚖️' },
  { label: 'Volante F1', url: '/images/volante-f1.png', icon: '🎮' },
  { label: 'Combustível', url: '/images/combustivel.png', icon: '⛽' },
  { label: 'Halo de Segurança', url: '/images/halo-f1.png', icon: '🏎️' },
];

interface CoverImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onStatusChange?: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export function CoverImageUploader({
  value,
  onChange,
  onStatusChange,
}: CoverImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setImageError(false);
      onStatusChange?.('Otimizando e enviando imagem...', 'warning');

      // 1. Otimiza no navegador (redimensiona para max 1920x1080 e comprime em JPEG/WebP)
      const compressed = await compressImage(file);

      // 2. Upload para o Supabase Storage
      const fileExt = compressed.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, compressed, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      onStatusChange?.('Upload concluído com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro no upload de imagem:', err);
      const isNetwork = err?.message?.includes('fetch') || err?.name === 'TypeError';
      const msg = isNetwork
        ? 'Erro ao conectar ao Supabase Storage. Verifique se o banco de dados está ativo ou cole a URL direta abaixo.'
        : `Erro no upload: ${err.message || 'Falha ao processar arquivo.'}`;
      onStatusChange?.(msg, 'error');
    } finally {
      setUploading(false);
    }
  }

  function handleUrlChange(rawUrl: string) {
    const cleaned = cleanImageUrl(rawUrl);
    setImageError(false);
    onChange(cleaned);
  }

  const activeImage = value?.trim() || '/images/news-placeholder.png';
  const displaySrc = getCoverImageUrl(activeImage);
  const isCustomImage = Boolean(value && value.trim() && value !== '/images/news-placeholder.png');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs text-zinc-500 uppercase tracking-widest font-medium">
          Imagem de Capa (Banner da Matéria)
        </label>
        {isCustomImage && (
          <button
            type="button"
            onClick={() => {
              onChange('/images/news-placeholder.png');
              setImageError(false);
            }}
            className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Restaurar banner padrão
          </button>
        )}
      </div>

      {/* Input de URL + Botão de Upload */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Cole a URL da imagem (Google Imagens, link direto, etc.)..."
            className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none focus:border-brand-red/50 pr-8"
          />
          {value && (
            <button
              type="button"
              onClick={() => handleUrlChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <label className={`cursor-pointer flex items-center justify-center gap-2 px-4 h-11 rounded-xl bg-surface-3 hover:bg-surface-4 border border-white/10 text-zinc-300 text-sm font-medium transition-colors shrink-0 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-brand-red" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 text-brand-red" />
              <span>Upload Arquivo</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Quick presets (Banners Temáticos Oficiais) */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        <span className="text-[11px] text-zinc-500 uppercase tracking-wider mr-1">
          Banners do Acervo:
        </span>
        {PRESET_BANNERS.map((preset) => {
          const isSelected = value === preset.url || (!value && preset.url === '/images/news-placeholder.png');
          return (
            <button
              key={preset.url}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setImageError(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-brand-red text-white shadow-sm shadow-brand-red/30'
                  : 'bg-surface-2 text-zinc-400 hover:text-white hover:bg-surface-3 border border-white/5'
              }`}
            >
              <span>{preset.icon}</span>
              <span>{preset.label}</span>
              {isSelected && <Check className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Visual Live Preview Box */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-surface-2 aspect-[16/9] max-h-[260px] flex items-center justify-center group shadow-inner">
        <img
          src={imageError ? '/images/news-placeholder.png' : displaySrc}
          alt="Preview da Imagem de Capa"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Badge superior com status da capa */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {imageError ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-black text-xs font-bold shadow-lg">
              <AlertTriangle className="w-3.5 h-3.5" />
              Link inacessível — exibindo banner padrão
            </span>
          ) : isCustomImage ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-lg">
              <Check className="w-3.5 h-3.5" />
              Capa personalizada pronta
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card/90 text-zinc-300 text-xs font-medium border border-white/10 shadow-lg">
              <ImageIcon className="w-3.5 h-3.5 text-brand-red" />
              Banner Oficial Ativo
            </span>
          )}
        </div>

        {/* Informações no rodapé do preview */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300 pointer-events-none">
          <span className="truncate max-w-[70%] font-mono opacity-80">
            {value ? value : 'Usando padrão: /images/news-placeholder.png'}
          </span>
          {isCustomImage && value.startsWith('http') && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto flex items-center gap-1 text-zinc-400 hover:text-white bg-black/60 px-2 py-0.5 rounded transition-colors"
            >
              <span>Abrir original</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
