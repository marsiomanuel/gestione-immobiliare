import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, PiggyBank, BarChart3, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AppShell from '@/components/AppShell';
import StyledSelect from '@/components/StyledSelect';
import StickyFilters from '@/components/StickyFilters';
import OwnerFinanceCharts from '@/components/analytics/OwnerFinanceCharts';
import OwnerTimeCharts from '@/components/analytics/OwnerTimeCharts';

const MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const fmtMonth = (ym) => { const [y, m] = ym.split('-'); return `${MONTHS[parseInt(m) - 1]} ${y.slice(2)}`; };

export default function Analytics() {
  const [properties, setProperties] = useState([]), [expenses, setExpenses] = useState([]), [rentPayments, setRentPayments] = useState([]), [owners, setOwners] = useState([]), [loading, setLoading] = useState(true), [ownerFilter, setOwnerFilter] = useState('all');
  useEffect(() => { Promise.all([base44.entities.Property.list('-created_date'), base44.entities.Expense.list('-date', 500), base44.entities.RentPayment.list('-month', 500), base44.entities.Owner.list('-created_date')]).then(([p, e, rp, o]) => { setProperties(p); setExpenses(e); setRentPayments(rp); setOwners(o); }).finally(() => setLoading(false)); }, []);
  const filteredProps = useMemo(() => ownerFilter === 'all' ? properties : properties.filter((p) => p.owner_id === ownerFilter), [properties, ownerFilter]);
  const filteredExpenses = useMemo(() => ownerFilter === 'all' ? expenses : expenses.filter((e) => filteredProps.some((p) => p.id === e.property_id)), [expenses, filteredProps]);
  const filteredRentPayments = useMemo(() => ownerFilter === 'all' ? rentPayments : rentPayments.filter((r) => filteredProps.some((p) => p.id === r.property_id)), [rentPayments, filteredProps]);
  const ownerData = useMemo(() => {
    const map = {};
    const ensure = (oid, name) => { if (!map[oid]) map[oid] = { name: name || 'Senza proprietario', income: 0, expenses: 0 }; };
    filteredProps.forEach((p) => { const oid = p.owner_id || 'unknown'; ensure(oid, p.owner_name); map[oid].income += (p.monthly_rent || 0) * (p.ownership_percentage || 100) / 100; map[oid].expenses += (p.monthly_costs || 0) + (p.mortgage_payment || 0); const tax = (p.monthly_rent || 0) * (p.tax_rate || 0) / 100 * (p.ownership_percentage || 100) / 100; map[oid].expenses += tax; });
    filteredExpenses.forEach((e) => { const prop = properties.find((p) => p.id === e.property_id); const oid = prop?.owner_id || 'unknown'; ensure(oid, prop?.owner_name); map[oid].expenses += (e.amount || 0); });
    return Object.values(map).filter((d) => d.income > 0 || d.expenses > 0);
  }, [filteredProps, filteredExpenses, properties]);
  const timeData = useMemo(() => {
    const map = {};
    const add = (m) => { if (!map[m]) map[m] = { month: m, income: 0, expenses: 0 }; return map[m]; };
    filteredRentPayments.forEach((r) => { const m = r.month?.slice(0, 7); if (m) add(m).income += (r.rent_amount || 0); });
    filteredExpenses.forEach((e) => { const m = e.date?.slice(0, 7); if (m) add(m).expenses += (e.amount || 0); });
    const months = Object.keys(map).sort();
    if (months.length === 0) return [];
    const monthlyPropCosts = filteredProps.reduce((s, p) => { const tax = (p.monthly_rent || 0) * (p.tax_rate || 0) / 100 * (p.ownership_percentage || 100) / 100; return s + (p.monthly_costs || 0) + (p.mortgage_payment || 0) + tax; }, 0);
    let [sy, sm] = months[0].split('-').map(Number), [ey, em] = months[months.length - 1].split('-').map(Number);
    const result = []; let cumulative = 0;
    while (sy < ey || (sy === ey && sm <= em)) {
      const key = `${sy}-${String(sm).padStart(2, '0')}`;
      const d = map[key] || { month: key, income: 0, expenses: 0 };
      d.expenses += monthlyPropCosts;
      cumulative += d.income - d.expenses;
      result.push({ ...d, label: fmtMonth(key), cumulative });
      sm++; if (sm > 12) { sm = 1; sy++; }
    }
    return result;
  }, [filteredRentPayments, filteredExpenses, filteredProps]);
  const totalIncome = ownerData.reduce((s, d) => s + d.income, 0), totalExpenses = ownerData.reduce((s, d) => s + d.expenses, 0), net = totalIncome - totalExpenses;
  return <AppShell>
    <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Analisi</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Grafici per proprietario</h1><p className="mt-2 text-slate-500 dark:text-slate-400">Confronto entrate e uscite nel tempo e per proprietario.</p></div>
    <StickyFilters><StyledSelect value={ownerFilter} onChange={setOwnerFilter} placeholder="Tutti i proprietari" options={[{ value: 'all', label: 'Tutti i proprietari' }, ...owners.map((o) => ({ value: o.id, label: o.name }))]} /></StickyFilters>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400"><TrendingUp size={20} /></div><div><p className="text-sm text-slate-500 dark:text-slate-400">Totale entrate</p><p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">€ {Math.round(totalIncome).toLocaleString('it-IT')}</p></div></div></div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-400"><TrendingDown size={20} /></div><div><p className="text-sm text-slate-500 dark:text-slate-400">Totale uscite</p><p className="text-xl font-bold text-rose-700 dark:text-rose-400">€ {Math.round(totalExpenses).toLocaleString('it-IT')}</p></div></div></div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"><PiggyBank size={20} /></div><div><p className="text-sm text-slate-500 dark:text-slate-400">Saldo netto</p><p className={`text-xl font-bold ${net >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>€ {Math.round(net).toLocaleString('it-IT')}</p></div></div></div>
    </div>
    {loading ? <div className="py-16 text-center text-slate-500 dark:text-slate-400">Caricamento…</div> : (ownerData.length || timeData.length) ? <>
      <div className="mt-10"><div className="mb-4 flex items-center gap-2"><Clock size={18} className="text-slate-700 dark:text-slate-300" /><h2 className="text-xl font-bold">Andamento nel tempo</h2></div><OwnerTimeCharts data={timeData} /></div>
      <div className="mt-10"><div className="mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-slate-700 dark:text-slate-300" /><h2 className="text-xl font-bold">Suddivisione per proprietario</h2></div><OwnerFinanceCharts data={ownerData} /></div>
    </> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-16 text-center"><BarChart3 size={32} className="mx-auto text-slate-300 dark:text-slate-600" /><p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">Nessun dato</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Aggiungi immobili e movimenti per visualizzare i grafici.</p></div>}
  </AppShell>;
}