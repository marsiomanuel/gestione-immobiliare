import { useEffect, useState } from 'react';
import { Plus, FileText, X, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useConfirm } from '@/components/ConfirmProvider';
import { useModalParam } from '@/hooks/useModalParam';
import AppShell from '@/components/AppShell';
import ContractCard from '@/components/contracts/ContractCard';
import ContractForm from '@/components/contracts/ContractForm';

export default function Contracts() {
  const confirm = useConfirm();
  const [contracts, setContracts] = useState([]), [properties, setProperties] = useState([]), [loading, setLoading] = useState(true);
  const { isOpen: formOpen, open: openForm, close: closeForm } = useModalParam('contract-form');
  const [editing, setEditing] = useState(null), [saving, setSaving] = useState(false), [viewing, setViewing] = useState(null);
  const load = () => Promise.all([base44.entities.Contract.list('-created_date'), base44.entities.Property.list('-created_date')]).then(([c, p]) => { setContracts(c); setProperties(p); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const propName = (id) => properties.find((p) => p.id === id)?.name || '';
  const save = async (e) => { e.preventDefault(); setSaving(true); const data = Object.fromEntries(new FormData(e.currentTarget)); data.monthly_rent = Number(data.monthly_rent); data.property_name = propName(data.property_id); editing?.id ? await base44.entities.Contract.update(editing.id, data) : await base44.entities.Contract.create(data); await load(); setSaving(false); closeForm(); };
  const remove = async (c) => { if (!await confirm({ title: 'Elimina contratto', description: `Eliminare il contratto di "${c.property_name}"?`, destructive: true, confirmLabel: 'Elimina' })) return; await base44.entities.Contract.delete(c.id); await load(); };
  return <AppShell>
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Documenti</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Contratti</h1><p className="mt-2 text-slate-500 dark:text-slate-400">Carica e consulta i PDF dei contratti di locazione.</p></div><button onClick={() => { setEditing(null); openForm(); }} className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-5 py-3 font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"><Plus size={18} /> Carica contratto</button></div>
    {loading ? <div className="py-16 text-center text-slate-500 dark:text-slate-400">Caricamento…</div> : contracts.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{contracts.map((c) => <ContractCard key={c.id} contract={c} onView={setViewing} onEdit={(x) => { setEditing(x); openForm(); }} onDelete={remove} />)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-16 text-center"><FileText size={32} className="mx-auto text-slate-300 dark:text-slate-600" /><p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">Nessun contratto caricato</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Carica il PDF di un contratto per consultarlo qui.</p></div>}
    <ContractForm isOpen={formOpen} contract={editing || {}} properties={properties} onSubmit={save} onClose={closeForm} saving={saving} />
    {viewing && <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 dark:bg-black/90 p-4"><div className="mx-auto flex w-full max-w-4xl flex-1 flex-col"><div className="mb-3 flex items-center justify-between"><h3 className="truncate font-bold text-white">{viewing.property_name} — {viewing.file_name}</h3><div className="flex gap-2"><a href={viewing.file_url} download className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"><Download size={16} /></a><button onClick={() => setViewing(null)} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"><X size={20} /></button></div></div><iframe src={viewing.file_url} title="Contratto PDF" className="w-full flex-1 rounded-xl bg-white" /></div></div>}
  </AppShell>;
}