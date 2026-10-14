import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Переключить тему"
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}