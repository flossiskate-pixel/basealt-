import { useEffect, useState } from 'react';
import { BlockCard } from './components/BlockCard';
import { ThemeToggle } from './components/ThemeToggle';
import { ProjectsBlock } from './components/blocks/ProjectsBlock';
import { TasksBlock } from './components/blocks/TasksBlock';
import { CalendarBlock } from './components/blocks/CalendarBlock';
import { LeadsBlock } from './components/blocks/LeadsBlock';
import { fetchAllSheets } from './api/sheets';
import { normalize } from './api/normalize';
import { countWeekTasks } from './domain/tasks';
import { applySheet } from './api/applySheet';

export default function App() {
  const [data, setData] = useState<ReturnType<typeof applySheet> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await fetchAllSheets();
      setData(applySheet(raw, {}));
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const generatedAt = new Date().toLocaleDateString('ru-RU', {
    timeZone: 'Europe/Moscow',
  });

  const projects = data?.projects ?? [];
  const tasks = data?.tasks ?? [];
  const meetings = data?.events ?? [];
  const leads = data?.potential ?? [];

  console.log({data, leads })
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Дашборд
        </h1>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
        <BlockCard
          title="Главные проекты"
          count={Math.min(projects.length, 10)}
          generatedAt={generatedAt}
          onRefresh={load}
        >
          <ProjectsBlock projects={projects} isLoading={isLoading} error={error} />
        </BlockCard>

        <BlockCard
          title="Задачи на неделю"
          count={Math.min(countWeekTasks(tasks), 10)}
          generatedAt={generatedAt}
          onRefresh={load}
        >
          <TasksBlock tasks={tasks} isLoading={isLoading} error={error} />
        </BlockCard>

        <BlockCard
          title="Календарь"
          count={meetings.length}
          generatedAt={generatedAt}
          onRefresh={load}
        >
          <CalendarBlock meetings={meetings} isLoading={isLoading} error={error} />
        </BlockCard>

        <BlockCard
          title="Потенциальные проекты"
          count={Math.min(leads.length, 10)}
          generatedAt={generatedAt}
          onRefresh={load}
        >
          <LeadsBlock leads={leads} isLoading={isLoading} error={error} />
        </BlockCard>
      </div>
    </main>
  );
}