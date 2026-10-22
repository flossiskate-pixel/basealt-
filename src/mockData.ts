import type { Project, Task, Meeting, Lead } from './types';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Базальт СПО',
    owner: 'Иванов И.И.',
    st: [
      { name: 'Аналитика',   deadline: '2026-10-01', accepted: true,  hasBlocker: false },
      { name: 'Прототип',    deadline: '2026-10-09', accepted: false, hasBlocker: false },
      { name: 'Разработка',  deadline: '2026-10-20', accepted: false, hasBlocker: false },
      { name: 'Тесты',       deadline: '2026-10-28', accepted: false, hasBlocker: false },
      { name: 'Сдача',       deadline: '2026-11-05', accepted: false, hasBlocker: false },
    ],
  },
  {
    id: 'p2',
    name: 'Микро-ЭВМ',
    owner: 'Петров П.П.',
    st: [
      { name: 'Аналитика',   deadline: '2026-10-05', accepted: true,  hasBlocker: false },
      { name: 'Прототип',    deadline: '2026-10-07', accepted: false, hasBlocker: false },
      { name: 'Разработка',  deadline: '2026-10-15', accepted: false, hasBlocker: false },
      { name: 'Тесты',       deadline: '2026-10-25', accepted: false, hasBlocker: false },
      { name: 'Сдача',       deadline: '2026-11-01', accepted: false, hasBlocker: false },
    ],
  },
  {
    id: 'p3',
    name: 'Пилот с X',
    owner: '',
    st: [
      { name: 'Аналитика',   deadline: '2026-09-28', accepted: true,  hasBlocker: false },
      { name: 'Прототип',    deadline: '2026-10-03', accepted: false, hasBlocker: true  },
      { name: 'Разработка',  deadline: '2026-10-12', accepted: false, hasBlocker: false },
      { name: 'Тесты',       deadline: '2026-10-22', accepted: false, hasBlocker: false },
      { name: 'Сдача',       deadline: '2026-10-30', accepted: false, hasBlocker: false },
    ],
  },
];

export const mockTasks: Task[] = [
  { id: 't1', title: 'Согласовать ТЗ',     project: 'Базальт СПО', owner: 'Иванов И.И.',  due: '2026-10-03', completed: false, completedAt: null },
  { id: 't2', title: 'Отправить прототип', project: 'Микро-ЭВМ',  owner: 'Петров П.П.',  due: '2026-10-07', completed: false, completedAt: null },
  { id: 't3', title: 'Ответить клиенту',   project: 'Пилот с X',   owner: 'Сидоров С.С.', due: '2026-10-08', completed: false, completedAt: null },
  { id: 't4', title: 'Собрать метрики',    project: 'Базальт СПО', owner: 'Иванов И.И.',  due: '2026-10-05', completed: true,  completedAt: '2026-10-05' },
  { id: 't5', title: 'Позвонить в X',      project: 'Пилот с X',   owner: '',             due: '2026-10-09', completed: false, completedAt: null },
];

export const mockMeetings: Meeting[] = [
  { id: 'm1',  date: '2026-10-06', time: '10:00', title: 'Синк по проектам',    owner: 'Иванов И.И.',  link: 'https://meet.example.com/1', type: 'meeting' },
  { id: 'm2',  date: '2026-10-06', time: '15:00', title: 'Демо прототипа',      owner: 'Петров П.П.',  link: 'https://meet.example.com/2', type: 'meeting' },
  { id: 'm3',  date: '2026-10-08', time: '11:00', title: 'Согласование ТЗ',     owner: 'Иванов И.И.',  link: 'https://meet.example.com/3', type: 'meeting' },
  { id: 'm4',  date: '2026-10-09', time: '',      title: 'Дедлайн: прототип',   owner: 'Иванов И.И.',  link: '', type: 'stage-deadline' },
  { id: 'm5',  date: '2026-10-12', time: '14:00', title: 'Ревью архитектуры',   owner: 'Петров П.П.',  link: 'https://meet.example.com/4', type: 'meeting' },
  { id: 'm6',  date: '2026-10-15', time: '',      title: 'Дедлайн: разработка', owner: 'Петров П.П.',  link: '', type: 'stage-deadline' },
  { id: 'm7',  date: '2026-10-20', time: '16:00', title: 'Демо для заказчика',  owner: 'Иванов И.И.',  link: 'https://meet.example.com/5', type: 'meeting' },
  { id: 'm8',  date: '2026-10-28', time: '',      title: 'Дедлайн: тесты',      owner: 'Сидоров С.С.', link: '', type: 'stage-deadline' },
  { id: 'm9',  date: '2026-11-05', time: '',      title: 'Сдача Базальт СПО',   owner: 'Иванов И.И.',  link: '', type: 'handover' },
  { id: 'm10', date: '2026-11-10', time: '12:00', title: 'Планирование ноября', owner: 'Иванов И.И.',  link: 'https://meet.example.com/6', type: 'meeting' },
];

export const mockLeads: Lead[] = [
  {
    id: 'l1',
    name: 'Клиент А (промышленность)',
    source: 'Рекомендация',
    stage: 'Обсуждение',
    score: 4,
    next: 'Отправить КП',
    nextStepDate: '2026-10-10',
  },
  {
    id: 'l2',
    name: 'Клиент Б (ритейл)',
    source: 'Холодный лид',
    stage: 'Первый контакт',
    score: 2,
    next: '',                // ← пусто, подсветится
    nextStepDate: null,
  },
  {
    id: 'l3',
    name: 'Клиент В (госсектор)',
    source: 'Тендер',
    stage: 'Оценка',
    score: 5,
    next: 'Согласовать пилот',
    nextStepDate: '2026-10-14',
  },
  {
    id: 'l4',
    name: 'Клиент Г (образование)',
    source: 'Конференция',
    stage: 'Пилот',
    score: 3,
    next: 'Запустить пилот на 2 недели',
    nextStepDate: '2026-10-18',
  },
  {
    id: 'l5',
    name: 'Клиент Д (медицина)',
    source: 'Сайт',
    stage: 'Первый контакт',
    score: 3,
    next: '',                // ← пусто, подсветится
    nextStepDate: null,
  },
];