import type { Lead } from '../../types';
import { prepareLeads, formatDate } from '../../domain/leads';

interface Props {
  leads: Lead[];
  isLoading?: boolean;
  error?: string | null;
}

export function LeadsBlock({ leads, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-16 bg-slate-100 rounded animate-pulse dark:bg-slate-800" />
        <div className="h-16 bg-slate-100 rounded animate-pulse dark:bg-slate-800" />
        <div className="h-16 bg-slate-100 rounded animate-pulse dark:bg-slate-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
        Не удалось загрузить: {error}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <p className="text-slate-400 text-sm py-4 dark:text-slate-500">
        Нет потенциальных проектов
      </p>
    );
  }

  const { visible, rest } = prepareLeads(leads);

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
        {visible.map(({ lead, hasNextStep }) => (
          <li key={lead.id} className="py-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-sm text-slate-900 min-w-0 dark:text-slate-100">
                {lead.name}
              </div>
              <div className="shrink-0 text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 dark:bg-slate-800 dark:text-slate-400">
                ★ {lead.score}/5
              </div>
            </div>

            <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 dark:text-slate-400">
              <span>📥 {lead.source}</span>
              <span>⚙ {lead.stage}</span>
            </div>

            {hasNextStep ? (
              <div className="text-xs text-slate-700 mt-1 dark:text-slate-300">
                <span className="text-slate-500 dark:text-slate-400">Следующий шаг: </span>
                {lead.nextStep}
                {lead.nextStepDate && (
                  <span className="text-slate-500 dark:text-slate-400">
                    {' '}· до {formatDate(lead.nextStepDate)}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs mt-1 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded px-2 py-1 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-900">
                ⚠ Следующий шаг не назначен
              </div>
            )}
          </li>
        ))}
      </ul>

      {rest > 0 && (
        <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-100 dark:text-slate-400 dark:border-slate-800">
          ещё {rest}
        </div>
      )}
    </div>
  );
}