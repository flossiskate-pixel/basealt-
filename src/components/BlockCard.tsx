interface BlockCardProps {
  title: string;
  count: number;
  generatedAt: string;
  children?: React.ReactNode;
}

export function BlockCard({ title, count, generatedAt, children }: BlockCardProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-4 flex flex-col min-h-[300px]">
      <header className="flex justify-between items-baseline mb-3 border-b border-slate-200 pb-2">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <span className="text-xs text-slate-500">
          {count} · на {generatedAt}
        </span>
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}