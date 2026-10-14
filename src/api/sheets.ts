import Papa from 'papaparse';

const SHEET_ID = '11ke4pXeso3pRAmFwSh23XuJIAtXyj7SwDG8jgig3JKw';

function csvUrl(sheet: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheet}`;
}

async function fetchSheet(sheet: string): Promise<Record<string, string>[]> {
  const res = await fetch(csvUrl(sheet));
  if (!res.ok) throw new Error(`Ошибка загрузки листа ${sheet}: ${res.status}`);
  const text = await res.text();
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed.data;
}

export interface RawData {
  projects: Record<string, string>[];
  stages: Record<string, string>[];
  tasks: Record<string, string>[];
  meetings: Record<string, string>[];
  leads: Record<string, string>[];
}

export async function fetchAllSheets(): Promise<RawData> {
  const [projects, stages, tasks, meetings, leads] = await Promise.all([
    fetchSheet('Projects'),
    fetchSheet('Stages'),
    fetchSheet('Tasks'),
    fetchSheet('Meetings'),
    fetchSheet('Leads'),
  ]);
  return { projects, stages, tasks, meetings, leads };
}