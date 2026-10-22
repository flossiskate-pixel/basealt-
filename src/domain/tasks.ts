import type { Task } from '../types';
import { todayMsk } from './status';

function daysBetween(from: string, to: string): number {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export interface TaskRow {
  task: Task;
  isOverdue: boolean;
  overdueDays: number;
  status: 'done' | 'overdue' | 'today' | 'future';
}

export function prepareTasks(tasks: Task[], max = 10) {
  // Берем все задачи, без фильтра по неделе
  const filtered = tasks; 
  const todayIso = todayMsk();

  const rows: TaskRow[] = filtered.map(task => {
    const diff = daysBetween(todayIso, String(task.dueDate));
    let status: TaskRow['status'];
    if (task.completed) status = 'done';
    else if (diff < 0) status = 'overdue';
    else if (diff === 0) status = 'today';
    else status = 'future';

    return {
      task,
      isOverdue: status === 'overdue',
      overdueDays: status === 'overdue' ? -diff : 0,
      status,
    };
  });

  // Сортировка: сначала просроченные, потом по дате
  rows.sort((a, b) => {
    const aRank = a.status === 'overdue' ? 0 : 1;
    const bRank = b.status === 'overdue' ? 0 : 1;
    if (aRank !== bRank) return aRank - bRank;
    
    const aDate = String(a.task.dueDate || '');
    const bDate = String(b.task.dueDate || '');
    return aDate.localeCompare(bDate);
  });

  const doneCount = rows.filter(r => r.status === 'done').length;

  return {
    visible: rows.slice(0, max),
    rest: Math.max(0, rows.length - max),
    total: rows.length,
    done: doneCount,
  };
}

// Возвращаем общее количество задач для шапки блока
export function countWeekTasks(tasks: Task[]): number {
  return tasks.length; 
}

export function formatDate(iso: string): string {
  if (!iso) return '—';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}