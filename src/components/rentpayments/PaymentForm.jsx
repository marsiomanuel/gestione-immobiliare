import { X } from 'lucide-react';
import FormModal from '@/components/FormModal';
import FormSelect from '@/components/FormSelect';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-slate-500';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

export default function PaymentForm({ payment = {}, properties = [], onSubmit, onClose, saving, isOpen }) {
  const field = (n, f = '') => payment[n] ?? f;
  const monthValue = (field('month', new Date().toISOString().slice(0, 10)) || '').slice(0, 7);
  return <FormModal isOpen={isOpen} onClose={onClose}>
    <form onSubmit={onSubmit}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">Entrata</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{payment.id ? 'Modifica entrata' : 'Nuova entrata'}</h2>
        </div>
        <button type="button" aria-label="Chiudi" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"><X size={20} /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>Immobile<FormSelect name="property_id" defaultValue={field('property_id')} options={[{ value: '', label: '— Generale —' }, ...properties.map((p) => ({ value: p.id, label: p.name }))]} className="mt-1.5" /></label>
        <label className={labelClass}>Tipologia<FormSelect name="payment_type" defaultValue={field('payment_type', 'affitto')} options={[{ value: 'affitto', label: 'Affitto' }, { value: 'anticipo', label: 'Anticipo' }, { value: 'caparra', label: 'Caparra' }]} className="mt-1.5" /></label>
        <label className={labelClass}>Mese<input type="month" name="month" defaultValue={monthValue} className={inputClass} /></label>
        <label className={labelClass}>Importo (€)<input name="rent_amount" type="number" min="0" step="0.01" required defaultValue={field('rent_amount', 0)} className={inputClass} /></label>
        <label className={labelClass}>Inquilino<input name="tenant_name" defaultValue={field('tenant_name')} className={inputClass} /></label>
        <label className={labelClass}>Stato<FormSelect name="status" defaultValue={field('status', 'atteso')} options={[{ value: 'atteso', label: 'Atteso' }, { value: 'pagato', label: 'Pagato' }, { value: 'parzialmente_pagato', label: 'Parziale' }, { value: 'in_ritardo', label: 'In ritardo' }]} className="mt-1.5" /></label>
      </div>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Annulla</button>
        <button disabled={saving} className="flex-1 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 font-semibold text-white dark:text-slate-900 disabled:opacity-60">{saving ? 'Salvataggio…' : 'Salva entrata'}</button>
      </div>
    </form>
  </FormModal>;
}