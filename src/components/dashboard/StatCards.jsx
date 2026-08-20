import { Building2, CircleDollarSign, Wallet, TrendingUp } from 'lucide-react';

export default function StatCards({ properties, expenses }) {
  const canone = properties.reduce((s, p) => s + (p.monthly_rent || 0), 0);
  const condo = properties.reduce((s, p) => s + (p.condo_fee || 0), 0);
  const annualTaxes = properties.reduce((s, p) => s + (p.monthly_rent || 0) * 12 * (p.tax_rate || 0) / 100 * (p.ownership_percentage || 100) / 100, 0);
  const annualExpenses = expenses.filter((e) => e.recurring).reduce((s, e) => s + (e.amount || 0) * (e.frequency === 'mensile' ? 12 : e.frequency === 'trimestrale' ? 4 : 1), 0);
  const annualMortgage = properties.reduce((s, p) => s + (p.mortgage_payment || 0) * 12, 0);
  const monthlyIncome = canone + condo;
  const annualOut = annualTaxes + annualExpenses + annualMortgage;
  const net = (monthlyIncome * 12 - annualOut) / 12;
  const items = [
    { label: 'Immobili', value: properties.length, icon: Building2, accent: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950' },
    { label: 'Canone lordo /mese', value: `€ ${canone.toLocaleString('it-IT')}`, icon: CircleDollarSign, accent: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950' },
    { label: 'Spese /mese', value: `€ ${Math.round(annualOut / 12).toLocaleString('it-IT')}`, icon: Wallet, accent: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950' },
    { label: 'Netto cassa /mese', value: `€ ${net.toLocaleString('it-IT')}`, icon: TrendingUp, accent: net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400', bg: net >= 0 ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-rose-50 dark:bg-rose-950' },
  ];
  return <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">{items.map(({ label, value, icon: Icon, accent, bg }) => <div key={label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}><Icon size={18} className={accent} /></div><p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">{value}</p></div>)}</section>;
}