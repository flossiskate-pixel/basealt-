import { useState } from 'react';
import type { Task } from '../../types';
import { prepareTasks } from '../../domain/tasks';

function getInitials(name: string): string {
  if (!name) return '—';
  const parts = name.replace(/\./g, ' ').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

function formatDateFigma(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

interface Props {
  tasks: Task[];
  isLoading?: boolean;
  error?: string | null;
}

export function TasksBlock({ tasks, isLoading, error }: Props) {
  // Состояние: показывать ли все задачи
  const [showAll, setShowAll] = useState(false);

  if (isLoading) return <div className="h-20 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse" />;
  if (error) return <div className="text-rose-500 dark:text-rose-400 p-3 text-sm">{error}</div>;
  if (tasks.length === 0) return <p className="text-slate-400 dark:text-zinc-500 text-sm py-4">Нет задач</p>;

  // Если showAll = true, передаем огромный лимит, чтобы показать всё
  const { visible, rest, total, done } = prepareTasks(tasks, showAll ? 1000 : 10);
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex flex-col w-full min-w-0">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[12px] text-[#94a3b8] dark:text-zinc-400">
          {done} из {total} сделано
        </div>
        <div className="text-[12px] font-bold text-[#1a73e8] dark:text-zinc-300">
          {percent}%
        </div>
      </div>
      <div className="h-[4px] w-full bg-[#eef2f7] dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-[#1a73e8] dark:bg-purple-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>

      <ul className="flex flex-col w-full min-w-0">
        {visible.map((row, idx) => {
          const { task, isOverdue, status } = row;
          const isDone = status === 'done';

          return (
            <li key={task.id || idx} className="flex items-center gap-3 py-3 border-b border-[#f1f5f9] dark:border-[#27272a] last:border-0 w-full min-w-0 overflow-hidden">
              
              <div className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center ${isDone ? 'border-[#1a73e8] bg-[#1a73e8] dark:border-[#a855f7] dark:bg-[#a855f7]' : 'border-[#cbd5e1] dark:border-[#3f3f46] bg-transparent'}`}>
                {isDone && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <div className={`text-[13px] sm:text-[14px] font-medium truncate ${isDone ? 'text-[#94a3b8] dark:text-zinc-500 line-through' : 'text-[#1e293b] dark:text-zinc-200'}`}>
                  {task.title}
                </div>
                <div className="flex items-center gap-2 text-[11px] mt-0.5 text-[#94a3b8] dark:text-zinc-500 truncate">
                  <span className="truncate">{task.project}</span>
                  {isOverdue && <span className="text-[#c5221f] bg-red-50 px-1.5 rounded-sm whitespace-nowrap">Просрочено</span>}
                  {status === 'today' && <span className="text-[#b06000] bg-yellow-50 px-1.5 rounded-sm whitespace-nowrap">Сегодня</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-[#94a3b8] dark:text-zinc-500 whitespace-nowrap hidden sm:inline-block">
                  {formatDateFigma(task.dueDate)}
                </span>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#e8f0fe] text-[#1a73e8] dark:bg-zinc-800 dark:text-zinc-300 flex items-center justify-center text-[9px] sm:text-[10px] font-bold">
                  {getInitials(task.owner)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Кнопки управления списком */}
      <div className="mt-3 flex justify-center w-full">
        {!showAll && rest > 0 && (
          <button 
            onClick={() => setShowAll(true)}
            className="py-2 text-[12px] font-semibold text-[#1a73e8] dark:text-purple-400 hover:underline hover:text-[#1557b0] transition-colors"
          >
            Показать ещё {rest}
          </button>
        )}
        
        {showAll && total > 10 && (
          <button 
            onClick={() => setShowAll(false)}
            className="py-2 text-[12px] font-semibold text-[#94a3b8] dark:text-zinc-500 hover:underline hover:text-[#1a73e8] dark:hover:text-purple-400 transition-colors"
          >
            Скрыть
          </button>
        )}
      </div>
    </div>
  );
}