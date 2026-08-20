import { FileText, Eye, Pencil, Trash2 } from 'lucide-react';

const rentLabel = { libero: 'Canone libero', concordato: 'Canone concordato', scrittura_privata: 'Scrittura privata' };

export default function ContractCard({ contract, onView, onEdit, onDelete }) {
  return <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
    <div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"><FileText size={20} /></div><div className="flex-1 min-w-0"><h3 className="truncate font-bold text-slate-900 dark:text-slate-100">{contract.property_name || 'Contratto'}</h3><p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">{contract.file_name || 'Documento PDF'}</p></div></div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
      <div><p className="text-slate-500 dark:text-slate-400">Inquilino</p><p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">{contract.tenant_name || '—'}</p></div>
      <div><p className="text-slate-500 dark:text-slate-400">Canone</p><p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">€ {(contract.monthly_rent || 0).toLocaleString('it-IT')}</p></div>
      <div><p className="text-slate-500 dark:text-slate-400">Periodo</p><p className="mt-0.5 text-xs font-semibold text-slate-900 dark:text-slate-100">{contract.start_date ? new Date(contract.start_date).toLocaleDateString('it-IT') : '—'} → {contract.end_date ? new Date(contract.end_date).toLocaleDateString('it-IT') : '—'}</p></div>
      <div><p className="text-slate-500 dark:text-slate-400">Tipo</p><p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">{rentLabel[contract.rent_type]}</p></div>
    </div>
    <div className="mt-4 flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
      <button onClick={() => onView(contract)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-3 py-2 text-sm font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"><Eye size={15} /> Visualizza PDF</button>
      <button onClick={() => onEdit(contract)} className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"><Pencil size={16} /></button>
      <button onClick={() => onDelete(contract)} className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2.5 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 dark:hover:text-rose-400"><Trash2 size={16} /></button>
    </div>
  </article>;
}