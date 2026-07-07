'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, Save, Send, Calendar, CheckCircle, XCircle, AlertTriangle, Upload, Link2, ExternalLink, Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';

interface SSEData {
  step?: number;
  total?: number;
  percent?: number;
  label?: string;
  result?: {
    title?: string;
    brief?: string;
    body?: string;
    seo_title?: string;
    seo_description?: string;
    tags?: string[];
  };
  meta?: {
    tokensUsed?: number;
    pipeline?: string[];
  };
  error?: string;
}

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('');
  const [brief, setBrief] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<'curiosidade' | 'noticia'>('curiosidade');
  const [coverImage, setCoverImage] = useState('');
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsorName, setSponsorName] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [tags, setTags] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  // CTA states
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [ctaVideoUrl, setCtaVideoUrl] = useState('');

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [aiTopics, setAiTopics] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiLabel, setAiLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'warning' | 'error'>('success');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data);
    }
    
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`, { credentials: 'include' });
        if (!res.ok) throw new Error(`Erro ${res.status} ao carregar matéria`);
        const data = await res.json();

        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setCategoryId(data.category_id || '');
          setBrief(data.brief || '');
          setBody(data.body || '');
          setCoverImage(data.cover_image || '');
          setStatus(data.status || 'draft');
          setSeoTitle(data.seo_title || '');
          setSeoDescription(data.seo_description || '');
          setTags(data.tags?.join(', ') || '');
          setCtaEnabled(data.cta_enabled || false);
          setCtaLabel(data.cta_label || '');
          setCtaUrl(data.cta_url || '');
          setCtaVideoUrl(data.cta_video_url || '');
        }
      } catch (error) {
        console.error('Error loading article:', error);
        setMessage('Erro ao carregar matéria.');
        setMessageType('error');
      }
    }

    loadCategories();
    loadArticle();
  }, [id]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setMessage('Fazendo upload da imagem...');
      setMessageType('warning');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setCoverImage(publicUrl);
      setMessage('Upload concluído!');
      setMessageType('success');
    } catch (error: any) {
      console.error('Erro no upload:', error.message);
      setMessage('Erro ao fazer upload da imagem.');
      setMessageType('error');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleAIGenerate() {
    if (!aiTopics.trim()) return;
    setAiLoading(true);
    setAiProgress(0);
    setAiLabel('Iniciando pipeline...');
    setMessage('');

    try {
      const res = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: aiTopics, category: categoryId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setMessage(errData.error || `Erro ${res.status} ao gerar.`);
        setMessageType('error');
        setAiLoading(false);
        setAiProgress(0);
        setAiLabel('');
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Stream não disponível');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data: SSEData = JSON.parse(line.slice(6));

            if (data.percent !== undefined) setAiProgress(data.percent);
            if (data.label) setAiLabel(data.label);

            if (data.error) {
              setMessage(data.error);
              setMessageType('error');
              setAiLoading(false);
              setAiProgress(0);
              setAiLabel('');
              return;
            }

            if (data.result) {
              const r = data.result;
              if (r.title) setTitle(r.title);
              if (r.brief) setBrief(r.brief);
              if (r.body) setBody(r.body);
              if (r.seo_title) setSeoTitle(r.seo_title);
              if (r.seo_description) setSeoDescription(r.seo_description);
              if (r.tags && Array.isArray(r.tags)) setTags(r.tags.join(', '));

              const tokens = data.meta?.tokensUsed || 0;
              setMessage(`✅ Matéria gerada com pipeline de 3 agentes! (${tokens.toLocaleString()} tokens)`);
              setMessageType('success');
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    } catch {
      setMessage('Erro de conexão.');
      setMessageType('error');
    } finally {
      setAiLoading(false);
      setAiProgress(0);
      setAiLabel('');
    }
  }

  async function handleSave(statusInput: 'draft' | 'published' | 'scheduled') {
    if (!title.trim()) {
      setMessage('Título é obrigatório.');
      setMessageType('warning');
      return;
    }
    setSaving(true);
    setMessage('');

    try {
      const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          category_id: categoryId || null,
          brief: brief.trim(),
          body: body.trim(),
          cover_image: coverImage.trim() || null,
          status: statusInput,
          seo_title: seoTitle.trim() || null,
          seo_description: seoDescription.trim() || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          ia_generated: aiTopics.length > 0,
          cta_enabled: ctaEnabled,
          cta_label: ctaLabel.trim() || null,
          cta_url: ctaUrl.trim() || null,
          cta_video_url: ctaVideoUrl.trim() || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Erro ${res.status} ao salvar.`);
      }

      setMessage(statusInput === 'published' ? 'Matéria publicada!' : 'Rascunho salvo!');
      setMessageType('success');
      
      setTimeout(() => {
        router.push('/admin/editor');
      }, 1500);
    } catch (e: any) {
      setMessage(e.message || 'Erro ao salvar.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  }

  const handleApplyRefine = useCallback((data: {
    title: string;
    brief: string;
    body: string;
    seo_title: string;
    seo_description: string;
    tags: string[];
  }) => {
    if (data.title) setTitle(data.title);
    if (data.brief) setBrief(data.brief);
    if (data.body) setBody(data.body);
    if (data.seo_title) setSeoTitle(data.seo_title);
    if (data.seo_description) setSeoDescription(data.seo_description);
    if (data.tags?.length) setTags(data.tags.join(', '));
    setMessage('Refinamento aplicado!');
    setMessageType('success');
  }, []);

  const handleInsertInfographic = useCallback((url: string) => {
    setBody(prev => prev + `<img src="${url}" alt="Infográfico" style="max-width:100%;border-radius:12px;margin:1.5rem 0" />`);
    setMessage('Infográfico inserido no corpo!');
    setMessageType('success');
  }, []);

  return (
    <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Editar Matéria</h1>
          <p className="text-sm text-zinc-400">Atualize os dados e publique as mudanças</p>
        </div>

      {/* AI Assistant */}
      <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-4">
        <div className="flex items-center gap-2 text-purple-400 font-accent font-bold">
          <Sparkles className="w-5 h-5" />
          Assistente IA — Pipeline Multi-Agente
        </div>
        <p className="text-sm text-zinc-400">
          Cole os tópicos crus. A IA processa em 3 etapas: <strong className="text-purple-300">Redator</strong> →{' '}
          <strong className="text-purple-300">Editor</strong> → <strong className="text-purple-300">SEO Specialist</strong>
        </p>
        <textarea
          value={aiTopics}
          onChange={(e) => setAiTopics(e.target.value)}
          placeholder="Ex: Hamilton renovou com a Ferrari por mais 2 anos. Salário estimado de $50M. Já são 7 títulos mundiais..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-purple-500/50 resize-none"
        />

        {/* Progress bar */}
        {aiLoading && (
          <div className="space-y-2">
            <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                style={{ width: `${aiProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300 font-medium">{aiLabel}</span>
              <span className="text-purple-400 font-mono font-bold">{aiProgress}%</span>
            </div>
          </div>
        )}

        <button
          onClick={handleAIGenerate}
          disabled={aiLoading || !aiTopics.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          {aiLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{aiProgress}% — {aiLabel || 'Processando...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Gerar com IA (3 agentes)
            </>
          )}
        </button>
      </div>

      {/* Article Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da matéria"
            className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-lg font-accent font-bold placeholder-zinc-600 outline-none focus:border-brand-red/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
              Editoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm outline-none focus:border-brand-red/50"
            >
              <option value="">Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
              Tipo de Post
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'curiosidade' | 'noticia')}
              className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm outline-none focus:border-brand-red/50"
            >
              <option value="curiosidade">Curiosidade</option>
              <option value="noticia">Notícia</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
              Imagem de capa (URL ou Upload)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none focus:border-brand-red/50"
              />
              <label className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-xl bg-surface-3 hover:bg-surface-4 border border-white/10 transition-colors">
                {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-zinc-400" /> : <Upload className="w-4 h-4 text-zinc-400" />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
            Resumo / Meta Description
          </label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Resumo da matéria (será usado como meta description)"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none focus:border-brand-red/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
            Corpo da matéria
          </label>
          <RichTextEditor value={body} onChange={setBody} />
        </div>

        {/* AI Assistant Panel */}
        <AIAssistantPanel
          articleId={id}
          title={title}
          brief={brief}
          body={body}
          onApplyRefine={handleApplyRefine}
          onInsertImage={handleInsertInfographic}
        />

        {/* Sponsored toggle */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isSponsored}
              onChange={(e) => setIsSponsored(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-red"
            />
            <span className="text-sm text-zinc-300 font-medium">Matéria Patrocinada (selo CONAR)</span>
          </label>
          {isSponsored && (
            <input
              type="text"
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              placeholder="Nome do patrocinador"
              className="flex-1 px-3 py-2 rounded-lg bg-surface-3 border border-white/10 text-white text-sm outline-none"
            />
          )}
        </div>

        {/* CTA Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-accent font-bold">
              <Link2 className="w-5 h-5" />
              Call to Action (CTA)
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-xs text-zinc-500">Incluir CTA</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={ctaEnabled}
                  onChange={(e) => setCtaEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-surface-3 peer-checked:bg-blue-600 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>

          {ctaEnabled && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-zinc-500">
                Adicione um botão de ação e/ou vídeo no final da matéria. Ambos são opcionais.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    placeholder="Ex: Siga nosso Instagram"
                    className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
                    Link de Destino
                  </label>
                  <input
                    type="url"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="https://instagram.com/pilotocurioso"
                    className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
                  Link do Vídeo (YouTube, Instagram)
                </label>
                <input
                  type="url"
                  value={ctaVideoUrl}
                  onChange={(e) => setCtaVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... ou https://instagram.com/reel/..."
                  className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Preview */}
              {(ctaLabel || ctaVideoUrl) && (
                <div className="mt-2 p-4 rounded-xl bg-surface-1 border border-white/5">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3 font-bold">Preview do CTA</p>
                  {ctaVideoUrl && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-surface-3 text-sm text-zinc-400">
                      <Play className="w-4 h-4 text-blue-400" />
                      <span className="truncate">{ctaVideoUrl}</span>
                    </div>
                  )}
                  {ctaLabel && ctaUrl && (
                    <div className="flex justify-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-red to-brand-red-dark text-white font-bold text-sm uppercase tracking-wider">
                        <ExternalLink className="w-4 h-4" />
                        {ctaLabel}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO fields */}
        <details className="group">
          <summary className="cursor-pointer text-sm text-zinc-500 hover:text-white transition font-medium uppercase tracking-widest">
            ▸ SEO Avançado
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Override do title tag"
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">SEO Description</label>
              <input
                type="text"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Override da meta description"
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="f1, hamilton, ferrari"
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none"
              />
            </div>
          </div>
        </details>

        {/* Scheduling */}
        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2 font-medium">
            Agendar publicação
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm outline-none focus:border-brand-red/50"
          />
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
            messageType === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
            messageType === 'warning' ? 'bg-amber-500/10 text-amber-400' :
            'bg-red-500/10 text-red-400'
          }`}>
            {messageType === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
            {messageType === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {messageType === 'error' && <XCircle className="w-4 h-4 shrink-0" />}
            {message}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-3 border border-white/10 text-zinc-300 hover:text-white font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Salvar Rascunho
          </button>

          {scheduledAt && (
            <button
              onClick={() => handleSave('scheduled')}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <Calendar className="w-4 h-4" />
              Agendar
            </button>
          )}

          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publicar Agora
          </button>
        </div>
      </div>
    </div>
  );
}
