import { useState, type ReactNode } from 'react';

interface BlockCardProps {
  title: string;
  count: number;
  generatedAt: string;
  onRefresh?: () => void;
  children?: ReactNode;
}

export function BlockCard({ title, count, generatedAt, onRefresh, children }: BlockCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  function handleRefresh() {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-4 flex flex-col min-h-[300px] dark:bg-slate-900 dark:shadow-none dark:border dark:border-slate-800">
      <header className="flex justify-between items-baseline mb-3 border-b border-slate-200 pb-2 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {count} · на {generatedAt}
          </span>
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline dark:text-blue-400 dark:disabled:text-slate-600"
            >
              {isRefreshing ? 'Обновление…' : 'Обновить'}
            </button>
          )}
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}