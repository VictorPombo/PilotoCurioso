'use client';

import { FolderOpen, Plus, Lightbulb, Clapperboard, Cog, History, Users, BarChart3, Handshake, type LucideIcon } from 'lucide-react';
import { useState } from 'react';

const ICON_MAP: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  clapperboard: Clapperboard,
  cog: Cog,
  history: History,
  users: Users,
  'bar-chart': BarChart3,
  handshake: Handshake,
};

const INITIAL_CATEGORIES = [
  { name: 'Você Sabia?', slug: 'voce-sabia', color: '#E8002D', icon: 'lightbulb' },
  { name: 'Bastidores da F1', slug: 'bastidores', color: '#FF6B00', icon: 'clapperboard' },
  { name: 'Engenharia Explicada', slug: 'engenharia', color: '#0066FF', icon: 'cog' },
  { name: 'História da F1', slug: 'historia', color: '#8B5CF6', icon: 'history' },
  { name: 'Pilotos e Equipes', slug: 'pilotos-equipes', color: '#10B981', icon: 'users' },
  { name: 'Análise de Corrida', slug: 'analise', color: '#F59E0B', icon: 'bar-chart' },
  { name: 'Parceria', slug: 'parceria', color: '#6B7280', icon: 'handshake' },
];

const ICON_OPTIONS = Object.keys(ICON_MAP);

export default function CategoriasPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', color: '#E8002D', icon: 'lightbulb' });

  function handleAdd() {
    if (!form.name.trim()) return;
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setCategories([...categories, { ...form, slug }]);
    setForm({ name: '', slug: '', color: '#E8002D', icon: 'lightbulb' });
    setShowForm(false);
  }

  function renderIcon(iconKey: string, color: string) {
    const IconComponent = ICON_MAP[iconKey] || Lightbulb;
    return <IconComponent className="w-5 h-5" style={{ color }} />;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-brand-red" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-white tracking-wide">EDITORIAS</h1>
            <p className="text-zinc-500 mt-1">Gerencie as editorias do portal</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm uppercase tracking-wider transition-colors">
          <Plus className="w-4 h-4" /> Nova
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl bg-surface-card border border-white/5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Nome *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Regulamento" className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Cor</label>
              <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full h-12 rounded-xl bg-surface-2 border border-white/10 cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Ícone</label>
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm outline-none">
                {ICON_OPTIONS.map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={handleAdd} className="px-6 py-3 rounded-xl bg-brand-red text-white font-bold text-sm uppercase tracking-wider">Criar</button>
        </div>
      )}

      <div className="space-y-2">
        {categories.map((c, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface-card border border-white/5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${c.color}15` }}>
              {renderIcon(c.icon, c.color)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">{c.name}</h3>
              <p className="text-xs text-zinc-500">/{c.slug}</p>
            </div>
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: c.color }} />
          </div>
        ))}
      </div>
    </div>
  );
}
