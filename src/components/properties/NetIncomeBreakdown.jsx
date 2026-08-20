import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function NetIncomeBreakdown({ property }) {
  const rent = property.monthly_rent || 0;
  const ownership = property.ownership_percentage || 100;
  const condoFee = property.condo_fee || 0;
  const monthlyCosts = property.monthly_costs || 0;
  const mortgage = property.mortgage_payment || 0;

  // Entrate mensili
  const monthlyIncome = rent + condoFee;
  const annualIncome = monthlyIncome * 12;

  // Uscite annuali
  const annualTax = rent * 12 * (property.tax_rate || 0) / 100 * ownership / 100;
  const annualCosts = monthlyCosts * 12;
  const annualMortgage = mortgage * 12;
  const totalAnnualExpenses = annualTax + annualCosts + annualMortgage;

  // Rendita netta
  const annualNet = annualIncome - totalAnnualExpenses;
  const monthlyNet = annualNet / 12;
  const fmt = (n) => '€ ' + n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"><TrendingUp size={14} /> Entrate mensili</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">Canone di affitto</span><span className="font-semibold text-slate-900 dark:text-slate-100">{fmt(rent)}</span></div>
        <div className="flex items-center justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">Quota condominiale</span><span className="font-semibold text-slate-900 dark:text-slate-100">{fmt(condoFee)}</span></div>
        {ownership < 100 && <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500"><span>Quota di proprietà ({ownership}%)</span><span>{fmt(rent * ownership / 100 + condoFee * ownership / 100)}</span></div>}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-1.5 text-sm"><span className="font-semibold text-slate-600 dark:text-slate-400">Totale entrate</span><span className="font-bold text-slate-900 dark:text-slate-100">{fmt(monthlyIncome)} /mese</span></div>
      </div>
    </div>
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400"><TrendingDown size={14} /> Uscite annuali</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">Tasse ({property.tax_rate || 0}% cedolare)</span><span className="font-semibold text-slate-900 dark:text-slate-100">{fmt(annualTax)}</span></div>
        <div className="flex items-center justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">Costi e spese</span><span className="font-semibold text-slate-900 dark:text-slate-100">{fmt(annualCosts)}</span></div>
        {mortgage > 0 && <div className="flex items-center justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">Mutuo (12 rate)</span><span className="font-semibold text-slate-900 dark:text-slate-100">{fmt(annualMortgage)}</span></div>}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-1.5 text-sm"><span className="font-semibold text-slate-600 dark:text-slate-400">Totale uscite</span><span className="font-bold text-slate-900 dark:text-slate-100">{fmt(totalAnnualExpenses)} /anno</span></div>
      </div>
    </div>
    <div className="rounded-lg bg-white dark:bg-slate-900 p-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Wallet size={18} className="text-teal-600 dark:text-teal-400" /><span className="font-bold text-slate-900 dark:text-slate-100">Rendita netta</span></div>
        <span className={`text-lg font-bold ${monthlyNet >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{fmt(monthlyNet)} /mese</span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 text-sm">
        <span className="text-slate-500 dark:text-slate-400">Rendita annua netta</span>
        <span className={`font-semibold ${annualNet >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>{fmt(annualNet)}</span>
      </div>
    </div>
  </div>;
}