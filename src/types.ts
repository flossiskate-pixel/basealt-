export type Status = 'green' | 'yellow' | 'red';
export type StageStatus = 'ok' | 'risk' | 'fail' | 'plan';

export interface Stage {
  name: string;
  status: StageStatus;
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
  dueDate: string; // <--- Только dueDate, никаких due
  completed: boolean;
  completedAt: string | null;
}

export type MeetingType = 'meeting' | 'project-deadline' | 'stage-deadline' | 'handover';

export interface Meeting {
  id: string;
  date: string;
  timeMsk: string; // <--- Только timeMsk, никаких time
  topic: string;   // <--- Только topic, никаких title
  owner: string;
  vksUrl: string;  // <--- Только vksUrl, никаких link
  type: MeetingType;
}

export interface Lead {
  id: string;
  name: string;
  source: string;
  stage: string;
  score: number;
  nextStep: string; // <--- Только nextStep, никаких next
  nextStepDate: string | null;
}