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
  const today = new Date();
  const dow = (today.getDay() + 6) % 7; // 0 = понедельник, 6 = воскресенье
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const mondayIso = toIso(monday);
  const sundayIso = toIso(sunday);

  // Оставляем только задачи, чей дедлайн попадает в текущую неделю
  const filtered = tasks.filter(t =>
    t.dueDate >= mondayIso && t.dueDate <= sundayIso
  );

  const todayIso = todayMsk();

  const rows: TaskRow[] = filtered.map(task => {
    const diff = daysBetween(todayIso, task.dueDate);

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

export function countWeekTasks(tasks: Task[]): number {
  const today = new Date();
  const dow = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const mondayIso = toIso(monday);
  const sundayIso = toIso(sunday);

  return tasks.filter(t =>
    t.dueDate >= mondayIso && t.dueDate <= sundayIso
  ).length;
}