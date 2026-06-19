import type { SelectHTMLAttributes, ReactNode } from 'react';
import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from 'react-hook-form';

type SelectFieldProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'defaultValue' | 'name'
> &
  UseControllerProps<TFieldValues> & {
    label?: string;
    helperText?: string;
    required?: boolean;
    children: ReactNode;
  };

function SelectField<TFieldValues extends FieldValues = FieldValues>(
  props: SelectFieldProps<TFieldValues>
) {
  const { field, fieldState } = useController(props);

  const { label, helperText, required, children, className, ...restHtmlProps } =
    props;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center gap-1 mb-2">
          <label className="block text-label-sm text-slate-medium">
            {label}
          </label>
          {required && <span className="text-error text-sm">*</span>}
        </div>
      )}

      <select
        {...field}
        {...restHtmlProps}
        className={`w-full px-4 py-3 rounded-sm text-body-md outline-none cursor-pointer ${
          fieldState.error ? 'bg-error-low' : 'bg-surface-highest'
        } ${!field.value ? 'text-slate-muted' : 'text-slate-dark'} ${className || ''}`}
      >
        {children}
      </select>

      {fieldState.error && (
        <p className="text-error text-body-sm mt-1">
          {fieldState.error.message}
        </p>
      )}

      {helperText && !fieldState.error && (
        <p className="text-slate-light text-body-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}

export default SelectField;
