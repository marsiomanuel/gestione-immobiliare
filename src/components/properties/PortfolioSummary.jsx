import { Building2, CircleDollarSign, KeyRound, Receipt } from 'lucide-react';

export default function PortfolioSummary({ properties }) {
  const occupied = properties.filter((p) => p.status === 'occupato').length;
  const gross = properties.reduce((s, p) => s + (p.monthly_rent || 0), 0);
  const condoFee = properties.reduce((s, p) => s + (p.condo_fee || 0), 0);
  const taxes = properties.reduce((s, p) => s + (p.monthly_rent || 0) * (p.tax_rate || 0) / 100 * (p.ownership_percentage || 100) / 100, 0);
  const items = [
    { label: 'Immobili totali', value: properties.length, icon: Building2, tone: 'bg-slate-900 text-white' },
    { label: 'Immobili occupati', value: occupied, icon: KeyRound, tone: 'bg-teal-600 text-white' },
    { label: 'Canone lordo /mese', value: `€ ${gross.toLocaleString('it-IT')}`, icon: CircleDollarSign, tone: 'bg-white text-slate-900' },
    { label: 'Quota cond. /mese', value: `€ ${condoFee.toLocaleString('it-IT')}`, icon: Receipt, tone: 'bg-white text-slate-900' },
  ];
  return <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(({ label, value, icon: Icon, tone }) => <div key={label} className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${tone}`}><div className="flex items-center justify-between"><p className="text-sm opacity-75">{label}</p><Icon size={20} className="opacity-70" /></div><p className="mt-4 text-2xl font-bold tracking-tight">{value}</p></div>)}</section>;
}