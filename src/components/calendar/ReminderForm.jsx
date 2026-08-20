import { useState } from 'react';
import { X } from 'lucide-react';
import FormModal from '@/components/FormModal';
import FormSelect from '@/components/FormSelect';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-slate-500';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

export default function ReminderForm({ reminder = {}, properties = [], onSubmit, onClose, saving, defaultDate, isOpen }) {
  const field = (n, f = '') => reminder[n] ?? f;
  const [recurring, setRecurring] = useState(field('recurring', false));
  return <FormModal isOpen={isOpen} onClose={onClose}>
    <form onSubmit={onSubmit}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">Promemoria</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{reminder.id ? 'Modifica promemoria' : 'Nuovo promemoria'}</h2>
        </div>
        <button type="button" aria-label="Chiudi" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"><X size={20} /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>Titolo<input name="title" required defaultValue={field('title')} className={inputClass} placeholder="es. Incasso affitto - Appartamento Centro" /></label>
        <label className={labelClass}>Tipo<FormSelect name="type" defaultValue={field('type', 'altro')} options={[{ value: 'incasso_affitto', label: 'Incasso affitto' }, { value: 'pagamento_spesa', label: 'Pagamento spesa' }, { value: 'dichiarazione_tasse', label: 'Dichiarazione tasse' }, { value: 'scadenza_contratto', label: 'Scadenza contratto' }, { value: 'altro', label: 'Altro' }]} className="mt-1.5" /></label>
        <label className={labelClass}>Data<input name="date" type="date" required defaultValue={field('date') || defaultDate} className={inputClass} /></label>
        <label className={`${labelClass} sm:col-span-2`}>Immobile (opzionale)<FormSelect name="property_id" defaultValue={field('property_id')} options={[{ value: '', label: '— Generale —' }, ...properties.map((p) => ({ value: p.id, label: p.name }))]} className="mt-1.5" /></label>
        <label className={`${labelClass} sm:col-span-2`}>Descrizione<textarea name="description" defaultValue={field('description')} className={`${inputClass} min-h-20 resize-none`} /></label>
        <label className="flex items-center gap-2.5 pt-7 text-sm font-medium text-slate-700 dark:text-slate-300"><input type="checkbox" name="recurring" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800" /> Ripeti</label>
        {recurring && <label className={labelClass}>Frequenza<FormSelect name="frequency" defaultValue={field('frequency', 'mensile')} options={[{ value: 'mensile', label: 'Mensile' }, { value: 'trimestrale', label: 'Trimestrale' }, { value: 'annuale', label: 'Annuale' }]} className="mt-1.5" /></label>}
      </div>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Annulla</button>
        <button disabled={saving} className="flex-1 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 font-semibold text-white dark:text-slate-900 disabled:opacity-60">{saving ? 'Salvataggio…' : 'Salva promemoria'}</button>
      </div>
    </form>
  </FormModal>;
}