import type { TextareaHTMLAttributes } from 'react';
import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from 'react-hook-form';

type TextareaFieldProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'defaultValue' | 'name'
> &
  UseControllerProps<TFieldValues> & {
    label?: string;
    helperText?: string;
    required?: boolean;
    showCharCount?: boolean;
    maxCharCount?: number;
    showOptional?: boolean;
  };

function TextareaField<TFieldValues extends FieldValues = FieldValues>(
  props: TextareaFieldProps<TFieldValues>
) {
  const { field, fieldState } = useController(props);

  const {
    label,
    helperText,
    required,
    showCharCount,
    maxCharCount,
    showOptional,
    className,
    ...restHtmlProps
  } = props;

  const currentLength = field.value?.length || 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <label className="block text-label-sm text-slate-medium">
              {label}
            </label>
            {required && <span className="text-error text-sm">*</span>}
          </div>
          {showOptional && !required && (
            <span className="text-sm text-slate-light">Optional</span>
          )}
        </div>
      )}

      <textarea
        {...field}
        {...restHtmlProps}
        className={`w-full px-4 py-3 rounded-sm text-body-md text-slate-dark placeholder:text-slate-muted outline-none resize-none ${
          fieldState.error ? 'bg-error-low' : 'bg-surface-highest'
        } ${className || ''}`}
      />

      <div className="flex items-center justify-between mt-1">
        {fieldState.error ? (
          <p className="text-error text-body-sm">{fieldState.error.message}</p>
        ) : helperText ? (
          <p className="text-slate-light text-body-sm">{helperText}</p>
        ) : (
          <span />
        )}

        {showCharCount && maxCharCount && (
          <p className="text-sm text-slate-light">
            {currentLength} / {maxCharCount} characters
          </p>
        )}
      </div>
    </div>
  );
}

export default TextareaField;
