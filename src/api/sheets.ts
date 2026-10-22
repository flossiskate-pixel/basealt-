const SHEET_ID = '1oWJHNa1ilkkYYGxiZuiqhCqHDoOIGmue5FTuCF3QKjo';
const API_KEY = "AIzaSyAGkKeez1jbn1TiRPT3Lv7ejAmfCYi8VBg";

function csvUrl(sheet: string): string {
  return `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/` +
          `${encodeURIComponent(sheet)}?key=${API_KEY}`;
}

async function fetchSheet(sheet: string): Promise<Record<string, string>[]> {
  const res = await fetch(csvUrl(sheet));
  if (!res.ok) {
    throw new Error(`Ошибка загрузки листа ${sheet}: ${res.status}`);
  }
  
  const json = await res.json();
  const rows = json.values || [];
  
  if (rows.length === 0) return [];

  // Первая строка — это заголовки (id, name, owner и т.д.)
  const headers = rows[0];

  // Остальные строки превращаем в объекты, чтобы normalize.ts их понял
  const data = rows.slice(1).map((row: any[]) => {
    const obj: Record<string, string> = {};
    headers.forEach((header: string, index: number) => {
      // Если ячейка пустая, ставим пустую строку
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
  // ВАЖНО: я добавил 'Этапы'. Если в новой таблице лист называется иначе 
  // (например, 'Stages'), поменяй название здесь!
  const [projects, stages, tasks, meetings, leads] = await Promise.all([
    fetchSheet('Проекты'),
    fetchSheet('Этапы'), 
    fetchSheet('Задачи'),
    fetchSheet('Встречи'),
    fetchSheet('Потенциальные'),
  ]);

  // Возвращаем объект, как того ждет normalize.ts
  return { projects, stages, tasks, meetings, leads };
}