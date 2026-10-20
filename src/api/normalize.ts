import type { Project, Stage, Task, Meeting, Lead, MeetingType } from '../types';
import type { RawData } from './sheets';

function parseBool(s: string): boolean {
  const v = (s ?? '').trim().toLowerCase();
  return v === 'true' || v === 'да' || v === '1' || v === 'yes';
}

function safeMeetingType(s: string): MeetingType {
  if (s === 'meeting' || s === 'project-deadline' || s === 'stage-deadline' || s === 'handover') {
    return s;
  }
  return 'meeting';
}

export function normalize(data: RawData) {
  const stagesByProject = new Map<string, Stage[]>();
  for (const r of data.stages) {
    const pid = r.project_id ?? '';
    if (!pid) continue;
    const stage: Stage = {
      name: r.name ?? '',
      deadline: r.deadline ?? '',
      accepted: parseBool(r.accepted ?? ''),
      hasBlocker: parseBool(r.hasBlocker ?? ''),
    };
    if (!stagesByProject.has(pid)) stagesByProject.set(pid, []);
    stagesByProject.get(pid)!.push(stage);
  }

  const projects: Project[] = data.projects.map(r => {
    return ({
    id: r.id ?? '',
    name: r.name ?? '',
    owner: r.owner ?? '',
    stages: stagesByProject.get(r.id ?? '') ?? [],
  })});

  const tasks: Task[] = data.tasks.map(r => ({
    id: r.id ?? '',
    title: r.title ?? '',
    project: r.project ?? '',
    owner: r.owner ?? '',
    dueDate: r.dueDate ?? '',
    completed: (r.status ?? '').toLowerCase() === 'done',
    completedAt: null,
  }));

  const meetings: Meeting[] = data.meetings.map(r => ({
    id: r.id ?? '',
    date: r.date ?? '',
    timeMsk: r.timeMsk ?? '',
    topic: r.topic ?? '',
    owner: r.owner ?? '',
    vksUrl: r.vksUrl ?? '',
    type: safeMeetingType(r.type ?? ''),
  }));

  const leads: Lead[] = data.leads.map(r => ({
    id: r.id ?? '',
    name: r.name ?? '',
    source: r.source ?? '',
    stage: r.stage ?? '',
    score: Number(r.score ?? 0),
    nextStep: r.nextStep ?? '',
    nextStepDate: r.nextStepDate || null,
  }));

  return { projects, tasks, meetings, leads };
}