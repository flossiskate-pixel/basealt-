import type { Task } from '../../types';
import { prepareTasks, formatDate } from '../../domain/tasks';

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
  if (isLoading) return <div className="h-20 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse" />;
  if (error) return <div className="text-rose-500 dark:text-rose-400 p-3 text-sm">{error}</div>;
  if (tasks.length === 0) return <p className="text-slate-400 dark:text-zinc-500 text-sm py-4">Нет задач</p>;

  const { visible, rest } = prepareTasks(tasks);
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[11px] text-[#94a3b8] dark:text-zinc-400">
          {done} из {total} сделано
        </div>
        <div className="text-[11px] font-bold text-[#1a73e8] dark:text-zinc-300">
          {percent}%
        </div>
      </div>
      <div className="h-[4px] w-full bg-[#eef2f7] dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-[#1a73e8] dark:bg-purple-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>

      <ul className="flex flex-col">
        {visible.map(row => {
          const { task, isOverdue, status } = row;
          const isDone = status === 'done';

          return (
            <li key={task.id} className="flex items-start gap-3 py-2.5 border-b border-[#f1f5f9] dark:border-[#27272a] last:border-0">
              
              <div
                className={`shrink-0 mt-[2px] w-4 h-4 rounded border flex items-center justify-center transition-colors
                  ${isDone ? 'border-[#1a73e8] bg-[#1a73e8] dark:border-[#a855f7] dark:bg-[#a855f7]' : 'border-[#cbd5e1] dark:border-[#3f3f46] bg-transparent'}`}
              >
                {isDone && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-[12.5px] font-medium truncate ${isDone ? 'text-[#94a3b8] dark:text-zinc-500 line-through' : 'text-[#1e293b] dark:text-zinc-200'}`}>
                  {task.title}
                </div>
                <div className="flex items-center gap-2 text-[10.5px] mt-0.5 text-[#94a3b8] dark:text-zinc-500">
                  <span className="truncate">{task.project}</span>
                  {isOverdue && <span className="text-[#c5221f] bg-red-50 dark:text-rose-400 dark:bg-rose-950/30 dark:border dark:border-rose-900/50 px-1.5 rounded-sm">Просрочено</span>}
                  {status === 'today' && <span className="text-[#b06000] bg-yellow-50 dark:text-amber-400 dark:bg-amber-950/30 dark:border dark:border-amber-900/50 px-1.5 rounded-sm">Сегодня</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <span className="text-[10.5px] text-[#94a3b8] dark:text-zinc-500 whitespace-nowrap">
                  {/* Исправлено: due -> dueDate */}
                  {formatDateFigma(task.dueDate)}
                </span>
                <div className="w-6 h-6 rounded-full bg-[#e8f0fe] text-[#1a73e8] dark:bg-zinc-800 dark:border dark:border-zinc-700 dark:text-zinc-300 flex items-center justify-center text-[9px] font-bold">
                  {getInitials(task.owner)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {rest > 0 && <div className="text-xs text-center text-[#94a3b8] dark:text-zinc-500 pt-2">ещё {rest}</div>}
    </div>
  );
}