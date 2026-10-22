import type { StageStatus, Status, Project } from '../types';

const MSK = 'Europe/Moscow';

export function todayMsk(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: MSK });
}

const RANK: Record<StageStatus, number> = { ok: 0, plan: 1, risk: 2, fail: 3 };

export function projectStatus(project: Project): Status {
  if (project.stages.length === 0) return 'green';
  
  let worst: StageStatus = 'ok';
  for (const stage of project.stages) {
    if (RANK[stage.status] > RANK[worst]) {
      worst = stage.status;
    }
  }
  
  if (worst === 'fail') return 'red';
  if (worst === 'risk') return 'yellow';
  return 'green';
}