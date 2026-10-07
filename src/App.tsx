import { BlockCard } from './components/BlockCard';
import { ProjectsBlock } from './components/blocks/ProjectsBlock';
import { TasksBlock } from './components/blocks/TasksBlock';
import { CalendarBlock } from './components/blocks/CalendarBlock';
import { LeadsBlock } from './components/blocks/LeadsBlock';
import { mockProjects, mockTasks, mockMeetings, mockLeads } from './mockData';

export default function App() {
  const generatedAt = '06.10.2026';

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Дашборд</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
        <BlockCard
          title="Главные проекты"
          count={Math.min(mockProjects.length, 10)}
          generatedAt={generatedAt}
        >
          <ProjectsBlock projects={mockProjects} />
        </BlockCard>

        <BlockCard
          title="Задачи на неделю"
          count={Math.min(mockTasks.length, 10)}
          generatedAt={generatedAt}
        >
          <TasksBlock tasks={mockTasks} />
        </BlockCard>

        <BlockCard
          title="Календарь"
          count={mockMeetings.length}
          generatedAt={generatedAt}
        >
          <CalendarBlock meetings={mockMeetings} />
        </BlockCard>

        <BlockCard
          title="Потенциальные проекты"
          count={Math.min(mockLeads.length, 10)}
          generatedAt={generatedAt}
        >
          <LeadsBlock leads={mockLeads} />
        </BlockCard>
      </div>
    </main>
  );
}