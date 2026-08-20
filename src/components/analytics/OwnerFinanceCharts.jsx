import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0f766e', '#b91c1c', '#2563eb', '#d97706', '#7c3aed', '#db2777', '#059669', '#ea580c', '#4f46e5'];

export default function OwnerFinanceCharts({ data }) {
  const netData = data.map((d) => ({ name: d.name, saldo: Math.round(d.income - d.expenses) }));
  return <div className="space-y-6">
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Entrate vs Uscite per proprietario</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
          <Tooltip formatter={(v) => `€ ${v.toLocaleString('it-IT')}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
          <Legend />
          <Bar dataKey="income" name="Entrate" fill="#059669" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expenses" name="Uscite" fill="#dc2626" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Distribuzione entrate</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data.filter((d) => d.income > 0)} dataKey="income" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => `${e.name}: €${Math.round(e.value).toLocaleString('it-IT')}`} labelLine={false} fontSize={11}>
              {data.filter((d) => d.income > 0).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => `€ ${v.toLocaleString('it-IT')}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Distribuzione uscite</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data.filter((d) => d.expenses > 0)} dataKey="expenses" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => `${e.name}: €${Math.round(e.value).toLocaleString('it-IT')}`} labelLine={false} fontSize={11}>
              {data.filter((d) => d.expenses > 0).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => `€ ${v.toLocaleString('it-IT')}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Saldo netto per proprietario</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={netData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
          <Tooltip formatter={(v) => `€ ${v.toLocaleString('it-IT')}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
          <Bar dataKey="saldo" name="Saldo netto" radius={[6, 6, 0, 0]}>
            {netData.map((d, i) => <Cell key={i} fill={d.saldo >= 0 ? '#059669' : '#dc2626'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>;
}