import { useState } from 'react';
import { X } from 'lucide-react';
import FormModal from '@/components/FormModal';
import FormSelect from '@/components/FormSelect';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-slate-500';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

export default function ExpenseForm({ expense = {}, properties = [], onSubmit, onClose, saving, isOpen }) {
  const field = (n, f = '') => expense[n] ?? f;
  const [type, setType] = useState(field('type', 'condominio'));
  const [recurring, setRecurring] = useState(field('recurring', false));
  const [splitInstallments, setSplitInstallments] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState(4);
  const [amount, setAmount] = useState(field('amount', 0));
  const showSplit = type === 'condominio' && !expense.id;
  const perInstallment = installmentsCount > 0 ? (Number(amount || 0) / installmentsCount).toFixed(2) : '0.00';

  return <FormModal isOpen={isOpen} onClose={onClose}>
    <form onSubmit={onSubmit}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">Spesa</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{expense.id ? 'Modifica spesa' : 'Nuova spesa'}</h2>
        </div>
        <button type="button" aria-label="Chiudi" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"><X size={20} /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>Immobile<FormSelect name="property_id" defaultValue={field('property_id')} options={[{ value: '', label: '— Generale —' }, ...properties.map((p) => ({ value: p.id, label: p.name }))]} className="mt-1.5" /></label>
        <label className={labelClass}>Tipologia<FormSelect name="type" defaultValue={field('type', 'condominio')} onChange={setType} options={[{ value: 'condominio', label: 'Condominio' }, { value: 'straordinaria', label: 'Straordinaria' }, { value: 'intervento_futuro', label: 'Intervento futuro' }, { value: 'tassa', label: 'Tassa / IMU' }, { value: 'manutenzione', label: 'Manutenzione' }, { value: 'altro', label: 'Altro' }]} className="mt-1.5" /></label>
        <label className={`${labelClass} sm:col-span-2`}>Descrizione<input name="description" required defaultValue={field('description')} className={inputClass} placeholder="es. Spesa condominio trimestrale" /></label>
        <label className={labelClass}>{splitInstallments ? 'Importo totale annuo (€)' : 'Importo (€)'}<input name="amount" type="number" min="0" step="0.01" required defaultValue={field('amount', 0)} onChange={(e) => setAmount(e.target.value)} className={inputClass} /></label>
        <label className={labelClass}>{splitInstallments ? 'Prima rata - Data' : 'Data'}<input name="date" type="date" required defaultValue={field('date')} className={inputClass} /></label>
        <label className={labelClass}>Stato<FormSelect name="status" defaultValue={field('status', 'da_pagare')} options={[{ value: 'da_pagare', label: 'Da pagare' }, { value: 'pagata', label: 'Pagata' }]} className="mt-1.5" /></label>
        <label className="flex items-center gap-2.5 pt-7 text-sm font-medium text-slate-700 dark:text-slate-300"><input type="checkbox" name="recurring" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800" /> Spesa ricorrente</label>
        {recurring && <label className={labelClass}>Frequenza<FormSelect name="frequency" defaultValue={field('frequency', 'mensile')} options={[{ value: 'mensile', label: 'Mensile' }, { value: 'trimestrale', label: 'Trimestrale' }, { value: 'annuale', label: 'Annuale' }, { value: 'una_tantum', label: 'Una tantum' }]} className="mt-1.5" /></label>}
      </div>
      {showSplit && (
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300"><input type="checkbox" checked={splitInstallments} onChange={(e) => setSplitInstallments(e.target.checked)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800" /> Suddividi in rate annuali</label>
          {splitInstallments && (
            <div className="mt-3">
              <input type="hidden" name="split_installments" value="on" />
              <label className={labelClass}>Numero di rate<select name="installments_count" value={installmentsCount} onChange={(e) => setInstallmentsCount(Number(e.target.value))} className={inputClass}><option value="1">1 — Annuale</option><option value="2">2 — Semestrale</option><option value="3">3 — Quadrimestrale</option><option value="4">4 — Trimestrale</option><option value="6">6 — Bimestrale</option><option value="12">12 — Mensile</option></select></label>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{installmentsCount} rate da € {perInstallment} cadauna, scadenze distribuite nell'anno</p>
            </div>
          )}
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Annulla</button>
        <button disabled={saving} className="flex-1 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 font-semibold text-white dark:text-slate-900 disabled:opacity-60">{saving ? 'Salvataggio…' : (splitInstallments ? 'Genera rate' : 'Salva spesa')}</button>
      </div>
    </form>
  </FormModal>;
}