import { useState } from 'react';
import { X, CalendarPlus, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FormModal from '@/components/FormModal';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-slate-500';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

export default function GenerateModal({ properties, existing, onDone, onClose, isOpen }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [generating, setGenerating] = useState(false);

  const occupied = properties.filter((p) => p.status === 'occupato');
  const alreadyExists = (p) => existing.some((e) => e.property_id === p.id && (e.month || '').slice(0, 7) === month);
  const toGenerate = occupied.filter((p) => !alreadyExists(p));
  const skipped = occupied.filter(alreadyExists);

  const generate = async () => {
    setGenerating(true);
    const records = toGenerate.map((p) => ({
      property_id: p.id,
      property_name: p.name,
      tenant_name: p.tenant_name || '',
      month: `${month}-01`,
      rent_amount: p.monthly_rent || 0,
      condo_fee: p.condo_fee || 0,
      condo_expense: p.condo_fee || 0,
      status: 'atteso',
      payment_type: 'affitto',
    }));
    if (records.length) await base44.entities.RentPayment.bulkCreate(records);
    setGenerating(false);
    onDone();
  };

  return <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">Generazione</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Movimenti mensili</h2>
        </div>
        <button type="button" aria-label="Chiudi" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"><X size={20} /></button>
      </div>
      <label className={labelClass}>Mese<input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={inputClass} /></label>
      <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Immobili occupati ({occupied.length})</p>
        {occupied.length === 0 ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Nessun immobile occupato. Imposta lo stato "Occupato" negli immobili.</p> : <ul className="mt-2 space-y-1.5">{toGenerate.map((p) => <li key={p.id} className="flex items-center justify-between text-sm"><span className="text-slate-700 dark:text-slate-300">{p.name}</span><span className="text-slate-500 dark:text-slate-400">€ {((p.monthly_rent || 0) + (p.condo_fee || 0)).toLocaleString('it-IT')}</span></li>)}{skipped.map((p) => <li key={p.id} className="flex items-center justify-between text-sm text-slate-400 dark:text-slate-500"><span className="flex items-center gap-1.5"><Check size={14} /> {p.name}</span><span>già generato</span></li>)}</ul>}
      </div>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Annulla</button>
        <button disabled={generating || toGenerate.length === 0} onClick={generate} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 font-semibold text-white dark:text-slate-900 disabled:opacity-60"><CalendarPlus size={18} /> {generating ? 'Generazione…' : `Genera ${toGenerate.length} movimenti`}</button>
      </div>
    </div>
  </FormModal>;
}