import type { ReactNode } from 'react';

interface BlockCardProps {
  title: string;
  count: number;
  generatedAt: string;
  onRefresh: () => void;
  isLoading?: boolean;
  children: ReactNode;
  noScroll?: boolean; // Новый параметр
}

export function BlockCard({ title, count, generatedAt, onRefresh, isLoading, children, noScroll }: BlockCardProps) {
  return (
    <section className="w-full min-w-0 rounded-xl border p-4 md:p-5 flex flex-col h-full transition-colors bg-white border-[#e7edf4] shadow-sm dark:bg-[#121214] dark:border-[#27272a]">
      <header className="flex items-center justify-between mb-4 pb-3 border-b border-[#edf2f7] dark:border-[#27272a] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-[16px] font-bold text-[#2e4057] dark:text-zinc-100 truncate">
            {title}
          </h2>
          <span className="text-[12px] font-semibold text-[#1e88e5] bg-[#e3f2fd] dark:text-purple-400 dark:bg-purple-950/40 px-2 py-0.5 rounded shrink-0">
            {count}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[12px] text-[#94a3b8] dark:text-zinc-500 hidden sm:inline-block">
            на {generatedAt}
          </span>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="text-[13px] font-bold text-[#1a73e8] hover:text-[#1557b0] dark:text-purple-400 dark:hover:text-purple-300 transition disabled:opacity-50 whitespace-nowrap"
          >
            {isLoading ? 'Обновление…' : 'Обновить'}
          </button>
        </div>
      </header>
      
      {/* Если noScroll = true, убираем max-h и overflow-y-auto */}
      <div className={`flex-1 w-full min-w-0 ${noScroll ? '' : 'max-h-[420px] overflow-y-auto pr-1 custom-scrollbar'}`}>
        {children}
      </div>
    </section>
  );
}