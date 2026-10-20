import Papa from 'papaparse';

const SHEET_ID = '1oWJHNa1ilkkYYGxiZuiqhCqHDoOIGmue5FTuCF3QKjo';
const API_KEY = "AIzaSyAGkKeez1jbn1TiRPT3Lv7ejAmfCYi8VBg";

function csvUrl(sheet: string): string {
  return `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/` +
          `${encodeURIComponent(sheet)}?key=${API_KEY}`;
}

async function fetchSheet(sheet: string): Promise<Record<string, string>[]> {
  const res = await fetch(csvUrl(sheet)).then(r => {
    if (!r.ok) throw new Error(`Ошибка загрузки листа ${sheet}: ${r.status}`);
    return r.json()
  });
  return res.values
}

export interface RawData {
  projects: Record<string, string>[];
  stages: Record<string, string>[];
  tasks: Record<string, string>[];
  meetings: Record<string, string>[];
  leads: Record<string, string>[];
}

export async function fetchAllSheets(): Promise<RawData> {
  const response = await Promise.all([
    fetchSheet('Проекты'),
    fetchSheet('Встречи'),
    fetchSheet('Задачи'),
    fetchSheet('Потенциальные'),
    // fetchSheet('Leads'),
    // []
    ]);
  return response
  // return { projects, stages, tasks, meetings, leads };
}