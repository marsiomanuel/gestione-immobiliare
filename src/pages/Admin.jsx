import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Users, Building2, Wallet, CircleDollarSign } from 'lucide-react';
import AppShell from '@/components/AppShell';
import StyledSelect from '@/components/StyledSelect';
import { base44 } from '@/api/base44Client';

const euro = (value) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value || 0);

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      base44.admin.listUsers(),
      base44.entities.Property.list('-created_date'),
      base44.entities.Owner.list('-created_date'),
      base44.entities.Expense.list('-date', 2000),
      base44.entities.RentPayment.list('-month', 2000),
    ]).then(([u, p, o, e, r]) => {
      setUsers(u);
      setProperties(p);
      setOwners(o);
      setExpenses(e);
      setPayments(r);
    }).catch((err) => setError(err.message || 'Impossibile caricare i dati amministrativi.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = (rows) => selectedUser === 'all' ? rows : rows.filter((row) => row.user_id === selectedUser);
  const summary = useMemo(() => {
    const p = filtered(properties);
    const e = filtered(expenses);
    const r = filtered(payments);
    return {
      properties: p.length,
      owners: filtered(owners).length,
      expenses: e.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      rents: r.reduce((sum, item) => sum + Number(item.rent_amount || 0), 0),
    };
  }, [selectedUser, properties, owners, expenses, payments]);

  const accounts = users.map((user) => ({
    ...user,
    properties: properties.filter((row) => row.user_id === user.user_id).length,
    owners: owners.filter((row) => row.user_id === user.user_id).length,
  }));

  return <AppShell>
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Area riservata</p><h1 className="mt-2 flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl"><ShieldCheck /> Amministrazione</h1><p className="mt-2 text-slate-500 dark:text-slate-400">Vista complessiva di tutti gli account. Gli utenti normali continuano a vedere esclusivamente i propri dati.</p></div>
      <StyledSelect value={selectedUser} onChange={setSelectedUser} options={[{ value: 'all', label: 'Tutti gli account' }, ...users.map((user) => ({ value: user.user_id, label: user.email }))]} />
    </div>

    {error && <div className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-400">{error}</div>}
    {loading ? <div className="py-16 text-center text-slate-500">Caricamento dati amministrativi…</div> : <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Account', value: selectedUser === 'all' ? users.length : 1, icon: Users },
          { label: 'Immobili', value: summary.properties, icon: Building2 },
          { label: 'Entrate registrate', value: euro(summary.rents), icon: CircleDollarSign },
          { label: 'Spese registrate', value: euro(summary.expenses), icon: Wallet },
        ].map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><item.icon className="text-teal-700 dark:text-teal-400" size={21} /><p className="mt-4 text-sm text-slate-500">{item.label}</p><p className="mt-1 text-2xl font-bold">{item.value}</p></div>)}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800"><h2 className="font-bold">Account registrati</h2></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500 dark:bg-slate-800"><tr><th className="px-5 py-3">Email</th><th className="px-5 py-3">Ruolo</th><th className="px-5 py-3 text-right">Proprietari</th><th className="px-5 py-3 text-right">Immobili</th><th className="px-5 py-3">Registrazione</th></tr></thead><tbody>{accounts.map((user) => <tr key={user.user_id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-5 py-3 font-semibold">{user.email}</td><td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>{user.role === 'admin' ? 'Amministratore' : 'Utente'}</span></td><td className="px-5 py-3 text-right">{user.owners}</td><td className="px-5 py-3 text-right">{user.properties}</td><td className="px-5 py-3 text-slate-500">{new Date(user.created_at).toLocaleDateString('it-IT')}</td></tr>)}</tbody></table></div>
      </div>
    </>}
  </AppShell>;
}
