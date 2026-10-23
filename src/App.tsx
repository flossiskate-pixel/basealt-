import { useEffect, useState } from 'react';
import { BlockCard } from './components/BlockCard';
import { ThemeToggle } from './components/ThemeToggle';
import { ProjectsBlock } from './components/blocks/ProjectsBlock';
import { TasksBlock } from './components/blocks/TasksBlock';
import { CalendarBlock } from './components/blocks/CalendarBlock';
import { LeadsBlock } from './components/blocks/LeadsBlock';
import { fetchAllSheets } from './api/sheets';
import { normalize } from './api/normalize';
import { countWeekTasks } from './domain/tasks'; // Возвращаем импорт

export default function App() {
  const [data, setData] = useState<ReturnType<typeof normalize> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await fetchAllSheets();
      setData(normalize(raw));
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const generatedAt = new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' });

  const projects = data?.projects ?? [];
  const tasks = data?.tasks ?? [];
  const meetings = data?.meetings ?? [];
  const leads = data?.leads ?? [];

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#09090b] p-4 md:p-6 font-sans transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto">
        
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-[26px] font-bold text-[#0d6efd] dark:text-[#c084fc]">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-px h-6 bg-[#e2e8f0] dark:bg-[#27272a]" />
            <ThemeToggle />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <BlockCard
            title="Главные проекты"
            count={Math.min(projects.length, 10)}
            generatedAt={generatedAt}
            onRefresh={load}
            isLoading={isLoading}
          >
            <ProjectsBlock projects={projects} isLoading={isLoading} error={error} />
          </BlockCard>

          <BlockCard
            title="Задачи на неделю" // Вернули правильное название
            count={Math.min(countWeekTasks(tasks), 10)} // Вернули подсчет только задач текущей недели
            generatedAt={generatedAt}
            onRefresh={load}
            isLoading={isLoading}
          >
            <TasksBlock tasks={tasks} isLoading={isLoading} error={error} />
          </BlockCard>

          <BlockCard
            title="Календарь"
            count={meetings.length}
            generatedAt={generatedAt}
            onRefresh={load}
            isLoading={isLoading}
          >
            <CalendarBlock meetings={meetings} isLoading={isLoading} error={error} />
          </BlockCard>

          <BlockCard
            title="Потенциальные проекты"
            count={Math.min(leads.length, 10)}
            generatedAt={generatedAt}
            onRefresh={load}
            isLoading={isLoading}
          >
            <LeadsBlock leads={leads} isLoading={isLoading} error={error} />
          </BlockCard>
        </div>
      </div>
    </div>
  );
}