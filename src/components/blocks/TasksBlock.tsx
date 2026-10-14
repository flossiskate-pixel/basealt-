import type { Task } from '../../types';
import { prepareTasks, formatDate } from '../../domain/tasks';

interface Props {
  tasks: Task[];
  isLoading?: boolean;
  error?: string | null;
}

export function TasksBlock({ tasks, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-12 bg-slate-100 rounded animate-pulse dark:bg-slate-800" />
        <div className="h-12 bg-slate-100 rounded animate-pulse dark:bg-slate-800" />
        <div className="h-12 bg-slate-100 rounded animate-pulse dark:bg-slate-800" />
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

  if (tasks.length === 0) {
    return <p className="text-slate-400 text-sm py-4 dark:text-slate-500">Нет задач</p>;
  }

  const { visible, rest } = prepareTasks(tasks);

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
        {visible.map(row => {
          const { task, isOverdue, overdueDays, status } = row;

          const titleClass = isOverdue
            ? 'text-red-600 dark:text-red-400'
            : status === 'done'
              ? 'text-slate-400 line-through dark:text-slate-500'
              : 'text-slate-900 dark:text-slate-100';

          return (
            <li key={task.id} className="py-2.5">
              <div className={`font-medium text-sm ${titleClass}`}>
                {task.title}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 dark:text-slate-400">
                <span>📁 {task.project}</span>
                <span>👤 {task.owner || '—'}</span>
                <span>📅 {formatDate(task.dueDate)}</span>
                {isOverdue && (
                  <span className="text-red-600 font-medium dark:text-red-400">
                    ⚠ просрочено на {overdueDays} дн.
                  </span>
                )}
                {status === 'done' && (
                  <span className="text-green-600 dark:text-green-400">✓ выполнено</span>
                )}
                {status === 'today' && (
                  <span className="text-orange-500 font-medium dark:text-orange-400">
                    ● сегодня
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {rest > 0 && (
        <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-100 dark:text-slate-400 dark:border-slate-800">
          ещё {rest}
        </div>
      )}
    </div>
  );
}