import { useState } from 'react';
import type { Meeting } from '../../types';
import { WEEKDAYS, MONTHS, buildMonthGrid, toIso, groupByDate } from '../../domain/calendar';

interface Props {
  meetings: Meeting[];
  isLoading?: boolean;
  error?: string | null;
}

export function CalendarBlock({ meetings, isLoading, error }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(toIso(today));

  if (isLoading) return <div className="h-64 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse" />;
  if (error) return <div className="text-rose-500 dark:text-rose-400 p-3 text-sm">{error}</div>;

  const grid = buildMonthGrid(year, month);
  const byDate = groupByDate(meetings);
  const todayIso = toIso(today);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-bold text-[#0f172a] dark:text-zinc-200">
          {MONTHS[month]} {year}
        </div>
        <div className="flex gap-2 text-[#94a3b8] dark:text-zinc-400">
          <button onClick={() => setMonth(m => m === 0 ? (setYear(y => y - 1), 11) : m - 1)} className="hover:text-[#1a73e8] dark:hover:text-white transition">←</button>
          <button onClick={() => setMonth(m => m === 11 ? (setYear(y => y + 1), 0) : m + 1)} className="hover:text-[#1a73e8] dark:hover:text-white transition">→</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
        {WEEKDAYS.map(d => <div key={d} className="text-[#94a3b8] dark:text-zinc-500 font-semibold uppercase">{d}</div>)}
        {grid.map((d, i) => {
          const iso = toIso(d);
          const inMonth = d.getMonth() === month;
          const events = byDate[iso] ?? [];
          const isToday = iso === todayIso;
          const isSelected = iso === selected;

          return (
            <button
              key={i}
              onClick={() => setSelected(iso)}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                isSelected 
                  ? 'bg-gradient-to-b from-[#1e88e5] to-[#06b6d4] dark:from-[#8b5cf6] dark:to-[#d946ef] text-white shadow-md' 
                  : inMonth 
                    ? 'bg-[#f1f5f9] text-[#0f172a] dark:bg-[#18181b] dark:text-zinc-300 hover:bg-[#e8eef5] dark:hover:bg-[#27272a]' 
                    : 'text-[#cbd5e1] dark:text-zinc-700 bg-transparent'
              }`}
            >
              <span className={`text-[12px] ${isToday && !isSelected ? 'text-[#1e88e5] dark:text-purple-400 font-bold' : ''}`}>{d.getDate()}</span>
              {events.length > 0 && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#1e88e5] dark:bg-purple-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-1">
          <div className="text-[11px] font-semibold text-[#64748b] dark:text-zinc-500 mb-2">
            {selected === todayIso ? 'Сегодня' : selected}:
          </div>
          {byDate[selected]?.length ? (
             <ul className="flex flex-col gap-2">
               {byDate[selected].map(m => (
                 <li key={m.id} className="flex items-center gap-2 text-[12px] bg-[#f8fafd] border border-[#e7edf4] dark:bg-[#18181b] dark:border-[#27272a] p-2 rounded-lg">
                   <div className="w-[2px] self-stretch bg-[#1e88e5] dark:bg-purple-500 rounded-full" />
                   <div className="flex-1">
                     <div className="font-bold text-[#0f172a] dark:text-zinc-200">{m.topic}</div>
                     <div className="text-[10px] text-[#94a3b8] dark:text-zinc-500">{m.timeMsk ? `${m.timeMsk} МСК · ` : ''}{m.owner}</div>
                   </div>
                 </li>
               ))}
             </ul>
          ) : <p className="text-[11px] text-[#94a3b8] dark:text-zinc-600 py-2">Событий нет</p>}
        </div>
      )}
    </div>
  );
}