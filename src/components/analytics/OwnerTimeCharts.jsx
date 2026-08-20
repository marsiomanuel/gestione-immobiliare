import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const fmtMonth = (ym) => { const [y, m] = ym.split('-'); return `${MONTHS[parseInt(m) - 1]} ${y.slice(2)}`; };

export default function OwnerTimeCharts({ data }) {
  return <div className="space-y-6">
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Andamento entrate e uscite nel tempo</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.35} /><stop offset="95%" stopColor="#059669" stopOpacity={0} /></linearGradient>
            <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} /><stop offset="95%" stopColor="#dc2626" stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
          <Tooltip formatter={(v) => `€ ${Math.round(v).toLocaleString('it-IT')}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
          <Legend />
          <Area type="monotone" dataKey="income" name="Entrate" stroke="#059669" fill="url(#gInc)" strokeWidth={2} />
          <Area type="monotone" dataKey="expenses" name="Uscite" stroke="#dc2626" fill="url(#gExp)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Saldo cumulato nel tempo</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
          <Tooltip formatter={(v) => `€ ${Math.round(v).toLocaleString('it-IT')}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
          <Line type="monotone" dataKey="cumulative" name="Saldo cumulato" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>;
}