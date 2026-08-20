import { useState } from 'react';
import { X, Mail, AlertTriangle, Trash2, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function AccountSettings({ onClose }) {
  const { user } = useAuth();
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await base44.entities.User.delete(user.id);
      await base44.auth.logout('/login');
    } catch {
      setError("Impossibile eliminare l'account. Riprova tra qualche minuto.");
      setDeleting(false);
    }
  };

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 dark:bg-black/60 p-0 sm:items-center sm:p-5">
    <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl sm:rounded-3xl" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)' }}>
      {!deleteMode ? <>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98]"><X size={20} /></button>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"><Mail size={20} /></div>
          <div className="min-w-0"><p className="text-sm text-slate-500 dark:text-slate-400">Email</p><p className="truncate font-semibold text-slate-900 dark:text-slate-100">{user?.email || '—'}</p></div>
        </div>
        <div className="mt-6 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 p-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400"><AlertTriangle size={18} /><p className="text-sm font-semibold">Zona pericolosa</p></div>
          <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">L'eliminazione dell'account è irreversibile. Tutti i dati associati verranno rimossi.</p>
          <button onClick={() => setDeleteMode(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 active:scale-[0.98]"><Trash2 size={16} /> Elimina Account</button>
        </div>
      </> : <>
        <div className="mb-5 flex items-center gap-3">
          <button onClick={() => { setDeleteMode(false); setDeleteText(''); setError(''); }} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98]"><ArrowLeft size={20} /></button>
          <h2 className="text-2xl font-bold text-rose-700 dark:text-rose-400">Elimina Account</h2>
        </div>
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950 p-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400"><AlertTriangle size={20} /><p className="font-bold">Attenzione</p></div>
          <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">Stai per eliminare definitivamente il tuo account <span className="font-semibold">{user?.email}</span>. Questa azione non può essere annullata. Tutti i tuoi dati (immobili, contratti, movimenti) verranno cancellati permanentemente.</p>
        </div>
        <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">Per confermare, digita <span className="font-bold text-rose-600 dark:text-rose-400">ELIMINA</span><input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm uppercase text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500" placeholder="ELIMINA" /></label>
        {error && <p className="mt-3 rounded-lg bg-rose-100 dark:bg-rose-900 p-3 text-sm text-rose-700 dark:text-rose-400">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button onClick={() => { setDeleteMode(false); setDeleteText(''); setError(''); }} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 active:scale-[0.98]">Annulla</button>
          <button disabled={deleteText !== 'ELIMINA' || deleting} onClick={handleDelete} className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white disabled:opacity-50 active:scale-[0.98]">{deleting ? 'Eliminazione…' : 'Elimina definitivamente'}</button>
        </div>
      </>}
    </div>
  </div>;
}
