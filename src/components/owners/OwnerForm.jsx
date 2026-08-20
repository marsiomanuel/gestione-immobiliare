import { X } from 'lucide-react';
import FormModal from '@/components/FormModal';
import FormSelect from '@/components/FormSelect';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-slate-500';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

export default function OwnerForm({ owner = {}, onSubmit, onClose, saving, isOpen }) {
  const field = (name, fallback = '') => owner[name] ?? fallback;
  return <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
    <form onSubmit={onSubmit}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">Proprietario</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{owner.id ? 'Modifica proprietario' : 'Nuovo proprietario'}</h2>
        </div>
        <button type="button" aria-label="Chiudi" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"><X size={20} /></button>
      </div>
      <div className="grid gap-4">
        <label className={labelClass}>Nome / Ragione sociale<input name="name" required defaultValue={field('name')} className={inputClass} placeholder="es. Marsio Real Estate SRL" /></label>
        <label className={labelClass}>Tipo<FormSelect name="type" defaultValue={field('type', 'persona_fisica')} options={[{ value: 'persona_fisica', label: 'Persona fisica' }, { value: 'societa', label: 'Società' }]} className="mt-1.5" /></label>
        <label className={labelClass}>Codice fiscale / P.IVA<input name="tax_code" defaultValue={field('tax_code')} className={inputClass} /></label>
        <label className={labelClass}>Email<input name="email" type="email" defaultValue={field('email')} className={inputClass} /></label>
        <label className={labelClass}>Telefono<input name="phone" defaultValue={field('phone')} className={inputClass} /></label>
        <label className={labelClass}>Note<textarea name="notes" defaultValue={field('notes')} className={`${inputClass} min-h-20 resize-none`} /></label>
      </div>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Annulla</button>
        <button disabled={saving} className="flex-1 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 font-semibold text-white dark:text-slate-900 disabled:opacity-60">{saving ? 'Salvataggio…' : 'Salva'}</button>
      </div>
    </form>
  </FormModal>;
}