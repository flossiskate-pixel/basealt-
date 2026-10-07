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
  const today = todayMsk();

  const rows: TaskRow[] = tasks.map(task => {
    const diff = daysBetween(today, task.dueDate);

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

  rows.sort((a, b) => {
    const aRank = a.status === 'overdue' ? 0 : 1;
    const bRank = b.status === 'overdue' ? 0 : 1;
    if (aRank !== bRank) return aRank - bRank;
    return a.task.dueDate.localeCompare(b.task.dueDate);
  });

  return {
    visible: rows.slice(0, max),
    rest: Math.max(0, rows.length - max),
    total: rows.length,
  };
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}