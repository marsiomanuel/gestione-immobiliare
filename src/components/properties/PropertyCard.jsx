import { useState } from 'react';
import { Building2, MapPin, Pencil, Trash2, FileText, Download, ExternalLink, ChevronDown, Wallet } from 'lucide-react';
import NetIncomeBreakdown from './NetIncomeBreakdown';

const statusStyle = { occupato: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400', libero: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400', manutenzione: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400' };
const rentLabel = { libero: 'Canone libero', concordato: 'Canone concordato', scrittura_privata: 'Scrittura privata' };

export default function PropertyCard({ property, contract, onEdit, onDelete }) {
  const [showDetail, setShowDetail] = useState(false);
  const annualTax = (property.monthly_rent || 0) * 12 * (property.tax_rate || 0) / 100 * (property.ownership_percentage || 100) / 100;
  const annualExpenses = annualTax + (property.monthly_costs || 0) * 12 + (property.mortgage_payment || 0) * 12;
  const monthlyIncome = (property.monthly_rent || 0) + (property.condo_fee || 0);
  const net = (monthlyIncome * 12 - annualExpenses) / 12;
  return <article className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"><Building2 size={20} /></div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[property.status]}`}>{property.status}</span>
    </div>
    <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100">{property.name}</h3>
    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"><MapPin size={14} />{property.address}, {property.city}</p>
    <div className="mt-3 flex flex-wrap gap-2">
      <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400">{rentLabel[property.rent_type]} · {property.tax_rate}%</span>
      {property.owner_name && <span className="rounded-lg bg-teal-50 dark:bg-teal-950 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400">{property.owner_name}</span>}
      {property.tenant_name && <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400">{property.tenant_name}</span>}
    </div>
    <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
      <div><p className="text-slate-500 dark:text-slate-400">Canone</p><p className="mt-1 font-bold text-slate-900 dark:text-slate-100">€ {(property.monthly_rent || 0).toLocaleString('it-IT')}</p></div>
      <div><p className="text-slate-500 dark:text-slate-400">Quota cond.</p><p className="mt-1 font-bold text-slate-900 dark:text-slate-100">€ {(property.condo_fee || 0).toLocaleString('it-IT')}</p></div>
      <div><p className="text-slate-500 dark:text-slate-400">Netto</p><p className="mt-1 font-bold text-emerald-700 dark:text-emerald-400">€ {net.toLocaleString('it-IT')}</p></div>
    </div>
    <button onClick={() => setShowDetail(!showDetail)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-50 dark:bg-teal-950 px-3 py-2.5 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900 transition active:scale-[0.98]"><Wallet size={15} /> Dettaglio rendita netta <ChevronDown size={15} className={`transition ${showDetail ? 'rotate-180' : ''}`} /></button>
    {showDetail && <div className="mt-3"><NetIncomeBreakdown property={property} /></div>}
    <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"><FileText size={13} /> Contratto</p>
      {contract && contract.file_url ? (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
          <FileText size={20} className="shrink-0 text-rose-600 dark:text-rose-400" />
          <p className="flex-1 min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{contract.file_name || 'Contratto.pdf'}</p>
          <a href={contract.file_url} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-slate-900 dark:bg-slate-100 p-2 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200" aria-label="Visualizza PDF"><ExternalLink size={16} /></a>
          <a href={contract.file_url} download={contract.file_name || 'contratto.pdf'} className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Scarica PDF"><Download size={16} /></a>
        </div>
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-500">Nessun contratto caricato.</p>
      )}
    </div>
    <div className="mt-4 flex gap-2">
      <button onClick={() => onEdit(property)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"><Pencil size={15} /> Modifica</button>
      <button aria-label={`Elimina ${property.name}`} onClick={() => onDelete(property)} className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2.5 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 dark:hover:text-rose-400"><Trash2 size={16} /></button>
    </div>
  </article>;
}