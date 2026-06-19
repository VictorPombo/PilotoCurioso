import { getF1Calendar } from '@/lib/jolpica';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';

export async function RaceCalendar() {
  const races = await getF1Calendar('current');
  
  if (!races || races.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500 border border-white/5 rounded-xl bg-surface-1">
        <p>Calendário indisponível no momento.</p>
      </div>
    );
  }

  const now = new Date();
  
  // Find the next race
  let nextRaceIndex = races.findIndex(race => {
    // combine date and time, if time is available
    const raceDateStr = race.time ? `${race.date}T${race.time}` : `${race.date}T00:00:00Z`;
    return new Date(raceDateStr) > now;
  });

  if (nextRaceIndex === -1) nextRaceIndex = races.length - 1; // All races done

  return (
    <div className="space-y-4">
      {races.map((race, index) => {
        const isNext = index === nextRaceIndex;
        const isPast = index < nextRaceIndex;

        // Convert to BRT (UTC-3)
        // Note: The API returns time in UTC (e.g., "14:00:00Z"). 
        // We parse it and format it to America/Sao_Paulo.
        let formattedDate = race.date;
        let formattedTime = 'TBA';
        
        try {
          const raceDateStr = race.time ? `${race.date}T${race.time}` : `${race.date}T12:00:00Z`;
          const raceDateObj = new Date(raceDateStr);
          
          formattedDate = raceDateObj.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            timeZone: 'America/Sao_Paulo'
          }).replace(' de ', '/');

          if (race.time) {
            formattedTime = raceDateObj.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/Sao_Paulo'
            });
          }
        } catch (e) {
          // fallback
        }

        return (
          <div 
            key={race.round}
            className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
              isNext 
                ? 'bg-brand-red/10 border-brand-red/30' 
                : 'bg-surface-2 border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0 ${
                isNext ? 'bg-brand-red text-white' : 'bg-surface-3 text-zinc-400'
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 leading-none mb-1">
                  {formattedDate.split('/')[1] || formattedDate.split(' ')[2]}
                </span>
                <span className="text-xl font-display leading-none">
                  {formattedDate.split('/')[0] || formattedDate.split(' ')[0]}
                </span>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isNext ? 'text-brand-red' : 'text-zinc-500'}`}>
                    Rodada {race.round}
                  </span>
                  {isNext && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-red text-white uppercase tracking-wider">
                      Próxima
                    </span>
                  )}
                  {isPast && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-zinc-400 uppercase tracking-wider">
                      Finalizada
                    </span>
                  )}
                </div>
                <h3 className={`font-display text-lg sm:text-xl uppercase tracking-wide leading-tight ${isNext ? 'text-white' : 'text-zinc-300'}`}>
                  {race.raceName.replace('Grand Prix', 'GP')}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  {race.Circuit.circuitName}, {race.Circuit.Location.country}
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <div className={`text-sm font-bold ${isNext ? 'text-white' : 'text-zinc-500'}`}>
                {formattedTime}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-600">
                Horário (BRT)
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
