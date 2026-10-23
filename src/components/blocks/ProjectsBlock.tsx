import type { Project } from '../../types';

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
    <div className="flex flex-col w-full min-w-0">
      <ul className="flex flex-col w-full min-w-0">
        {visible.map((p, idx) => {
          const isRed = p.status?.toLowerCase().includes('просроч') || p.status?.toLowerCase().includes('red');
          const isYellow = p.status?.toLowerCase().includes('рассмотр') || p.status?.toLowerCase().includes('yellow');
          
          let badgeStyle = 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30';
          let badgeLabel = p.status || 'По графику';

          if (isRed) {
            badgeStyle = 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30';
          } else if (isYellow) {
            badgeStyle = 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
          }

          return (
            <li key={p.id || idx} className="py-3 border-b border-[#eef2f7] dark:border-[#27272a] last:border-0 w-full min-w-0 overflow-hidden">
              <div className="flex items-start justify-between gap-3 w-full min-w-0">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#eaf2ff] text-[#3b82f6] dark:bg-zinc-900 dark:text-purple-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2.5" /><path d="M3 9h18M9 21V9" /></svg>
                  </div>
                  
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="text-[14px] sm:text-[15px] font-bold text-[#0f172a] dark:text-zinc-100 truncate">
                      {p.name}
                    </div>
                    <div className="text-[12px] text-[#94a3b8] dark:text-zinc-500 truncate mt-0.5">
                      {p.owner || '— без ответственного'}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${badgeStyle}`}>
                    {badgeLabel}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}