import type { Project, Task, Meeting, Lead, MeetingType, Stage } from '../types';
import type { RawData } from './sheets';

// Превращает "06.10.2026" в "2026-10-06"
function parseDate(str: string): string {
  if (!str) return '';
  const match = str.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (match) {
    const [_, d, m, y] = match;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return str; 
}

function getStageStatus(txt: string): Stage['status'] {
  const s = (txt ?? '').trim().toLowerCase();
  if (s.includes('в срок')) return 'ok';
  if (s.includes('риск')) return 'risk';
  if (s.includes('нарушен')) return 'fail';
  return 'plan';
}

function safeMeetingType(s: string): MeetingType {
  if (s === 'meeting' || s === 'project-deadline' || s === 'stage-deadline' || s === 'handover') return s;
  return 'meeting';
}

export function normalize(data: RawData) {
  // В твоей таблице этапы лежат в колонках C, D, E, F, G
  const stageNames = ['Подготовка', 'Запуск', 'Спринты', 'Защита и приёмка', 'Посттрек'];
  const stageKeys = ['Подготовка', 'Запуск', 'Спринты', 'Защита и приёмка', 'Посттрек'];

  const projects: Project[] = data.projects.map((r, i) => {
    const stages: Stage[] = stageNames.map((name, idx) => {
      // Ищем колонку по названию, если не нашли - берем по индексу
      const key = Object.keys(r).find(k => k.includes(name)) || stageKeys[idx];
      return {
        name: name,
        status: getStageStatus(r[key])
      };
    });

    return {
      id: `p${i}`,
      name: r['Проект'] ?? '',
      owner: r['Владелец'] ?? '',
      stages: stages,
    };
  });

  const tasks: Task[] = data.tasks.map((r, i) => ({
    id: `t${i}`,
    title: r['Задача'] ?? '',
    project: r['Проект'] ?? '',
    owner: r['Ответственный'] ?? '',
    dueDate: parseDate(r['Дедлайн']),
    completed: false,
    completedAt: null,
  }));

  const meetings: Meeting[] = data.meetings.map((r, i) => ({
    id: `m${i}`,
    date: parseDate(r['Дата']),
    timeMsk: r['Время'] ?? '',
    topic: r['Тема'] ?? '',
    owner: r['Ответственный'] ?? '',
    vksUrl: r['Ссылка ВКС'] ?? '',
    type: 'meeting',
  }));

  const leads: Lead[] = data.leads.map((r, i) => ({
    id: `l${i}`,
    name: r['Название'] ?? '',
    source: r['Источник'] ?? '',
    stage: r['Стадия'] ?? '',
    score: Number(r['Перспектива'] ?? 1), 
    nextStep: r['Следующий шаг'] ?? '',
    nextStepDate: parseDate(r['Дата шага']) || null,
  }));

  return { projects, tasks, meetings, leads };
}