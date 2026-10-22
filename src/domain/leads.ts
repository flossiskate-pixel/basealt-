import type { Lead } from '../types';

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

export interface LeadRow {
  lead: Lead;
  hasNextStep: boolean;   // есть ли следующий шаг
}

export function prepareLeads(leads: Lead[], max = 10) {
  const rows: LeadRow[] = leads.map(lead => ({
    lead,
    // Исправлено: next -> nextStep
    hasNextStep: String(lead.nextStep ?? '').trim().length > 0,
  }));

  // Сначала те, у кого нет следующего шага — их легко потерять
  rows.sort((a, b) => {
    if (a.hasNextStep !== b.hasNextStep) return a.hasNextStep ? 1 : -1;
    // Потом по дате следующего шага
    const aDate = a.lead.nextStepDate ?? '9999-12-31';
    const bDate = b.lead.nextStepDate ?? '9999-12-31';
    return aDate.localeCompare(bDate);
  });

  return {
    visible: rows.slice(0, max),
    rest: Math.max(0, rows.length - max),
    total: rows.length,
  };
}