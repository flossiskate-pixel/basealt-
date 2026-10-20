import type { Task } from '../types';
import { todayMsk } from './status';
import { toIso } from './calendar';

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
  const year = new Date().getFullYear();
  const today = new Date(year, 9, 1);
  const dow = (today.getDay() + 6) % 7;


  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  const sunday = new Date(year, 10, 19);

  const mondayIso = toIso(monday);
  const sundayIso = toIso(sunday);

  const filtered = tasks.filter(
    t => t.due >= mondayIso && t.due <= sundayIso
  );

  const todayIso = todayMsk();

  const rows: TaskRow[] = filtered.map(task => {
    const diff = daysBetween(todayIso, task.due);
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
    return a.task.due.localeCompare(b.task.due);
  });

  return {
    visible: rows.slice(0, max),
    rest: Math.max(0, rows.length - max),
    total: rows.length,
  };
}

export function countWeekTasks(tasks: Task[]): number { 
  const year = new Date().getFullYear();
  const today = new Date(year, 9, 1);
  const dow = (today.getDay() + 6) % 7;


  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  const sunday = new Date(year, 10, 19);
  // sunday.setDate(monday.getDate() + 6);

  return tasks.filter(
    t => t.due >= toIso(monday) && t.due <= toIso(sunday)
  ).length;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}