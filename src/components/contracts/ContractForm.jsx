import { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FormModal from '@/components/FormModal';
import FormSelect from '@/components/FormSelect';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-slate-500';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

export default function ContractForm({ contract = {}, properties = [], onSubmit, onClose, saving, isOpen }) {
  const field = (n, f = '') => contract[n] ?? f;
  const [fileUrl, setFileUrl] = useState(field('file_url'));
  const [fileName, setFileName] = useState(field('file_name'));
  const [uploading, setUploading] = useState(false);
  const onFile = async (e) => { const file = e.target.files?.[0]; if (!file) return; setUploading(true); const { file_url } = await base44.integrations.Core.UploadFile({ file }); setFileUrl(file_url); setFileName(file.name); setUploading(false); };
  return <FormModal isOpen={isOpen} onClose={onClose}>
    <form onSubmit={onSubmit}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">Contratto</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{contract.id ? 'Modifica contratto' : 'Nuovo contratto'}</h2>
        </div>
        <button type="button" aria-label="Chiudi" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"><X size={20} /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>Immobile<FormSelect name="property_id" defaultValue={field('property_id')} options={[{ value: '', label: 'Seleziona immobile…' }, ...properties.map((p) => ({ value: p.id, label: p.name }))]} className="mt-1.5" /></label>
        <div className="sm:col-span-2">
          <p className={labelClass}>Contratto (PDF)</p>
          <div className="mt-1.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-5 text-center">
            {fileUrl ? <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><FileText size={18} /> {fileName || 'Contratto caricato'} <button type="button" onClick={() => { setFileUrl(''); setFileName(''); }} className="ml-2 text-xs text-rose-500 hover:underline">rimuovi</button></div> : <><Upload size={20} className="mx-auto text-slate-400" /><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{uploading ? 'Caricamento…' : 'Seleziona un PDF da caricare'}</p></>}
            <input type="file" accept="application/pdf" onChange={onFile} disabled={uploading} className="mt-2 w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-white dark:file:bg-slate-100 dark:file:text-slate-900" />
          </div>
        </div>
        <input type="hidden" name="file_url" value={fileUrl || ''} /><input type="hidden" name="file_name" value={fileName || ''} />
        <label className={labelClass}>Inquilino<input name="tenant_name" defaultValue={field('tenant_name')} className={inputClass} /></label>
        <label className={labelClass}>Tipo canone<FormSelect name="rent_type" defaultValue={field('rent_type', 'libero')} options={[{ value: 'libero', label: 'Libero' }, { value: 'concordato', label: 'Concordato' }, { value: 'scrittura_privata', label: 'Scrittura privata' }]} className="mt-1.5" /></label>
        <label className={labelClass}>Data inizio<input name="start_date" type="date" defaultValue={field('start_date')} className={inputClass} /></label>
        <label className={labelClass}>Data fine<input name="end_date" type="date" defaultValue={field('end_date')} className={inputClass} /></label>
        <label className={`${labelClass} sm:col-span-2`}>Canone mensile (€)<input name="monthly_rent" type="number" min="0" defaultValue={field('monthly_rent', 0)} className={inputClass} /></label>
      </div>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Annulla</button>
        <button disabled={saving || !fileUrl} className="flex-1 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 font-semibold text-white dark:text-slate-900 disabled:opacity-60">{saving ? 'Salvataggio…' : 'Salva contratto'}</button>
      </div>
    </form>
  </FormModal>;
}