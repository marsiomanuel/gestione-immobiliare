import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { scrollPositions } from '@/utils/scrollPositions';
import { Building2, LayoutDashboard, Wallet, FileText, CalendarDays, CircleDollarSign, Users, LogOut, Menu, TrendingUp, Settings, BarChart3 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import AccountSettings from '@/components/AccountSettings';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/immobili', label: 'Immobili', icon: Building2 },
  { to: '/proprietari', label: 'Proprietari', icon: Users },
  { to: '/affitti', label: 'Affitti', icon: CircleDollarSign },
  { to: '/spese', label: 'Spese', icon: Wallet },
  { to: '/contratti', label: 'Contratti', icon: FileText },
  { to: '/valutazioni', label: 'Valutazioni', icon: TrendingUp },
  { to: '/analisi', label: 'Analisi', icon: BarChart3 },
  { to: '/calendario', label: 'Calendario', icon: CalendarDays },
];

const mainTabs = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/immobili', label: 'Immobili', icon: Building2 },
  { to: '/affitti', label: 'Affitti', icon: CircleDollarSign },
  { to: '/calendario', label: 'Calendario', icon: CalendarDays },
];

const linkClass = ({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`;

export default function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const saved = scrollPositions.get(location.pathname);
    let timer;
    if (saved) {
      timer = setTimeout(() => window.scrollTo(0, saved), 300);
    }
    return () => {
      if (timer) clearTimeout(timer);
      scrollPositions.set(location.pathname, window.scrollY);
    };
  }, [location.pathname]);
  return <div className="min-h-screen bg-[#f4f6f5] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:flex">
      <div className="flex items-center gap-3 px-6 py-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"><Building2 size={20} /></span><div><p className="font-bold leading-tight">Gestione Immobiliare</p><p className="text-xs text-slate-500 dark:text-slate-400">Portafoglio proprietà</p></div></div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">{navItems.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}><item.icon size={18} /> {item.label}</NavLink>)}</nav>
      <div className="space-y-1 border-t border-slate-200 dark:border-slate-800 px-3 py-4">
        <button onClick={() => setAccountOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98]"><Settings size={18} /> Account</button>
        <button onClick={() => base44.auth.logout('/login')} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98]"><LogOut size={18} /> Esci</button>
      </div>
    </aside>
    <div className="md:pl-60"><main className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6 md:pb-12" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 2rem)' }}>{children}</main></div>

    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto flex max-w-md items-stretch px-1">
        {mainTabs.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `flex flex-1 flex-col items-center justify-center gap-1 py-2 transition active:scale-90 ${isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}>{({ isActive }) => <><div className={`flex h-8 w-8 items-center justify-center rounded-full transition ${isActive ? 'bg-teal-50 dark:bg-teal-950' : ''}`}><item.icon size={20} strokeWidth={isActive ? 2.5 : 2} /></div><span className="text-[10px] font-semibold leading-none">{item.label}</span></>}</NavLink>)}
        <button onClick={() => setMenuOpen(true)} className="flex flex-1 flex-col items-center justify-center gap-1 py-2 transition active:scale-90 text-slate-400 dark:text-slate-500"><div className="flex h-8 w-8 items-center justify-center rounded-full"><Menu size={20} strokeWidth={2} /></div><span className="text-[10px] font-semibold leading-none">Menu</span></button>
      </div>
    </nav>

    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
      <SheetContent side="bottom" className="rounded-t-3xl dark:bg-slate-900 dark:border-slate-800" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-700" />
        <SheetHeader><SheetTitle className="dark:text-slate-100">Menu</SheetTitle></SheetHeader>
        <nav className="mt-4 grid grid-cols-3 gap-2">
          {navItems.map((item) => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-semibold transition active:scale-[0.95] ${isActive ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}><item.icon size={22} /> {item.label}</NavLink>)}
        </nav>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={() => { setMenuOpen(false); setAccountOpen(true); }} className="flex flex-col items-center gap-2 rounded-xl bg-slate-100 p-3 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400 active:scale-[0.95]"><Settings size={22} /> Account</button>
          <button onClick={() => base44.auth.logout('/login')} className="flex flex-col items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-950 dark:text-rose-400 active:scale-[0.95]"><LogOut size={22} /> Esci</button>
        </div>
      </SheetContent>
    </Sheet>

    {accountOpen && <AccountSettings onClose={() => setAccountOpen(false)} />}
  </div>;
}