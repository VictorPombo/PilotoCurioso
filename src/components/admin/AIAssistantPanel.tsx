'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  RefreshCw,
  ImagePlus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Zap,
  Target,
  BookOpen,
  Eye,
} from 'lucide-react';

interface ScoreData {
  viral_score: number;
  seo_score: number;
  engagement_score: number;
  readability_score: number;
  overall_score: number;
  strengths: string[];
  improvements: string[];
  keyword_analysis?: {
    primary: string;
    secondary: string[];
    density: string;
  };
}

interface RefineData {
  title: string;
  brief: string;
  body: string;
  seo_title: string;
  seo_description: string;
  tags: string[];
  changes_summary: string[];
  seo_score: number;
}

interface HistoryEntry {
  action: string;
  scores: Record<string, number> | null;
  created_at: string;
}

interface AIAssistantPanelProps {
  articleId: string;
  title: string;
  brief: string;
  body: string;
  onApplyRefine: (data: RefineData) => void;
  onInsertImage: (url: string) => void;
}

function ScoreGauge({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  const color = value >= 80 ? 'text-emerald-400' : value >= 60 ? 'text-amber-400' : 'text-red-400';
  const bgColor = value >= 80 ? 'bg-emerald-400' : value >= 60 ? 'bg-amber-400' : 'bg-red-400';
  
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-surface-3" />
          <circle
            cx="32" cy="32" r="28" fill="none" strokeWidth="4"
            strokeDasharray={`${(value / 100) * 175.9} 175.9`}
            strokeLinecap="round"
            className={color}
            style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold font-mono ${color}`}>
          {value}
        </div>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
        {icon}
        {label}
      </div>
    </div>
  );
}

function HistoryChart({ history }: { history: HistoryEntry[] }) {
  if (!history.length) return null;

  const scores = history
    .filter(h => h.scores?.overall_score)
    .map(h => h.scores!.overall_score)
    .reverse();

  if (scores.length < 2) return null;

  const max = Math.max(...scores, 100);
  const min = Math.min(...scores, 0);
  const range = max - min || 1;

  return (
    <div className="space-y-1.5">
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Evolução do Score</span>
      <div className="flex items-end gap-1 h-10">
        {scores.map((score, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-brand-red/50 to-brand-red transition-all duration-500"
            style={{ height: `${((score - min) / range) * 100}%`, minHeight: '4px' }}
            title={`Score: ${score}`}
          />
        ))}
      </div>
    </div>
  );
}

export function AIAssistantPanel({
  articleId,
  title,
  brief,
  body,
  onApplyRefine,
  onInsertImage,
}: AIAssistantPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'score' | 'refine' | 'infographic'>('score');
  
  // Score state
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  
  // Refine state
  const [refineLoading, setRefineLoading] = useState(false);
  const [refineData, setRefineData] = useState<RefineData | null>(null);
  
  // Infographic state
  const [infographicLoading, setInfographicLoading] = useState(false);
  const [infographicUrl, setInfographicUrl] = useState<string | null>(null);
  const [infographicPrompt, setInfographicPrompt] = useState('');
  const [infographicStyle, setInfographicStyle] = useState<'infographic' | 'card' | 'stats'>('infographic');
  
  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    loadHistory();
  }, [articleId]);

  async function loadHistory() {
    try {
      const res = await fetch(`/api/articles/${articleId}`, { credentials: 'include' });
      if (!res.ok) return;

      // Load AI history separately
      const histRes = await fetch(`/api/ai/refine-article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          article_id: articleId,
          title: '_history_only',
          body: '_',
          action: 'history',
        }),
      });
      // History endpoint might not exist yet — graceful fallback
    } catch {
      // Silent fail
    }
  }

  async function handleAnalyzeScore() {
    if (!title.trim() || !body.trim()) return;
    setScoreLoading(true);

    try {
      const res = await fetch('/api/ai/refine-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          article_id: articleId,
          title,
          body,
          brief,
          action: 'score',
        }),
      });

      if (!res.ok) throw new Error('Erro ao analisar');
      const data = await res.json();
      setScoreData(data);

      // Atualizar histórico
      setHistory(prev => [{
        action: 'score',
        scores: { overall_score: data.overall_score, seo_score: data.seo_score },
        created_at: new Date().toISOString(),
      }, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setScoreLoading(false);
    }
  }

  async function handleRefine() {
    if (!title.trim() || !body.trim()) return;
    setRefineLoading(true);

    try {
      const res = await fetch('/api/ai/refine-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          article_id: articleId,
          title,
          body,
          brief,
          action: 'refine',
        }),
      });

      if (!res.ok) throw new Error('Erro ao refinar');
      const data = await res.json();
      setRefineData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefineLoading(false);
    }
  }

  async function handleGenerateInfographic() {
    if (!title.trim()) return;
    setInfographicLoading(true);
    setInfographicUrl(null);

    try {
      const res = await fetch('/api/ai/generate-infographic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          article_id: articleId,
          title,
          body,
          style: infographicStyle,
        }),
      });

      if (!res.ok) throw new Error('Erro ao gerar');
      const data = await res.json();
      setInfographicUrl(data.image_url);
      setInfographicPrompt(data.image_prompt);
    } catch (err) {
      console.error(err);
    } finally {
      setInfographicLoading(false);
    }
  }

  const tabs = [
    { key: 'score' as const, label: 'Score', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: 'refine' as const, label: 'Refinar', icon: <RefreshCw className="w-3.5 h-3.5" /> },
    { key: 'infographic' as const, label: 'Infográfico', icon: <ImagePlus className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-b from-brand-red/5 to-transparent border border-brand-red/20 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-red" />
          <span className="font-accent font-bold text-white text-sm uppercase tracking-wider">
            Assistente Editorial IA
          </span>
          {scoreData && (
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
              scoreData.overall_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
              scoreData.overall_score >= 60 ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {scoreData.overall_score}/100
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
      </button>

      {expanded && (
        <div className="border-t border-white/5">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                  activeTab === tab.key
                    ? 'text-brand-red border-b-2 border-brand-red bg-brand-red/5'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* ===== TAB: SCORE ===== */}
            {activeTab === 'score' && (
              <div className="space-y-5">
                <button
                  onClick={handleAnalyzeScore}
                  disabled={scoreLoading || !title.trim() || !body.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-red/10 hover:bg-brand-red/20 text-brand-red font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {scoreLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analisando...</>
                  ) : (
                    <><TrendingUp className="w-4 h-4" /> Analisar Score</>
                  )}
                </button>

                {scoreData && (
                  <>
                    {/* Gauges */}
                    <div className="grid grid-cols-5 gap-2">
                      <ScoreGauge label="Viral" value={scoreData.viral_score} icon={<Zap className="w-2.5 h-2.5" />} />
                      <ScoreGauge label="SEO" value={scoreData.seo_score} icon={<Target className="w-2.5 h-2.5" />} />
                      <ScoreGauge label="Engage" value={scoreData.engagement_score} icon={<TrendingUp className="w-2.5 h-2.5" />} />
                      <ScoreGauge label="Leitura" value={scoreData.readability_score} icon={<BookOpen className="w-2.5 h-2.5" />} />
                      <ScoreGauge label="Geral" value={scoreData.overall_score} icon={<Eye className="w-2.5 h-2.5" />} />
                    </div>

                    <HistoryChart history={history} />

                    {/* Keywords */}
                    {scoreData.keyword_analysis && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Keywords</span>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-1 rounded-lg bg-brand-red/10 text-brand-red text-xs font-medium">
                            {scoreData.keyword_analysis.primary}
                          </span>
                          {scoreData.keyword_analysis.secondary?.map((kw, i) => (
                            <span key={i} className="px-2 py-1 rounded-lg bg-surface-3 text-zinc-400 text-xs">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-medium">✓ Pontos fortes</span>
                        {scoreData.strengths?.map((s, i) => (
                          <p key={i} className="text-xs text-zinc-400 leading-relaxed">• {s}</p>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] text-amber-400 uppercase tracking-wider font-medium">↑ Melhorias</span>
                        {scoreData.improvements?.map((s, i) => (
                          <p key={i} className="text-xs text-zinc-400 leading-relaxed">• {s}</p>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ===== TAB: REFINE ===== */}
            {activeTab === 'refine' && (
              <div className="space-y-5">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  A IA mantém o contexto das interações anteriores. Cada refinamento é incremental — ajusta o texto sem reescrever.
                </p>

                <button
                  onClick={handleRefine}
                  disabled={refineLoading || !title.trim() || !body.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {refineLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Refinando...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4" /> Refinar com IA</>
                  )}
                </button>

                {refineData && (
                  <div className="space-y-4">
                    {/* Changes summary */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-purple-400 uppercase tracking-wider font-medium">Mudanças aplicadas</span>
                      {refineData.changes_summary?.map((change, i) => (
                        <p key={i} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5">→</span>
                          {change}
                        </p>
                      ))}
                    </div>

                    {/* SEO Score */}
                    {refineData.seo_score && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-zinc-500">Score SEO estimado:</span>
                        <span className={`font-bold font-mono ${
                          refineData.seo_score >= 80 ? 'text-emerald-400' : 
                          refineData.seo_score >= 60 ? 'text-amber-400' : 'text-red-400'
                        }`}>{refineData.seo_score}/100</span>
                      </div>
                    )}

                    {/* Apply / Reject */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onApplyRefine(refineData);
                          setRefineData(null);
                          setHistory(prev => [{
                            action: 'refine',
                            scores: { seo_score: refineData.seo_score },
                            created_at: new Date().toISOString(),
                          }, ...prev]);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Aplicar
                      </button>
                      <button
                        onClick={() => setRefineData(null)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Descartar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== TAB: INFOGRAPHIC ===== */}
            {activeTab === 'infographic' && (
              <div className="space-y-5">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Gere infográficos baseados no conteúdo da matéria. A IA usa o contexto para criar imagens relevantes.
                </p>

                {/* Style selector */}
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: 'infographic' as const, label: '📊 Infográfico', desc: 'Dados visuais' },
                    { key: 'card' as const, label: '🃏 Card', desc: 'Destaque social' },
                    { key: 'stats' as const, label: '📈 Stats', desc: 'Estatísticas' },
                  ]).map((style) => (
                    <button
                      key={style.key}
                      onClick={() => setInfographicStyle(style.key)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        infographicStyle === style.key
                          ? 'bg-brand-red/10 border border-brand-red/30 text-white'
                          : 'bg-surface-3 border border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-lg">{style.label.split(' ')[0]}</div>
                      <div className="text-[10px] mt-1">{style.desc}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGenerateInfographic}
                  disabled={infographicLoading || !title.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {infographicLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</>
                  ) : (
                    <><ImagePlus className="w-4 h-4" /> Gerar Infográfico</>
                  )}
                </button>

                {/* Generated infographic */}
                {infographicUrl && (
                  <div className="space-y-3">
                    <img
                      src={infographicUrl}
                      alt="Infográfico gerado"
                      className="w-full rounded-xl border border-white/10"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => onInsertImage(infographicUrl)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Inserir no corpo
                      </button>
                      <button
                        onClick={handleGenerateInfographic}
                        disabled={infographicLoading}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-3 hover:bg-surface-4 text-zinc-400 font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Regenerar
                      </button>
                    </div>
                  </div>
                )}

                {/* Show prompt if image failed */}
                {infographicPrompt && !infographicUrl && !infographicLoading && (
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 text-xs space-y-1">
                    <p className="font-bold">Imagen não disponível. Use o prompt abaixo em outro gerador:</p>
                    <p className="text-zinc-400 italic">{infographicPrompt}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
