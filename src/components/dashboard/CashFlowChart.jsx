import { useMemo } from 'react';
import { Area, ComposedChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from 'recharts';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const fmtEUR = (v) => `€ ${Math.round(v).toLocaleString('it-IT')}`;

export default function CashFlowChart({ properties, expenses, rentPayments }) {
  const data = useMemo(() => {
    const now = new Date();
    const monthlyRent = properties.reduce((s, p) => s + (p.monthly_rent || 0), 0);
    const monthlyCondo = properties.reduce((s, p) => s + (p.condo_fee || 0), 0);
    const monthlyTaxes = properties.reduce((s, p) => s + (p.monthly_rent || 0) * (p.tax_rate || 0) / 100 * (p.ownership_percentage || 100) / 100, 0);
    const monthlyMortgage = properties.reduce((s, p) => s + (p.mortgage_payment || 0), 0);
    const recurringExpenses = expenses.filter((e) => e.recurring && e.frequency === 'mensile').reduce((s, e) => s + (e.amount || 0), 0);
    const projIncome = monthlyRent + monthlyCondo;
    const projExpenses = monthlyTaxes + monthlyMortgage + recurringExpenses;
    const months = [];
    for (let i = 5; i >= 1; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = format(d, 'yyyy-MM');
      const label = format(d, 'MMM', { locale: it });
      const paid = rentPayments.filter((p) => (p.month || '').slice(0, 7) === key && (p.status === 'pagato' || p.status === 'parzialmente_pagato'));
      const actualIncome = paid.reduce((s, p) => s + (p.paid_amount || (p.rent_amount || 0) + (p.condo_fee || 0)), 0);
      months.push({ month: label, Entrate: Math.round(actualIncome || projIncome), Uscite: Math.round(projExpenses) });
    }
    for (let i = 0; i <= 5; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const label = format(d, 'MMM', { locale: it });
      months.push({ month: label, Entrate: Math.round(projIncome), Uscite: Math.round(projExpenses) });
    }
    return months.map((m) => ({ ...m, Saldo: Math.round(m.Entrate - m.Uscite) }));
  }, [properties, expenses, rentPayments]);

  if (!properties.length) return <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">Aggiungi un immobile per visualizzare il flusso di cassa.</p>;

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="gEnt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gUsc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)} width={40} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, color: 'hsl(var(--card-foreground))' }} formatter={(v) => fmtEUR(v)} />
          <Area type="monotone" dataKey="Entrate" stroke="#10b981" strokeWidth={2} fill="url(#gEnt)" />
          <Area type="monotone" dataKey="Uscite" stroke="#f43f5e" strokeWidth={2} fill="url(#gUsc)" />
          <Line type="monotone" dataKey="Saldo" stroke="#0d9488" strokeWidth={2} dot={false} strokeDasharray="4 4" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}