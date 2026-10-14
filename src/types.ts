export type Status = 'green' | 'yellow' | 'red';

export interface Stage {
  name: string;
  deadline: string;
  accepted: boolean;
  hasBlocker: boolean;
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  stages: Stage[];
}

export interface Task {
  id: string;
  title: string;
  project: string;
  owner: string;
  dueDate: string;
  completed: boolean;
  completedAt: string | null;
}

export type MeetingType =
  | 'meeting'
  | 'project-deadline'
  | 'stage-deadline'
  | 'handover';

export interface Meeting {
  id: string;
  date: string;
  timeMsk: string;
  topic: string;
  owner: string;
  vksUrl: string;
  type: MeetingType;
}

export interface Lead {
  id: string;
  name: string;
  source: string;
  stage: string;
  score: number;
  nextStep: string;
  nextStepDate: string | null;
}