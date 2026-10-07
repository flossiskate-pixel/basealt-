import type { Meeting } from '../types';

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

/** Возвращает массив из 42 дат (6 недель × 7 дней) для отображения месяца. */
export function buildMonthGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const dayOfWeekMon = (firstDay.getDay() + 6) % 7; // 0 = Пн, 6 = Вс

  const start = new Date(year, month, 1 - dayOfWeekMon);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

/** YYYY-MM-DD в локальном времени. */
export function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Группирует встречи по дате: { '2026-10-06': [m1, m2, ...] } */
export function groupByDate(meetings: Meeting[]): Record<string, Meeting[]> {
  const map: Record<string, Meeting[]> = {};
  for (const m of meetings) {
    if (!map[m.date]) map[m.date] = [];
    map[m.date].push(m);
  }
  return map;
}

/** Цвет маркера по типу встречи (Tailwind-класс фона). */
export const MARKER_COLOR: Record<Meeting['type'], string> = {
  'meeting':          'bg-blue-500',
  'project-deadline': 'bg-red-500',
  'stage-deadline':   'bg-yellow-400',
  'handover':         'bg-green-500',
};

export const MARKER_LABEL: Record<Meeting['type'], string> = {
  'meeting':          'Встреча',
  'project-deadline': 'Дедлайн проекта',
  'stage-deadline':   'Дедлайн этапа',
  'handover':         'Сдача',
};