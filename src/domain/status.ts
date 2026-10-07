import type { Stage, Status, Project } from '../types';

const MSK = 'Europe/Moscow';

export function todayMsk(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: MSK });
}

function daysBetween(from: string, to: string): number {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function stageStatus(stage: Stage, owner: string): Status {
  if (stage.hasBlocker) return 'red';
  const days = daysBetween(todayMsk(), stage.deadline);
  if (days < 0) return 'red';
  if (days <= 3 || !owner) return 'yellow';
  return 'green';
}

const RANK: Record<Status, number> = { green: 0, yellow: 1, red: 2 };

export function projectStatus(project: Project): Status {
  const statuses = project.stages.map(s => stageStatus(s, project.owner));
  return statuses.reduce((a, b) => (RANK[a] >= RANK[b] ? a : b), 'green' as Status);
}