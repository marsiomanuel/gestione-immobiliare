import { useEffect, useMemo, useState } from 'react';
import { Trash2, TrendingUp, MapPin, Ruler } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useConfirm } from '@/components/ConfirmProvider';
import { toast } from '@/components/ui/use-toast';
import AppShell from '@/components/AppShell';
import EvaluationCalculator from '@/components/evaluations/EvaluationCalculator';
import { computeEvaluation, euro, pct } from '@/components/evaluations/evaluationMath';

const typeLabel = { acquisto: 'Acquisto', vendita: 'Vendita' };

export default function Evaluations() {
  const confirm = useConfirm();
  const [evals, setEvals] = useState([]), [loading, setLoading] = useState(true), [saving, setSaving] = useState(false);
  const load = () => base44.entities.Evaluation.list('-created_date').then(setEvals).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const save = async (data) => {
    setSaving(true);
    try {
      await base44.entities.Evaluation.create(data);
      await load();
      toast({ title: 'Valutazione salvata', description: 'La valutazione è stata registrata su Supabase.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Salvataggio non riuscito', description: error.message || 'Riprova tra qualche minuto.' });
    } finally {
      setSaving(false);
    }
  };
  const remove = async (e) => { if (!await confirm({ title: 'Elimina valutazione', description: 'Eliminare questa valutazione?', destructive: true, confirmLabel: 'Elimina' })) return; await base44.entities.Evaluation.delete(e.id); await load(); };
  const summary = useMemo(() => {
    const acquisti = evals.filter((e) => e.type === 'acquisto');
    const interesting = acquisti.filter((e) => ['Molto interessante', 'Interessante'].includes(computeEvaluation(e).dealRating)).length;
    const avgYield = acquisti.length ? acquisti.reduce((a, e) => a + computeEvaluation(e).netYield, 0) / acquisti.length : 0;
    return { total: evals.length, interesting, avgYield };
  }, [evals]);

  return <AppShell>
    <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Analisi</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Valutazione Immobiliare</h1><p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-400">Stima valore di mercato, costo reale dell'operazione, redditività, sostenibilità del mutuo e convenienza di acquisto o vendita.</p></div>

    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Valutazioni salvate</p><p className="mt-1 text-2xl font-bold">{summary.total}</p></div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Acquisti interessanti</p><p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{summary.interesting}</p></div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rendimento netto medio</p><p className="mt-1 text-2xl font-bold">{pct(summary.avgYield)}</p></div>
    </div>

    <div className="mt-8"><EvaluationCalculator onSave={save} saving={saving} /></div>

    <div className="mt-10"><h2 className="text-xl font-bold">Valutazioni salvate</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Storico delle opportunità analizzate.</p></div>
    {loading ? <div className="py-12 text-center text-slate-500 dark:text-slate-400">Caricamento…</div> : evals.length ? <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{evals.map((e) => {
      const r = computeEvaluation(e);
      const tone = r.dealRating === 'Molto interessante' ? 'text-emerald-600 dark:text-emerald-400' : r.dealRating === 'Interessante' ? 'text-teal-700 dark:text-teal-400' : r.dealRating === 'Da approfondire' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';
      return <div key={e.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"><TrendingUp size={18} /></div><span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400">{typeLabel[e.type]}</span></div>
        <h3 className="mt-4 font-bold text-slate-900 dark:text-slate-100">{e.property_name}</h3>
        {(e.address || e.city) && <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400"><MapPin size={13}/>{[e.address, e.city].filter(Boolean).join(', ')}</p>}
        {e.sqm ? <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400"><Ruler size={13}/>{e.sqm} m² · {euro(r.purchasePriceSqm)}/m²</p> : null}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm"><div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><p className="text-xs text-slate-500">Costo all-in</p><p className="mt-1 font-bold">{euro(r.totalInvestment)}</p></div>{e.type === 'acquisto' ? <><div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><p className="text-xs text-slate-500">Rend. netto</p><p className="mt-1 font-bold">{pct(r.netYield)}</p></div><div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><p className="text-xs text-slate-500">Cash flow/mese</p><p className={`mt-1 font-bold ${r.monthlyCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{euro(r.monthlyCashFlow)}</p></div><div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><p className="text-xs text-slate-500">Giudizio</p><p className={`mt-1 font-bold ${tone}`}>{r.dealRating}</p></div></> : <><div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><p className="text-xs text-slate-500">Netto vendita</p><p className="mt-1 font-bold">{euro(r.netSaleBeforeMortgage)}</p></div><div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><p className="text-xs text-slate-500">Plus/minus</p><p className={`mt-1 font-bold ${r.capitalGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{euro(r.capitalGain)}</p></div><div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><p className="text-xs text-slate-500">ROI</p><p className="mt-1 font-bold">{pct(r.saleRoi)}</p></div></>}</div>
        <button onClick={() => remove(e)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 dark:hover:text-rose-400"><Trash2 size={15} /> Elimina</button>
      </div>;
    })}</div> : <div className="mt-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-12 text-center"><p className="text-sm text-slate-500 dark:text-slate-400">Nessuna valutazione salvata. Usa il calcolatore sopra.</p></div>}
  </AppShell>;
}
