import { useState, forwardRef } from 'react';

type InputProps = {
  label?: string;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      type = 'text',
      showPasswordToggle = true,
      ...rest
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && isPasswordVisible ? 'text' : type;
    const showEyeIcon = isPassword && showPasswordToggle;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-label-sm text-slate-medium mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`w-full px-4 ${showEyeIcon ? 'pr-12' : 'pr-4'} py-3 rounded-sm text-body-md text-slate-dark placeholder:text-slate-muted outline-none border ${
              error
                ? 'border-error bg-error-low'
                : 'border-transparent bg-surface-highest'
            } focus:border-primary focus:ring-2 focus:ring-primary/20 ${className || ''}`}
            {...rest}
          />

          {showEyeIcon && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
              tabIndex={-1}
            >
              {isPasswordVisible ? (
                <img
                  src="/src/assets/icons/hidePassword.svg"
                  alt="Hide password"
                  className="w-5 h-5"
                />
              ) : (
                <img
                  src="/src/assets/icons/showPassword.svg"
                  alt="Show password"
                  className="w-5 h-5"
                />
              )}
            </button>
          )}
        </div>

        {error && <p className="text-error text-body-md mt-1">{error}</p>}

        {helperText && !error && (
          <p className="text-slate-light text-body-md mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
