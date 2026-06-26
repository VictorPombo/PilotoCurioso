'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Save, Send, Calendar, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const EDITORIAS_FALLBACK = [
  { id: '1', name: 'Você Sabia?', slug: 'voce-sabia' },
  { id: '2', name: 'Bastidores da F1', slug: 'bastidores' },
  { id: '3', name: 'Engenharia Explicada', slug: 'engenharia' },
  { id: '4', name: 'História da F1', slug: 'historia' },
  { id: '5', name: 'Pilotos e Equipes', slug: 'pilotos-equipes' },
  { id: '6', name: 'Análise de Corrida', slug: 'analise' },
  { id: '7', name: 'Parceria', slug: 'parceria' },
];

export default function NewArticlePage() {
  const [title, setTitle] = useState('');
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

  const [aiTopics, setAiTopics] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'warning' | 'error'>('success');

  async function handleAIGenerate() {
    if (!aiTopics.trim()) return;
    setAiLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: aiTopics, category: categoryId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) setTitle(data.title);
        if (data.brief) setBrief(data.brief);
        if (data.body) setBody(data.body);
        if (data.seo_title) setSeoTitle(data.seo_title);
        if (data.seo_description) setSeoDescription(data.seo_description);
        setMessage('Matéria gerada com IA! Revise e publique.');
        setMessageType('success');
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage(errData.error || `Erro ${res.status} ao gerar com IA.`);
        setMessageType('error');
      }
    } catch {
      setMessage('Erro de conexão.');
      setMessageType('error');
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSave(status: 'draft' | 'published' | 'scheduled') {
    if (!title.trim()) {
      setMessage('Título é obrigatório.');
      setMessageType('warning');
      return;
    }
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          brief,
          body,
          type,
          category_id: categoryId || null,
          cover_image: coverImage || null,
          is_sponsored: isSponsored,
          sponsor_name: isSponsored ? sponsorName : null,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null,
          tags: tags ? tags.split(',').map((t) => t.trim()) : null,
          status: status === 'scheduled' ? 'scheduled' : status,
          scheduled_at: status === 'scheduled' ? scheduledAt : null,
          ia_generated: aiTopics.length > 0,
        }),
      });

      if (res.ok) {
        setMessage(
          status === 'published'
            ? 'Matéria publicada!'
            : status === 'scheduled'
            ? 'Matéria agendada!'
            : 'Rascunho salvo!'
        );
        setMessageType('success');
      } else {
        const err = await res.json();
        setMessage(err.error || 'Erro ao salvar.');
        setMessageType('error');
      }
    } catch {
      setMessage('Erro de conexão.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">NOVA MATÉRIA</h1>
        <p className="text-zinc-500 mt-1">Escreva ou gere com auxílio da IA</p>
      </div>

      {/* AI Assistant */}
      <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-4">
        <div className="flex items-center gap-2 text-purple-400 font-accent font-bold">
          <Sparkles className="w-5 h-5" />
          Assistente IA
        </div>
        <p className="text-sm text-zinc-400">
          Cole os tópicos, fatos ou notas crus. A IA estrutura a matéria com título, subtítulos,
          meta description e corpo otimizado para SEO.
        </p>
        <textarea
          value={aiTopics}
          onChange={(e) => setAiTopics(e.target.value)}
          placeholder="Ex: Hamilton renovou com a Ferrari por mais 2 anos. Salário estimado de $50M. Já são 7 títulos mundiais..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-purple-500/50 resize-none"
        />
        <button
          onClick={handleAIGenerate}
          disabled={aiLoading || !aiTopics.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          {aiLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {aiLoading ? 'Gerando...' : 'Gerar com IA'}
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
              {EDITORIAS_FALLBACK.map((c) => (
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
              Imagem de capa (URL)
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none focus:border-brand-red/50"
            />
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
            Corpo da matéria (HTML)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="<p>Escreva aqui o corpo da matéria...</p>"
            rows={16}
            className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none focus:border-brand-red/50 resize-y font-mono"
          />
        </div>

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
