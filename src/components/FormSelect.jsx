import { useState } from 'react';
import StyledSelect from '@/components/StyledSelect';

export default function FormSelect({ name, defaultValue, options, placeholder, onChange, className }) {
  const [value, setValue] = useState(defaultValue || '');
  const handleChange = (v) => {
    setValue(v);
    onChange?.(v);
  };
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <StyledSelect value={value} onChange={handleChange} options={options} placeholder={placeholder} className={className} />
    </>
  );
}