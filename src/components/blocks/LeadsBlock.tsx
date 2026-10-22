import type { Lead } from '../../types';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

interface Props {
  leads: Lead[];
  isLoading?: boolean;
  error?: string | null;
}

export function LeadsBlock({ leads, isLoading, error }: Props) {
  if (isLoading) return <div className="h-20 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse" />;
  if (error) return <div className="text-rose-500 dark:text-rose-400 p-3 text-sm">{error}</div>;
  if (leads.length === 0) return <p className="text-slate-400 dark:text-zinc-500 text-sm py-4">Нет лидов</p>;

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col">
        {leads.slice(0, 10).map(lead => {
          const safeNextStep = String(lead.nextStep ?? '');
          const hasNextStep = safeNextStep.trim().length > 0;
          
          return (
            <li key={lead.id} className="py-2.5 border-b border-[#f1f5f9] dark:border-[#27272a] last:border-0">
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-[12.5px] text-[#0f172a] dark:text-zinc-200">
                  {String(lead.name || 'Без названия')}
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < Number(lead.score) ? '#fbbf24' : 'none'} stroke={i < Number(lead.score) ? '#fbbf24' : 'currentColor'} className={i < Number(lead.score) ? '' : 'text-[#cbd5e1] dark:text-zinc-600'} strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="text-[10.5px] text-[#94a3b8] dark:text-zinc-500 mt-1 flex items-center gap-2">
                <span>📥 {String(lead.source || '—')}</span>
                <span>⚙ {String(lead.stage || '—')}</span>
                <span className="ml-auto">{lead.nextStepDate && formatDate(lead.nextStepDate)}</span>
              </div>

              <div className="mt-1.5">
                {hasNextStep ? (
                  <div className="text-[11px] text-[#1e293b] dark:text-zinc-400">
                    <span className="text-[#1a73e8] dark:text-purple-400 font-medium mr-1">Следующий шаг:</span>
                    {safeNextStep}
                  </div>
                ) : (
                  <div className="text-[10px] bg-[#fef7e0] text-[#b06000] dark:bg-amber-950/30 dark:text-amber-400 dark:border dark:border-amber-900/50 px-2 py-0.5 rounded inline-block">
                    ⚠ Следующий шаг не задан
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}