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
    <section className="bg-white rounded-xl shadow-sm p-4 flex flex-col min-h-[300px]">
      <header className="flex justify-between items-baseline mb-3 border-b border-slate-200 pb-2">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {count} · на {generatedAt}
          </span>
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline"
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