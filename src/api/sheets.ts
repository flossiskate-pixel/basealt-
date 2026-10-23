const SHEET_ID = '1KK3lJlHdCvAgjXtD_9icfTfkaMDL8mt5LtvfWGt4Xrg';
const API_KEY = "AIzaSyAGkKeez1jbn1TiRPT3Lv7ejAmfCYi8VBg";

async function fetchSheet(sheet: string): Promise<Record<string, string>[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheet)}?key=${API_KEY}`;
  const res = await fetch(url);
  
  if (!res.ok) {
    console.warn(`⚠️ Ошибка загрузки листа "${sheet}": ${res.status}`);
    return []; 
  }
  
  const json = await res.json();
  const rows = json.values || [];
  if (rows.length === 0) return [];

  const headers = rows[0];

  const data = rows.slice(1).map((row: any[]) => {
    const obj: Record<string, string> = {};
    headers.forEach((header: string, index: number) => {
      // .trim() убирает пробелы в начале и конце заголовка
      obj[header.trim()] = String(row[index] ?? ''); 
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
  const [projects, tasks, meetings, leads] = await Promise.all([
    fetchSheet('Проекты'),
    fetchSheet('Задачи'),
    fetchSheet('Встречи'),
    fetchSheet('Потенциальные'),
  ]);

  return { projects, tasks, meetings, leads };
}