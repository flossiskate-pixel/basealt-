import type { Task } from '../../types';
import { prepareTasks, formatDate } from '../../domain/tasks';

interface Props {
  tasks: Task[];
}

export function TasksBlock({ tasks }: Props) {
  if (tasks.length === 0) {
    return <p className="text-slate-400 text-sm py-4">Нет задач</p>;
  }

  const { visible, rest } = prepareTasks(tasks);

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col divide-y divide-slate-100">
        {visible.map(row => {
          const { task, isOverdue, overdueDays, status } = row;

          const titleClass = isOverdue
            ? 'text-red-600'
            : status === 'done'
              ? 'text-slate-400 line-through'
              : 'text-slate-900';

          return (
            <li key={task.id} className="py-2.5">
              <div className={`font-medium text-sm ${titleClass}`}>
                {task.title}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                <span>📁 {task.project}</span>
                <span>👤 {task.owner || '—'}</span>
                <span>📅 {formatDate(task.dueDate)}</span>
                {isOverdue && (
                  <span className="text-red-600 font-medium">
                    ⚠ просрочено на {overdueDays} дн.
                  </span>
                )}
                {status === 'done' && (
                  <span className="text-green-600">✓ выполнено</span>
                )}
                {status === 'today' && (
                  <span className="text-orange-500 font-medium">● сегодня</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {rest > 0 && (
        <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-100">
          ещё {rest}
        </div>
      )}
    </div>
  );
}