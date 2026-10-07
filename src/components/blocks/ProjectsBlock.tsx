import type { Project, Status } from '../../types';
import { stageStatus, projectStatus } from '../../domain/status';

const COLORS: Record<Status, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
};

const MAX_PROJECTS = 10;

interface Props {
  projects: Project[];
  isLoading?: boolean;
  error?: string | null;
}

export function ProjectsBlock({ projects, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-12 bg-slate-100 rounded animate-pulse" />
        <div className="h-12 bg-slate-100 rounded animate-pulse" />
        <div className="h-12 bg-slate-100 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
        Не удалось загрузить: {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return <p className="text-slate-400 text-sm py-4">Нет проектов</p>;
  }

  const visible = projects.slice(0, MAX_PROJECTS);
  const inTime = visible.filter(p => projectStatus(p) === 'green').length;

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
        В графике <b>{inTime}</b> из <b>{visible.length}</b>
      </div>

      <ul className="flex flex-col divide-y divide-slate-100">
        {visible.map(p => {
          const status = projectStatus(p);
          return (
            <li key={p.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-900 truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {p.owner || '— без ответственного'}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full shrink-0 ${COLORS[status]}`} />
              </div>

              <div className="flex gap-1.5 mt-2">
                {p.stages.map((s, i) => (
                  <div
                    key={i}
                    title={`${s.name}: ${s.deadline}`}
                    className={`h-1.5 flex-1 rounded ${COLORS[stageStatus(s, p.owner)]}`}
                  />
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-3 justify-center text-xs text-slate-500 pt-2">
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${COLORS.green}`} />
          в срок
        </span>
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${COLORS.yellow}`} />
          ≤3 дней
        </span>
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${COLORS.red}`} />
          просрочка/блокер
        </span>
      </div>

      {projects.length > MAX_PROJECTS && (
        <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-100">
          ещё {projects.length - MAX_PROJECTS}
        </div>
      )}
    </div>
  );
}