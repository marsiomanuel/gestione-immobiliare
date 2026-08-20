import { User, Building2, Pencil, Trash2 } from 'lucide-react';

const typeLabel = { persona_fisica: 'Persona fisica', societa: 'Società' };

export default function OwnerCard({ owner, propertyCount, totalRent, onEdit, onDelete }) {
  const Icon = owner.type === 'societa' ? Building2 : User;
  return <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"><Icon size={20} /></div>
      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400">{typeLabel[owner.type]}</span>
    </div>
    <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100">{owner.name}</h3>
    {owner.tax_code && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">CF/P.IVA: {owner.tax_code}</p>}
    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
      <div><p className="text-slate-500 dark:text-slate-400">Immobili</p><p className="mt-1 font-bold text-slate-900 dark:text-slate-100">{propertyCount}</p></div>
      <div><p className="text-slate-500 dark:text-slate-400">Canone /mese</p><p className="mt-1 font-bold text-emerald-700 dark:text-emerald-400">€ {totalRent.toLocaleString('it-IT')}</p></div>
    </div>
    <div className="mt-4 flex gap-2">
      <button onClick={() => onEdit(owner)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"><Pencil size={15} /> Modifica</button>
      <button aria-label={`Elimina ${owner.name}`} onClick={() => onDelete(owner)} className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2.5 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 dark:hover:text-rose-400"><Trash2 size={16} /></button>
    </div>
  </article>;
}