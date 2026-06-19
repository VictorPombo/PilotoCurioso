'use client';

import { useState, useEffect } from 'react';
import { getF1DriverStandings, getF1ConstructorStandings, F1DriverStanding, F1ConstructorStanding } from '@/lib/jolpica';
import { Trophy } from 'lucide-react';

export function Standings() {
  const [activeTab, setActiveTab] = useState<'drivers' | 'constructors'>('drivers');
  const [drivers, setDrivers] = useState<F1DriverStanding[]>([]);
  const [constructors, setConstructors] = useState<F1ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [d, c] = await Promise.all([
          getF1DriverStandings('current'),
          getF1ConstructorStandings('current')
        ]);
        setDrivers(d);
        setConstructors(c);
      } catch (e) {
        console.error('Failed to load standings', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center border border-white/5 rounded-xl bg-surface-1">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (drivers.length === 0 && constructors.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500 border border-white/5 rounded-xl bg-surface-1">
        <p>Classificação indisponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-2 rounded-2xl border border-white/5 overflow-hidden">
      
      {/* TABS */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab('drivers')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'drivers' 
              ? 'text-white border-b-2 border-brand-red bg-white/5' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
          }`}
        >
          Pilotos
        </button>
        <button
          onClick={() => setActiveTab('constructors')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'constructors' 
              ? 'text-white border-b-2 border-brand-red bg-white/5' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
          }`}
        >
          Equipes
        </button>
      </div>

      {/* DRIVERS TABLE */}
      {activeTab === 'drivers' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-3 border-b border-white/5 text-[10px] uppercase tracking-wider text-zinc-500">
                <th className="py-3 px-4 w-12 text-center">Pos</th>
                <th className="py-3 px-4">Piloto</th>
                <th className="py-3 px-4 hidden sm:table-cell">Equipe</th>
                <th className="py-3 px-4 text-right">Pts</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d, i) => (
                <tr 
                  key={d.Driver.driverId}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-3 px-4 text-center">
                    <span className={`font-display text-lg ${i < 3 ? 'text-brand-red' : 'text-zinc-500'}`}>
                      {d.position}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-white group-hover:text-brand-red transition-colors">
                        {d.Driver.givenName} {d.Driver.familyName}
                      </span>
                    </div>
                    {/* Mobile Only Team */}
                    <div className="text-xs text-zinc-500 sm:hidden mt-0.5">
                      {d.Constructors[0]?.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-400 hidden sm:table-cell">
                    {d.Constructors[0]?.name}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-white bg-surface-3 px-2 py-1 rounded">
                      {d.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CONSTRUCTORS TABLE */}
      {activeTab === 'constructors' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-3 border-b border-white/5 text-[10px] uppercase tracking-wider text-zinc-500">
                <th className="py-3 px-4 w-12 text-center">Pos</th>
                <th className="py-3 px-4">Equipe</th>
                <th className="py-3 px-4 text-right">Pts</th>
              </tr>
            </thead>
            <tbody>
              {constructors.map((c, i) => (
                <tr 
                  key={c.Constructor.constructorId}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-3 px-4 text-center">
                    <span className={`font-display text-lg ${i === 0 ? 'text-[#d4af37]' : 'text-zinc-500'}`}>
                      {c.position}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-white group-hover:text-[#d4af37] transition-colors">
                    {c.Constructor.name}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-white bg-surface-3 px-2 py-1 rounded">
                      {c.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
