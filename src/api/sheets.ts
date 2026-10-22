const SHEET_ID = '1oWJHNa1ilkkYYGxiZuiqhCqHDoOIGmue5FTuCF3QKjo';
const API_KEY = "AIzaSyAGkKeez1jbn1TiRPT3Lv7ejAmfCYi8VBg";

async function fetchSheet(sheet: string): Promise<Record<string, string>[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheet)}?key=${API_KEY}`;
  const res = await fetch(url);
  
  if (!res.ok) throw new Error(`Ошибка загрузки листа ${sheet}: ${res.status}`);
  
  const json = await res.json();
  const rows = json.values || [];
  
  if (rows.length === 0) return [];

  // Первая строка — это заголовки (id, name, owner и т.д.)
  const headers = rows[0];

  // Остальные строки превращаем в объекты, чтобы normalize.ts их понял
  const data = rows.slice(1).map((row: any[]) => {
    const obj: Record<string, string> = {};
    headers.forEach((header: string, index: number) => {
      obj[header] = row[index] ?? ''; 
    });
    return obj;
  });

  return data;
}

export interface RawData {
  projects: Record<string, string>[];
  stages: Record<string, string>[];
  tasks: Record<string, string>[];
  meetings: Record<string, string>[];
  leads: Record<string, string>[];
}

export async function fetchAllSheets(): Promise<RawData> {
  // Защита: если листа нет, он просто вернет [], и остальные блоки продолжат работать
  const safeFetch = async (sheetName: string) => {
    try {
      return await fetchSheet(sheetName);
    } catch (e) {
      console.warn(`Ошибка при загрузке листа "${sheetName}":`, e);
      return []; 
    }
  };

  const [projects, stages, tasks, meetings, leads] = await Promise.all([
    safeFetch('Проекты'),
    safeFetch('Этапы'), // <-- ВАЖНО: если вкладка называется иначе, напиши тут её точное имя
    safeFetch('Задачи'),
    safeFetch('Встречи'),
    safeFetch('Потенциальные'),
  ]);

  return { projects, stages, tasks, meetings, leads };
}