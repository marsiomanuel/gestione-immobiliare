import { useEffect, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useConfirm } from '@/components/ConfirmProvider';
import { useModalParam } from '@/hooks/useModalParam';
import AppShell from '@/components/AppShell';
import OwnerCard from '@/components/owners/OwnerCard';
import OwnerForm from '@/components/owners/OwnerForm';
import PullRefresh from '@/components/PullRefresh';

export default function Owners() {
  const confirm = useConfirm();
  const [owners, setOwners] = useState([]), [properties, setProperties] = useState([]), [loading, setLoading] = useState(true);
  const { isOpen: formOpen, open: openForm, close: closeForm } = useModalParam('owner-form');
  const [editing, setEditing] = useState(null), [saving, setSaving] = useState(false);
  const load = () => Promise.all([base44.entities.Owner.list('-created_date'), base44.entities.Property.list('-created_date')]).then(([o, p]) => { setOwners(o); setProperties(p); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const countFor = (id) => properties.filter((p) => p.owner_id === id).length;
  const rentFor = (id) => properties.filter((p) => p.owner_id === id).reduce((s, p) => s + (p.monthly_rent || 0), 0);
  const save = async (e) => { e.preventDefault(); setSaving(true); const data = Object.fromEntries(new FormData(e.currentTarget)); editing?.id ? await base44.entities.Owner.update(editing.id, data) : await base44.entities.Owner.create(data); await load(); setSaving(false); closeForm(); };
  const remove = async (o) => { if (!await confirm({ title: 'Elimina proprietario', description: `Eliminare "${o.name}"?`, destructive: true, confirmLabel: 'Elimina' })) return; await base44.entities.Owner.delete(o.id); await load(); };
  return <AppShell>
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Anagrafica</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Proprietari</h1><p className="mt-2 text-slate-500 dark:text-slate-400">Gestisci immobili di diversi proprietari (persone o società).</p></div><button onClick={() => { setEditing(null); openForm(); }} className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-5 py-3 font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"><Plus size={18} /> Aggiungi proprietario</button></div>
    <PullRefresh onRefresh={load}>{loading ? <div className="py-16 text-center text-slate-500 dark:text-slate-400">Caricamento…</div> : owners.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{owners.map((o) => <OwnerCard key={o.id} owner={o} propertyCount={countFor(o.id)} totalRent={rentFor(o.id)} onEdit={(x) => { setEditing(x); openForm(); }} onDelete={remove} />)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-16 text-center"><Users size={32} className="mx-auto text-slate-300 dark:text-slate-600" /><p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">Nessun proprietario</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Aggiungi persone fisiche o società.</p></div>}
    </PullRefresh><OwnerForm isOpen={formOpen} owner={editing || {}} onSubmit={save} onClose={closeForm} saving={saving} />
  </AppShell>;
}