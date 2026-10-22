import type { Project, StageStatus, Status } from '../../types';
import { projectStatus } from '../../domain/status';

const COLORS: Record<StageStatus, string> = {
  ok: 'bg-emerald-500',
  risk: 'bg-amber-500',
  fail: 'bg-rose-500',
  plan: 'bg-zinc-300 dark:bg-zinc-700',
};

const STATUS_LABELS: Record<Status, { label: string, style: string }> = {
  green: { label: 'По графику', style: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border dark:border-emerald-900/50' },
  yellow: { label: 'На рассмотрении', style: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 dark:border dark:border-amber-900/50' },
  red: { label: 'Просрочено', style: 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30 dark:border dark:border-rose-900/50' },
};

const ICONS = [
  <svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2.5" /><path d="M3 9h18M9 21V9" /></svg>,
  <svg key="2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2.5" /><line x1="11" y1="18" x2="13" y2="18" /></svg>,
  <svg key="3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3 L21 12 L12 21 L3 12 Z" /><path d="M12 8 L16 12 L12 16 L8 12 Z" /></svg>
];

function getInitials(name: string): string {
  if (!name) return '—';
  const parts = name.replace(/\./g, ' ').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

interface Props {
  projects: Project[];
  isLoading?: boolean;
  error?: string | null;
}

export function ProjectsBlock({ projects, isLoading, error }: Props) {
  if (isLoading) return <div className="h-20 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse" />;
  if (error) return <div className="text-rose-500 dark:text-rose-400 p-3 text-sm">{error}</div>;
  if (projects.length === 0) return <p className="text-slate-400 dark:text-zinc-500 text-sm py-4">Нет проектов</p>;

  const visible = projects.slice(0, 10);

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col gap-1">
        {visible.map((p, idx) => {
          const status = projectStatus(p);
          const badge = STATUS_LABELS[status];
          
          // Считаем прогресс как долю зеленых этапов
          const okCount = p.stages.filter(s => s.status === 'ok').length;
          const progress = Math.round((okCount / (p.stages.length || 1)) * 100);

          return (
            <li key={p.id} className="py-2.5 border-b border-[#eef2f7] dark:border-[#27272a] last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-[#eaf2ff] text-[#3b82f6] dark:bg-zinc-900 dark:border dark:border-zinc-800 dark:text-purple-400">
                  {ICONS[idx % 3]}
                </div>
                
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-[13px] font-bold text-[#0f172a] dark:text-zinc-100 truncate">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-[#94a3b8] dark:text-zinc-500 mt-0.5 truncate">
                    {p.owner || '— без ответственного'}
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  <span className={`text-[10.5px] font-medium px-2 py-0.5 rounded-full ${badge.style}`}>
                    {badge.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2.5 pl-11">
                <div className="flex-1 min-w-0 max-w-[100px]">
                  <div className="flex gap-1 w-full h-[4px]">
                    <div className="rounded-full bg-[#2563eb] dark:bg-purple-500 transition-all" style={{ width: `${progress}%` }} />
                    <div className="rounded-full bg-[#e8eef5] dark:bg-zinc-800 flex-1" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#0f172a] dark:text-zinc-300 shrink-0 w-7">
                  {progress}%
                </span>

                <div className="flex gap-1 flex-1 ml-2" title="Этапы проекта">
                  {p.stages.map((s, i) => (
                    <div
                      key={i}
                      title={`${s.name}: ${s.status}`}
                      className={`h-1 flex-1 rounded-full ${COLORS[s.status]}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <div className="w-5 h-5 rounded-full bg-[#e8f0fe] text-[#1a73e8] dark:bg-zinc-800 dark:border dark:border-zinc-700 dark:text-zinc-300 flex items-center justify-center text-[9px] font-bold">
                    {getInitials(p.owner)}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}