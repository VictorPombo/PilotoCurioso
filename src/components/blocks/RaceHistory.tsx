import { getAllF1Results } from '@/lib/jolpica';
import { Flag } from 'lucide-react';

export async function RaceHistory() {
  const races = await getAllF1Results('current');

  if (!races || races.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500 border border-white/5 rounded-xl bg-surface-1">
        <p>Histórico indisponível no momento.</p>
      </div>
    );
  }

  // Apenas corridas que já tiveram resultado (que tem a propriedade Results)
  const completedRaces = races.filter(r => r.Results && r.Results.length > 0).reverse(); // Reverse so latest is first

  if (completedRaces.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500 border border-white/5 rounded-xl bg-surface-1">
        <p>Nenhuma corrida finalizada ainda nesta temporada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {completedRaces.map((race) => {
        const p1 = race.Results[0];
        const p2 = race.Results[1];
        const p3 = race.Results[2];

        // Format Date
        let formattedDate = race.date;
        try {
          formattedDate = new Date(`${race.date}T00:00:00Z`).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          });
        } catch(e) {}

        return (
          <div 
            key={race.round}
            className="bg-surface-2 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Rodada {race.round}
                  </span>
                  <span className="text-xs text-zinc-600 px-2 border-l border-white/10">
                    {formattedDate}
                  </span>
                </div>
                <h3 className="font-display text-xl uppercase tracking-wide text-white">
                  {race.raceName.replace('Grand Prix', 'GP')}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Flag className="w-5 h-5 text-zinc-400" />
              </div>
            </div>

            {/* PÓDIO */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {/* P1 */}
              <div className="bg-surface-3 rounded-lg p-3 text-center border-t-2 border-[#d4af37]">
                <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">1º Lugar</div>
                <div className="font-bold text-white text-sm truncate">
                  {p1?.Driver.familyName}
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {p1?.Constructor.name}
                </div>
              </div>
              {/* P2 */}
              <div className="bg-surface-3 rounded-lg p-3 text-center border-t-2 border-[#C0C0C0]">
                <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">2º Lugar</div>
                <div className="font-bold text-white text-sm truncate">
                  {p2?.Driver.familyName}
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {p2?.Constructor.name}
                </div>
              </div>
              {/* P3 */}
              <div className="bg-surface-3 rounded-lg p-3 text-center border-t-2 border-[#CD7F32]">
                <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">3º Lugar</div>
                <div className="font-bold text-white text-sm truncate">
                  {p3?.Driver.familyName}
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {p3?.Constructor.name}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
