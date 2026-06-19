'use client';

import { DollarSign, Plus } from 'lucide-react';
import { useState } from 'react';

const TYPES = [
  { value: 'patrocinio', label: 'Patrocínio' },
  { value: 'anuncio', label: 'Anúncio' },
  { value: 'publi', label: 'Publi' },
  { value: 'afiliado', label: 'Afiliado' },
  { value: 'outro', label: 'Outro' },
];

interface Entry { source: string; amount: number; type: string; description: string; date: string; }

export default function ReceitaPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ source: '', amount: '', type: 'patrocinio', description: '', date: new Date().toISOString().split('T')[0] });

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const byType = TYPES.map(t => ({
    ...t,
    total: entries.filter(e => e.type === t.value).reduce((sum, e) => sum + e.amount, 0),
  }));

  function handleAdd() {
    if (!form.source.trim() || !form.amount) return;
    setEntries([...entries, { ...form, amount: parseFloat(form.amount) }]);
    setForm({ source: '', amount: '', type: 'patrocinio', description: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-[#22C55E]" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-white tracking-wide">MAPA DE RECEITA</h1>
            <p className="text-zinc-500 mt-1">Controle de receita por fonte</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm uppercase tracking-wider transition-colors">
          <Plus className="w-4 h-4" /> Nova Entrada
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-surface-card border border-white/5 col-span-2 sm:col-span-1">
          <p className="text-2xl font-display text-[#22C55E]">R$ {total.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Total</p>
        </div>
        {byType.map(t => (
          <div key={t.value} className="p-4 rounded-xl bg-surface-card border border-white/5">
            <p className="text-lg font-display text-white">R$ {t.total.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl bg-surface-card border border-white/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Fonte *</label>
              <input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Ex: Equipe Thunder Racing" className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Valor (R$) *</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="1500.00" className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm outline-none">
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Data</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm outline-none" />
            </div>
          </div>
          <button onClick={handleAdd} className="px-6 py-3 rounded-xl bg-brand-red text-white font-bold text-sm uppercase tracking-wider">Salvar</button>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="rounded-2xl bg-surface-card border border-white/5 p-10 text-center">
          <DollarSign className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">Nenhuma receita registrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((e, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-card border border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">{e.source}</h3>
                <p className="text-xs text-zinc-500">{TYPES.find(t => t.value === e.type)?.label} · {e.date}</p>
              </div>
              <span className="text-[#22C55E] font-display text-lg">R$ {e.amount.toLocaleString('pt-BR')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
