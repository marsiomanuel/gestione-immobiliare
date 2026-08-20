import { useEffect, useMemo, useState } from 'react';
import { Calculator, Save, Building2, BadgeEuro, Landmark, TrendingUp, Scale, WalletCards } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { computeEvaluation, euro, num, pct } from './evaluationMath';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-slate-500';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';
const sectionClass = 'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm';

const initial = {
  property_id: '', property_name: '', address: '', city: '', sqm: 0, condition: 'buono',
  market_price_sqm_low: 0, market_price_sqm_base: 0, market_price_sqm_high: 0,
  purchase_price: 0, agency_costs: 0, notary_costs: 0, purchase_taxes: 0, renovation_costs: 0, furniture_costs: 0, other_initial_costs: 0,
  sale_price: 0, sale_agency_rate: 0, sale_taxes: 0, sale_other_costs: 0,
  monthly_rent: 0, condo_fee: 0, other_costs: 0, annual_imu: 0, annual_maintenance: 0, vacancy_rate: 5,
  mortgage_amount: 0, mortgage_rate: 3.5, mortgage_years: 25, remaining_mortgage: 0,
  tax_rate: 21, years_held: 5, notes: ''
};

function Field({ label, children, wide }) {
  return <label className={`${labelClass} ${wide ? 'sm:col-span-2' : ''}`}>{label}{children}</label>;
}

function Stat({ label, value, tone = 'text-slate-900 dark:text-slate-100' }) {
  return <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className={`mt-1 text-xl font-bold ${tone}`}>{value}</p></div>;
}

