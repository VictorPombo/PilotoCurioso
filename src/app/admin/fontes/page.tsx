'use client';

import { Users, Plus } from 'lucide-react';
import { useState } from 'react';

export default function FontesPage() {
  const [sources, setSources] = useState<Array<{name: string; role: string; organization: string; whatsapp: string; instagram: string; category: string; notes: string}>>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', organization: '', whatsapp: '', instagram: '', category: '', notes: '' });

  function handleAdd() {
    if (!form.name.trim()) return;
    setSources([...sources, { ...form }]);
    setForm({ name: '', role: '', organization: '', whatsapp: '', instagram: '', category: '', notes: '' });
    setShowForm(false);
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-[#6366F1]" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-white tracking-wide">BANCO DE FONTES</h1>
            <p className="text-zinc-500 mt-1">CRM de contatos jornalísticos</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Fonte
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl bg-surface-card border border-white/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Nome *', placeholder: 'Nome completo' },
              { key: 'role', label: 'Cargo', placeholder: 'Ex: Engenheiro de pista' },
              { key: 'organization', label: 'Organização', placeholder: 'Ex: Red Bull Racing' },
              { key: 'whatsapp', label: 'WhatsApp', placeholder: '+55 11...' },
              { key: 'instagram', label: 'Instagram', placeholder: '@...' },
              { key: 'category', label: 'Categoria', placeholder: 'Ex: F1, F4, Kart' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">{field.label}</label>
                <input
                  type="text"
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Notas</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Observações sobre o contato..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-zinc-600 outline-none resize-none"
            />
          </div>
          <button onClick={handleAdd} className="px-6 py-3 rounded-xl bg-brand-red text-white font-bold text-sm uppercase tracking-wider">
            Salvar Fonte
          </button>
        </div>
      )}

      {sources.length === 0 ? (
        <div className="rounded-2xl bg-surface-card border border-white/5 p-10 text-center">
          <Users className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">Nenhuma fonte cadastrada. Clique em &quot;Nova Fonte&quot; para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((s, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-card border border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">{s.name}</h3>
                <p className="text-xs text-zinc-500">{s.role} · {s.organization} · {s.category}</p>
              </div>
              <div className="text-xs text-zinc-600">{s.whatsapp || s.instagram}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
