import type { Project, Task, Meeting, Lead, MeetingType } from '../types';
import type { RawData } from './sheets';

function safeMeetingType(s: string): MeetingType {
  if (s === 'meeting' || s === 'project-deadline' || s === 'stage-deadline' || s === 'handover') return s;
  return 'meeting';
}

function formatDateStr(val: string): string {
  if (!val) return '';
  const s = String(val).trim();
  const match = s.match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})$/);
  if (match) {
    return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  }
  return s; 
}

export function normalize(data: RawData) {
  const projects: Project[] = data.projects.map(r => ({
    id: r.id || r['ID'] || '',
    name: r.name || r['Название'] || r['Имя'] || r['Проект'] || '',
    owner: r.owner || r['Ответственный'] || r['Владелец'] || '',
    status: r.status || r['Статус'] || 'По графику',
    stages: [],
  }));

  const tasks: Task[] = data.tasks.map(r => {
    const rawDate = r.dueDate || r['Дедлайн'] || r['Дата'] || r['Срок'] || '';
    return {
      id: r.id || r['ID'] || '',
      title: r.title || r['Задача'] || r['Название'] || '',
      project: r.project || r['Проект'] || '',
      owner: r.owner || r['Ответственный'] || r['Исполнитель'] || '',
      dueDate: formatDateStr(rawDate),
      completed: (r.status || r['Статус'] || '').toLowerCase() === 'done' || (r.status || r['Статус'] || '').toLowerCase() === 'выполнено',
      completedAt: null,
    };
  });

  const meetings: Meeting[] = data.meetings.map(r => ({
    id: r.id || r['ID'] || '',
    date: formatDateStr(r.date || r['Дата'] || ''),
    timeMsk: r.timeMsk || r['Время'] || '',
    topic: r.topic || r['Тема'] || r['Название'] || '',
    owner: r.owner || r['Ответственный'] || '',
    vksUrl: r.vksUrl || r['Ссылка'] || r['ВКС'] || '',
    type: safeMeetingType(r.type || r['Тип'] || ''),
  }));

  const leads: Lead[] = data.leads.map(r => ({
    id: r.id || r['ID'] || '',
    name: r.name || r['Название'] || r['Имя'] || '',
    source: r.source || r['Источник'] || '',
    stage: r.stage || r['Стадия'] || '',
    // ДОБАВИЛ 'Перспектива' в поиск рейтинга
    score: Number(r.score || r['Оценка'] || r['Рейтинг'] || r['Перспектива'] || 0),
    nextStep: r.nextStep || r['Следующий шаг'] || r['Шаг'] || '',
    nextStepDate: r.nextStepDate || r['Дата шага'] || null,
  }));

  return { projects, tasks, meetings, leads };
}