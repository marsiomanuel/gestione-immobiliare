import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StyledSelect({ value, onChange, options, placeholder, className }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-auto rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm ${className || ''}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
        {options.map((o) => <SelectItem key={o.value} value={o.value} className="dark:text-slate-200 dark:focus:bg-slate-700">{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}