export default function EvaluationCalculator({ onSave, saving }) {
  const [type, setType] = useState('acquisto');
  const [f, setF] = useState(initial);
  const [properties, setProperties] = useState([]);
  useEffect(() => { base44.entities.Property.list('name').then(setProperties).catch(() => {}); }, []);
  const r = useMemo(() => computeEvaluation(f), [f]);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === 'number' ? num(e.target.value) : e.target.value }));

  const selectProperty = (e) => {
    const id = e.target.value;
    const p = properties.find((x) => x.id === id);
    if (!p) return setF((prev) => ({ ...prev, property_id: '' }));
    setF((prev) => ({
      ...prev,
      property_id: p.id,
      property_name: p.name || '',
      address: p.address || '',
      city: p.city || '',
      purchase_price: p.purchase_price || prev.purchase_price,
      monthly_rent: p.monthly_rent || prev.monthly_rent,
      condo_fee: p.condo_fee || prev.condo_fee,
      other_costs: p.monthly_costs || prev.other_costs,
      mortgage_amount: p.mortgage_payment ? prev.mortgage_amount : prev.mortgage_amount,
      tax_rate: p.tax_rate || prev.tax_rate,
    }));
  };

  const ratingTone = r.dealRating === 'Molto interessante' ? 'text-emerald-600 dark:text-emerald-400' : r.dealRating === 'Interessante' ? 'text-teal-700 dark:text-teal-400' : r.dealRating === 'Da approfondire' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';

  return <div className="space-y-5">
    <div className={sectionClass}>
      <div className="flex gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
        <button onClick={() => setType('acquisto')} className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${type === 'acquisto' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Analisi acquisto</button>
        <button onClick={() => setType('vendita')} className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${type === 'vendita' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Analisi vendita</button>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Immobile già in portafoglio" wide><select value={f.property_id} onChange={selectProperty} className={inputClass}><option value="">Nuova valutazione / immobile esterno</option>{properties.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.city}</option>)}</select></Field>
        <Field label="Nome immobile"><input value={f.property_name} onChange={set('property_name')} className={inputClass} placeholder="es. Bilocale Via Roma" /></Field>
        <Field label="Città"><input value={f.city} onChange={set('city')} className={inputClass} /></Field>
        <Field label="Indirizzo" wide><input value={f.address} onChange={set('address')} className={inputClass} /></Field>
        <Field label="Superficie (m²)"><input type="number" value={f.sqm} onChange={set('sqm')} className={inputClass} /></Field>
        <Field label="Stato immobile"><select value={f.condition} onChange={set('condition')} className={inputClass}><option value="da_ristrutturare">Da ristrutturare</option><option value="da_rivedere">Da rivedere</option><option value="buono">Buono</option><option value="ristrutturato">Ristrutturato</option><option value="nuovo">Nuovo</option></select></Field>
      </div>
    </div>

    <div className="grid gap-5 xl:grid-cols-2">
      <div className={sectionClass}>
        <div className="mb-4 flex items-center gap-2"><Building2 size={18} className="text-teal-700 dark:text-teal-400" /><h3 className="font-bold">Valore di mercato</h3></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="€/m² prudente"><input type="number" value={f.market_price_sqm_low} onChange={set('market_price_sqm_low')} className={inputClass} /></Field>
          <Field label="€/m² centrale"><input type="number" value={f.market_price_sqm_base} onChange={set('market_price_sqm_base')} className={inputClass} /></Field>
          <Field label="€/m² ottimistico"><input type="number" value={f.market_price_sqm_high} onChange={set('market_price_sqm_high')} className={inputClass} /></Field>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3"><Stat label="Valore prudente" value={euro(r.marketLow)} /><Stat label="Valore stimato" value={euro(r.marketBase)} tone="text-teal-700 dark:text-teal-400" /><Stat label="Valore alto" value={euro(r.marketHigh)} /></div>
      </div>

      <div className={sectionClass}>
        <div className="mb-4 flex items-center gap-2"><BadgeEuro size={18} className="text-teal-700 dark:text-teal-400" /><h3 className="font-bold">Costo operazione</h3></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Prezzo acquisto (€)"><input type="number" value={f.purchase_price} onChange={set('purchase_price')} className={inputClass} /></Field>
          <Field label="Agenzia (€)"><input type="number" value={f.agency_costs} onChange={set('agency_costs')} className={inputClass} /></Field>
          <Field label="Notaio (€)"><input type="number" value={f.notary_costs} onChange={set('notary_costs')} className={inputClass} /></Field>
          <Field label="Imposte acquisto (€)"><input type="number" value={f.purchase_taxes} onChange={set('purchase_taxes')} className={inputClass} /></Field>
          <Field label="Ristrutturazione (€)"><input type="number" value={f.renovation_costs} onChange={set('renovation_costs')} className={inputClass} /></Field>
          <Field label="Arredo (€)"><input type="number" value={f.furniture_costs} onChange={set('furniture_costs')} className={inputClass} /></Field>
          <Field label="Altri costi iniziali (€)"><input type="number" value={f.other_initial_costs} onChange={set('other_initial_costs')} className={inputClass} /></Field>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3"><Stat label="Costo all-in" value={euro(r.totalInvestment)} /><Stat label="Prezzo €/m²" value={f.sqm ? euro(r.purchasePriceSqm) : '—'} /><Stat label="Sconto vs mercato" value={f.market_price_sqm_base ? pct(r.discountVsMarket) : '—'} tone={r.discountVsMarket >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} /></div>
      </div>
    </div>

    {type === 'acquisto' ? <>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className={sectionClass}>
          <div className="mb-4 flex items-center gap-2"><WalletCards size={18} className="text-teal-700 dark:text-teal-400" /><h3 className="font-bold">Redditività locativa</h3></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Canone /mese (€)"><input type="number" value={f.monthly_rent} onChange={set('monthly_rent')} className={inputClass} /></Field>
            <Field label="Condominio /mese (€)"><input type="number" value={f.condo_fee} onChange={set('condo_fee')} className={inputClass} /></Field>
            <Field label="Altri costi /mese (€)"><input type="number" value={f.other_costs} onChange={set('other_costs')} className={inputClass} /></Field>
            <Field label="IMU annua (€)"><input type="number" value={f.annual_imu} onChange={set('annual_imu')} className={inputClass} /></Field>
            <Field label="Manutenzione annua (€)"><input type="number" value={f.annual_maintenance} onChange={set('annual_maintenance')} className={inputClass} /></Field>
            <Field label="Sfitto stimato (%)"><input type="number" step="0.5" value={f.vacancy_rate} onChange={set('vacancy_rate')} className={inputClass} /></Field>
            <Field label="Tassazione canone (%)"><input type="number" step="0.5" value={f.tax_rate} onChange={set('tax_rate')} className={inputClass} /></Field>
          </div>
        </div>
        <div className={sectionClass}>
          <div className="mb-4 flex items-center gap-2"><Landmark size={18} className="text-teal-700 dark:text-teal-400" /><h3 className="font-bold">Finanziamento</h3></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Mutuo (€)"><input type="number" value={f.mortgage_amount} onChange={set('mortgage_amount')} className={inputClass} /></Field>
            <Field label="Tasso (%)"><input type="number" step="0.1" value={f.mortgage_rate} onChange={set('mortgage_rate')} className={inputClass} /></Field>
            <Field label="Durata (anni)"><input type="number" value={f.mortgage_years} onChange={set('mortgage_years')} className={inputClass} /></Field>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3"><Stat label="Rata mensile" value={euro(r.mortgageMonthly)} /><Stat label="Capitale proprio" value={euro(r.equityRequired)} /><Stat label="LTV" value={pct(r.ltvBase)} /></div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="mb-4 flex items-center gap-2"><Calculator size={18} className="text-teal-700 dark:text-teal-400" /><h3 className="font-bold">Risultato investimento</h3></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Rendimento lordo" value={pct(r.grossYield)} /><Stat label="Rendimento netto operativo" value={pct(r.netYield)} /><Stat label="Netto dopo tasse" value={pct(r.afterTaxYield)} /><Stat label="Cash-on-cash" value={pct(r.cashOnCash)} /><Stat label="Cash flow /mese" value={euro(r.monthlyCashFlow)} tone={r.monthlyCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} /><Stat label="Cash flow annuo" value={euro(r.annualCashFlow)} tone={r.annualCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} /><Stat label="DSCR" value={r.dscr ? r.dscr.toFixed(2) : '—'} /><Stat label="Giudizio sintetico" value={r.dealRating} tone={ratingTone} /></div>
      </div>
    </> : <>
      <div className={sectionClass}>
        <div className="mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-teal-700 dark:text-teal-400" /><h3 className="font-bold">Scenario di vendita</h3></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Prezzo vendita (€)"><input type="number" value={f.sale_price} onChange={set('sale_price')} className={inputClass} /></Field>
          <Field label="Agenzia vendita (%)"><input type="number" step="0.1" value={f.sale_agency_rate} onChange={set('sale_agency_rate')} className={inputClass} /></Field>
          <Field label="Imposte vendita (€)"><input type="number" value={f.sale_taxes} onChange={set('sale_taxes')} className={inputClass} /></Field>
          <Field label="Altri costi vendita (€)"><input type="number" value={f.sale_other_costs} onChange={set('sale_other_costs')} className={inputClass} /></Field>
          <Field label="Debito residuo (€)"><input type="number" value={f.remaining_mortgage} onChange={set('remaining_mortgage')} className={inputClass} /></Field>
          <Field label="Anni detenuti"><input type="number" value={f.years_held} onChange={set('years_held')} className={inputClass} /></Field>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Netto prima del mutuo" value={euro(r.netSaleBeforeMortgage)} /><Stat label="Liquidità dopo mutuo" value={euro(r.netSaleAfterMortgage)} /><Stat label="Plus/minusvalenza" value={euro(r.capitalGain)} tone={r.capitalGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} /><Stat label="ROI vendita" value={pct(r.saleRoi)} /><Stat label="Rendimento annuo composto" value={pct(r.annualizedSaleReturn)} /></div>
      </div>
    </>}

    <div className={sectionClass}>
      <div className="flex items-center gap-2"><Scale size={18} className="text-teal-700 dark:text-teal-400" /><h3 className="font-bold">Note e decisione</h3></div>
      <textarea value={f.notes} onChange={set('notes')} className={`${inputClass} min-h-24`} placeholder="Zona, stato condominio, lavori futuri, comparabili, rischi, margine di trattativa..." />
      <button disabled={saving || !f.property_name} onClick={() => onSave({ ...f, type })} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 py-3 font-semibold text-white dark:text-slate-900 disabled:opacity-60"><Save size={18} /> {saving ? 'Salvataggio…' : 'Salva valutazione'}</button>
    </div>
  </div>;
}