'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface AIToolPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  inputLabel: string;
  inputPlaceholder: string;
  apiEndpoint: string;
  buildPayload: (input: string) => Record<string, unknown>;
  renderResult: (data: unknown) => React.ReactNode;
  useTextarea?: boolean;
}

export function AIToolPage({
  title,
  description,
  icon,
  inputLabel,
  inputPlaceholder,
  apiEndpoint,
  buildPayload,
  renderResult,
  useTextarea = true,
}: AIToolPageProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(input)),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setError('Erro ao processar. Verifique a chave da IA.');
      }
    } catch {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide">{title}</h1>
          <p className="text-zinc-500 mt-1">{description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-xs text-zinc-500 uppercase tracking-widest font-medium">
          {inputLabel}
        </label>
        {useTextarea ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-brand-red/50 resize-none"
          />
        ) : (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-brand-red/50"
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Processando...' : 'Gerar'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-sm">{error}</div>
      )}

      {result && (
        <div className="p-6 rounded-2xl bg-surface-card border border-white/5 animate-fade-in">
          {renderResult(result)}
        </div>
      )}
    </div>
  );
}
