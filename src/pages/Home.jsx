import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AppShell from '@/components/AppShell';
import StyledSelect from '@/components/StyledSelect';
import StickyFilters from '@/components/StickyFilters';
import StatCards from '@/components/dashboard/StatCards';
import UpcomingReminders from '@/components/dashboard/UpcomingReminders';
import CashFlowChart from '@/components/dashboard/CashFlowChart';
import PullRefresh from '@/components/PullRefresh';

export default function Home() {
  const [properties, setProperties] = useState([]), [expenses, setExpenses] = useState([]), [reminders, setReminders] = useState([]), [rentPayments, setRentPayments] = useState([]), [owners, setOwners] = useState([]), [loading, setLoading] = useState(true), [ownerFilter, setOwnerFilter] = useState('all');
  const load = () => Promise.all([base44.entities.Property.list('-created_date'), base44.entities.Expense.list('-date', 100), base44.entities.Reminder.list('date', 100), base44.entities.RentPayment.list('-month', 100), base44.entities.Owner.list('-created_date')]).then(([p, e, r, rp, o]) => { setProperties(p); setExpenses(e); setReminders(r); setRentPayments(rp); setOwners(o); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const filteredProps = useMemo(() => ownerFilter === 'all' ? properties : properties.filter((p) => p.owner_id === ownerFilter), [properties, ownerFilter]);
  const filteredExpenses = useMemo(() => ownerFilter === 'all' ? expenses : expenses.filter((e) => filteredProps.some((p) => p.id === e.property_id)), [expenses, filteredProps]);
  const filteredRentPayments = useMemo(() => ownerFilter === 'all' ? rentPayments : rentPayments.filter((rp) => filteredProps.some((p) => p.id === rp.property_id)), [rentPayments, filteredProps]);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = reminders.filter((r) => r.status === 'attivo' && r.date >= today && (ownerFilter === 'all' || filteredProps.some((p) => p.id === r.property_id))).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
  const toggleReminder = async (r) => { await base44.entities.Reminder.update(r.id, { status: r.status === 'attivo' ? 'completato' : 'attivo' }); setReminders((prev) => prev.map((x) => x.id === r.id ? { ...x, status: x.status === 'attivo' ? 'completato' : 'attivo' } : x)); };
  if (loading) return <AppShell><div className="py-20 text-center text-slate-500 dark:text-slate-400">Caricamento cruscotto…</div></AppShell>;
  return <AppShell>
    <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Cruscotto</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Panoramica generale</h1></div>
    <StickyFilters><StyledSelect value={ownerFilter} onChange={setOwnerFilter} placeholder="Tutti i proprietari" options={[{ value: 'all', label: 'Tutti i proprietari' }, ...owners.map((o) => ({ value: o.id, label: o.name }))]} /></StickyFilters>
    <PullRefresh onRefresh={load}><div className="mt-6"><StatCards properties={filteredProps} expenses={filteredExpenses} /></div>
    <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-2"><h2 className="text-base font-bold sm:text-lg">Andamento flusso di cassa</h2><div className="flex flex-wrap gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Entrate</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Uscite</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-teal-600" />Saldo</span></div></div><CashFlowChart properties={filteredProps} expenses={filteredExpenses} rentPayments={filteredRentPayments} /></div>
    <div className="mt-6 max-w-2xl"><div className="mb-4 flex items-center gap-2"><Bell size={18} className="text-slate-700 dark:text-slate-300" /><h2 className="text-xl font-bold">Prossime scadenze</h2></div><div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"><UpcomingReminders reminders={upcoming} onToggle={toggleReminder} /><Link to="/calendario" className="mt-4 block rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">Vai al calendario</Link></div></div>
  </PullRefresh></AppShell>;
}