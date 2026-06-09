import type { InputHTMLAttributes } from 'react';
import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from 'react-hook-form';
import Input from './input';

type FormFieldProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'name'
> &
  UseControllerProps<TFieldValues> & {
    label?: string;
    helperText?: string;
    showPasswordToggle?: boolean;
  };

function FormField<TFieldValues extends FieldValues = FieldValues>(
  props: FormFieldProps<TFieldValues>
) {
  const { field, fieldState } = useController(props);

  const { label, helperText, showPasswordToggle, ...restHtmlProps } = props;

  return (
    <Input
      {...field}
      {...restHtmlProps}
      label={label}
      error={fieldState.error?.message}
      helperText={helperText}
      showPasswordToggle={showPasswordToggle}
    />
  );
}

export default FormField;
