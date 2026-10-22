const SHEET_ID = '1oWJHNa1ilkkYYGxiZuiqhCqHDoOIGmue5FTuCF3QKjo';
const API_KEY = "AIzaSyAGkKeez1jbn1TiRPT3Lv7ejAmfCYi8VBg";

async function fetchSheet(sheet: string): Promise<Record<string, string>[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheet)}?key=${API_KEY}`;
  const res = await fetch(url);
  
  if (!res.ok) throw new Error(`Ошибка загрузки листа ${sheet}: ${res.status}`);
  
  const json = await res.json();
  const rows = json.values || [];
  
  if (rows.length === 0) return [];

  const headers = rows[0];

  const data = rows.slice(1).map((row: any[]) => {
    const obj: Record<string, string> = {};
    headers.forEach((header: string, index: number) => {
      obj[header] = String(row[index] ?? ''); 
    });
    return obj;
  });

  return data;
}

export interface RawData {
  projects: Record<string, string>[];
  tasks: Record<string, string>[];
  meetings: Record<string, string>[];
  leads: Record<string, string>[];
}

export async function fetchAllSheets(): Promise<RawData> {
  const safeFetch = async (sheetName: string) => {
    try {
      return await fetchSheet(sheetName);
    } catch (e) {
      console.warn(`Ошибка при загрузке листа "${sheetName}":`, e);
      return []; 
    }
  };

  const [projects, tasks, meetings, leads] = await Promise.all([
    safeFetch('Проекты'),
    safeFetch('Задачи'),
    safeFetch('Встречи'),
    safeFetch('Потенциальные'),
  ]);

  return { projects, tasks, meetings, leads };
}