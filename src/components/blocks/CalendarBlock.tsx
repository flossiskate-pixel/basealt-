import { useState } from 'react';
import type { Meeting } from '../../types';
import {
  WEEKDAYS,
  MONTHS,
  buildMonthGrid,
  toIso,
  groupByDate,
  MARKER_COLOR,
  MARKER_LABEL,
} from '../../domain/calendar';

interface Props {
  meetings: Meeting[];
  isLoading?: boolean;
  error?: string | null;
}

export function CalendarBlock({ meetings, isLoading, error }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-8 bg-slate-100 rounded animate-pulse dark:bg-slate-800" />
        <div className="h-64 bg-slate-100 rounded animate-pulse dark:bg-slate-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
        Не удалось загрузить: {error}
      </div>
    );
  }

  const grid = buildMonthGrid(year, month);
  const byDate = groupByDate(meetings);
  const todayIso = toIso(today);

  function prev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  }

  function next() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  }

  const selectedList = selected ? (byDate[selected] ?? []) : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          className="px-2 py-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
        >
          ←
        </button>
        <div className="font-medium text-slate-900 dark:text-slate-100">
          {MONTHS[month]} {year}
        </div>
        <button
          onClick={next}
          className="px-2 py-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-slate-400 font-medium py-1 dark:text-slate-500">
            {d}
          </div>
        ))}

        {grid.map((d, i) => {
          const iso = toIso(d);
          const inMonth = d.getMonth() === month;
          const events = byDate[iso] ?? [];
          const isToday = iso === todayIso;
          const isSelected = iso === selected;

          return (
            <button
              key={i}
              onClick={() => setSelected(iso === selected ? null : iso)}
              className={[
                'relative aspect-square rounded flex flex-col items-center justify-start pt-1 text-xs transition',
                inMonth
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-300 dark:text-slate-600',
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                isToday && !isSelected
                  ? 'ring-1 ring-blue-400 dark:ring-blue-500'
                  : '',
              ].join(' ')}
            >
              <span>{d.getDate()}</span>
              {events.length > 0 && (
                <span className="flex gap-0.5 mt-0.5">
                  {events.slice(0, 3).map(e => (
                    <span
                      key={e.id}
                      className={`w-1.5 h-1.5 rounded-full ${MARKER_COLOR[e.type]}`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
        {(['meeting', 'stage-deadline', 'handover'] as const).map(t => (
          <span key={t} className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${MARKER_COLOR[t]}`} />
            {MARKER_LABEL[t]}
          </span>
        ))}
      </div>

      {selected && (
        <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
          {selectedList.length === 0 ? (
            <p className="text-slate-400 text-sm dark:text-slate-500">
              На этот день ничего нет
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {selectedList
                .slice()
                .sort((a, b) => a.timeMsk.localeCompare(b.timeMsk))
                .map(m => (
                  <li key={m.id} className="flex items-start gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full mt-1.5 ${MARKER_COLOR[m.type]}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-slate-900 dark:text-slate-100">{m.topic}</div>
                      <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 dark:text-slate-400">
                        {m.timeMsk && <span>🕐 {m.timeMsk} МСК</span>}
                        <span>👤 {m.owner || '—'}</span>
                        {m.vksUrl && (
                          <a
                            href={m.vksUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            ВКС →
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}