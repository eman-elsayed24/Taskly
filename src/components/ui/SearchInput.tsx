import type { InputHTMLAttributes } from 'react';
import SearchIcon from '../../assets/icons/search.svg?react';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...rest
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 pl-10 rounded-sm text-body-md text-slate-dark placeholder:text-slate-muted bg-surface-highest outline-none border border-transparent focus:border-primary/20"
        {...rest}
      />
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-muted pointer-events-none" />
    </div>
  );
}
