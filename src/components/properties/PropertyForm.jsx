import { useState } from 'react';
import { X } from 'lucide-react';
import FormModal from '@/components/FormModal';
import FormSelect from '@/components/FormSelect';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-slate-500';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

export default function PropertyForm({ property = {}, owners = [], onSubmit, onClose, saving, isOpen }) {
  const field = (name, fallback = '') => property[name] ?? fallback;
  const [taxRate, setTaxRate] = useState(field('tax_rate', 21));
  const onRentTypeChange = (t) => setTaxRate(t === 'concordato' ? 10 : t === 'scrittura_privata' ? 0 : 21);
  return <FormModal isOpen={isOpen} onClose={onClose}>
    <form onSubmit={onSubmit}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">Immobile</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{property.id ? 'Modifica proprietà' : 'Nuova proprietà'}</h2>
        </div>
        <button type="button" aria-label="Chiudi" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"><X size={20} /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>Nome<input name="name" required defaultValue={field('name')} className={inputClass} placeholder="es. Appartamento Centro" /></label>
        <label className={`${labelClass} sm:col-span-2`}>Indirizzo<input name="address" required defaultValue={field('address')} className={inputClass} /></label>
        <label className={labelClass}>Città<input name="city" required defaultValue={field('city')} className={inputClass} /></label>
        <label className={labelClass}>Tipologia<FormSelect name="property_type" defaultValue={field('property_type', 'appartamento')} options={[{ value: 'appartamento', label: 'Appartamento' }, { value: 'casa', label: 'Casa' }, { value: 'ufficio', label: 'Ufficio' }, { value: 'negozio', label: 'Negozio' }, { value: 'terreno', label: 'Terreno' }, { value: 'altro', label: 'Altro' }]} className="mt-1.5" /></label>
        <label className={labelClass}>Stato<FormSelect name="status" defaultValue={field('status', 'libero')} options={[{ value: 'occupato', label: 'Occupato' }, { value: 'libero', label: 'Libero' }, { value: 'manutenzione', label: 'In manutenzione' }]} className="mt-1.5" /></label>
        <label className={labelClass}>Inquilino<input name="tenant_name" defaultValue={field('tenant_name')} className={inputClass} /></label>
        <label className={labelClass}>Proprietario<FormSelect name="owner_id" defaultValue={field('owner_id')} options={[{ value: '', label: '— Nessuno —' }, ...owners.map((o) => ({ value: o.id, label: o.name }))]} className="mt-1.5" /></label>
        <label className={labelClass}>Tipo canone<FormSelect name="rent_type" defaultValue={field('rent_type', 'libero')} options={[{ value: 'libero', label: 'Libero (cedolare 21%)' }, { value: 'concordato', label: 'Concordato (cedolare 10%)' }, { value: 'scrittura_privata', label: 'Scrittura privata (0%)' }]} onChange={onRentTypeChange} className="mt-1.5" /></label>
        <label className={labelClass}>Regime fiscale<FormSelect name="tax_regime" defaultValue={field('tax_regime', 'cedolare_secca')} options={[{ value: 'cedolare_secca', label: 'Cedolare secca' }, { value: 'irpef', label: 'IRPEF' }]} className="mt-1.5" /></label>
        <label className={labelClass}>Aliquota (%)<input name="tax_rate" type="number" min="0" max="100" step="0.5" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className={inputClass} /></label>
        <label className={labelClass}>% proprietà<input name="ownership_percentage" type="number" min="0" max="100" step="0.5" defaultValue={field('ownership_percentage', 100)} className={inputClass} /></label>
        <label className={labelClass}>Canone mensile (€)<input name="monthly_rent" type="number" min="0" defaultValue={field('monthly_rent', 0)} className={inputClass} /></label>
        <label className={labelClass}>Quota condominiale (€)<input name="condo_fee" type="number" min="0" defaultValue={field('condo_fee', 0)} className={inputClass} /></label>
        <label className={labelClass}>Costi mensili (€)<input name="monthly_costs" type="number" min="0" defaultValue={field('monthly_costs', 0)} className={inputClass} /></label>
        <label className={labelClass}>Rata mutuo (€)<input name="mortgage_payment" type="number" min="0" defaultValue={field('mortgage_payment', 0)} className={inputClass} /></label>
        <label className={labelClass}>Prezzo acquisto (€)<input name="purchase_price" type="number" min="0" defaultValue={field('purchase_price', 0)} className={inputClass} /></label>
        <label className={labelClass}>Scadenza contratto<input name="contract_end" type="date" defaultValue={field('contract_end')} className={inputClass} /></label>
        <label className={`${labelClass} sm:col-span-2`}>Note<textarea name="notes" defaultValue={field('notes')} className={`${inputClass} min-h-24 resize-none`} /></label>
      </div>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Annulla</button>
        <button disabled={saving} className="flex-1 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 font-semibold text-white dark:text-slate-900 disabled:opacity-60">{saving ? 'Salvataggio…' : 'Salva immobile'}</button>
      </div>
    </form>
  </FormModal>;
}