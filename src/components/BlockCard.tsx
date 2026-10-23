import type { ReactNode } from 'react';

interface BlockCardProps {
  title: string;
  count: number;
  generatedAt: string;
  onRefresh: () => void;
  isLoading?: boolean;
  children: ReactNode;
}

export function BlockCard({ title, count, generatedAt, onRefresh, isLoading, children }: BlockCardProps) {
  return (
    <section className="min-w-0 rounded-xl border p-[18px] flex flex-col h-full transition-colors bg-white border-[#e7edf4] shadow-[0_3px_12px_rgba(42,76,115,0.045)] dark:bg-[#121214] dark:border-[#27272a] dark:shadow-lg dark:shadow-black/20">
      <header className="flex items-center justify-between mb-4 pb-3 border-b border-[#edf2f7] dark:border-[#27272a]">
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-bold text-[#2e4057] dark:text-zinc-100">
            {title}
          </h2>
          <span className="text-[11px] font-semibold text-[#1e88e5] bg-[#e3f2fd] dark:text-purple-400 dark:bg-purple-950/40 px-1.5 py-0.5 rounded">
            {count}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#94a3b8] dark:text-zinc-500">
            на {generatedAt}
          </span>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="text-[12px] font-bold text-[#1a73e8] hover:text-[#1557b0] dark:text-purple-400 dark:hover:text-purple-300 transition disabled:opacity-50"
          >
            {isLoading ? 'Обновление…' : 'Обновить'}
          </button>
        </div>
      </header>
      <div className="flex-1 min-w-0">{children}</div>
    </section>
  );
}