import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth, isToday } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const typeDot = { incasso_affitto: 'bg-emerald-500', pagamento_spesa: 'bg-rose-500', dichiarazione_tasse: 'bg-amber-500', scadenza_contratto: 'bg-blue-500', altro: 'bg-slate-400' };

function occursOn(reminder, date) {
  const rDate = new Date(reminder.date);
  if (!reminder.recurring) return isSameDay(rDate, date);
  if (isSameDay(rDate, date)) return true;
  if (date < rDate) return false;
  if (reminder.frequency === 'mensile') return rDate.getDate() === date.getDate();
  if (reminder.frequency === 'trimestrale') { const m = (date.getFullYear() - rDate.getFullYear()) * 12 + date.getMonth() - rDate.getMonth(); return m % 3 === 0 && rDate.getDate() === date.getDate(); }
  if (reminder.frequency === 'annuale') return rDate.getMonth() === date.getMonth() && rDate.getDate() === date.getDate();
  return isSameDay(rDate, date);
}

export default function CalendarView({ currentMonth, onPrev, onNext, reminders, selectedDate, onSelect }) {
  const start = startOfMonth(currentMonth), end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const leadingBlanks = start.getDay() === 0 ? 6 : start.getDay() - 1;
  return <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
    <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold capitalize text-slate-900 dark:text-slate-100">{format(currentMonth, 'MMMM yyyy', { locale: it })}</h2><div className="flex gap-1.5"><button onClick={onPrev} className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"><ChevronLeft size={18} /></button><button onClick={onNext} className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"><ChevronRight size={18} /></button></div></div>
    <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">{['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((d) => <div key={d} className="py-1">{d}</div>)}</div>
    <div className="mt-1 grid grid-cols-7 gap-1">
      {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`b${i}`} />)}
      {days.map((day) => { const dayReminders = reminders.filter((r) => occursOn(r, day)); const isSelected = selectedDate && isSameDay(day, selectedDate); return <button key={day.toISOString()} onClick={() => onSelect(day)} className={`flex min-h-14 flex-col items-center rounded-lg border p-1.5 text-sm transition ${isSelected ? 'border-slate-900 dark:border-slate-100 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : isToday(day) ? 'border-teal-400 dark:border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400' : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'} ${!isSameMonth(day, currentMonth) ? 'opacity-40' : ''}`}><span className="font-semibold">{format(day, 'd')}</span>{dayReminders.length > 0 && <div className="mt-1 flex flex-wrap justify-center gap-0.5">{dayReminders.slice(0, 3).map((r) => <span key={r.id} className={`h-1.5 w-1.5 rounded-full ${typeDot[r.type]}`} />)}</div>}</button>; })}
    </div>
  </div>;
}