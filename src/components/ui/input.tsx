import { useState, forwardRef } from 'react';
import showPasswordIcon from '../../assets/icons/showPassword.svg';
import hidePasswordIcon from '../../assets/icons/hidePassword.svg';

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
            className={`w-full px-4 ${showEyeIcon ? 'pr-12' : 'pr-4'} py-3 rounded-sm text-body-md text-slate-dark placeholder:text-slate-muted outline-none ${
              error ? ' bg-error-low' : ' bg-surface-highest'
            }   ${className || ''}`}
            {...rest}
          />

          {showEyeIcon && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {isPasswordVisible ? (
                <img src={hidePasswordIcon} alt="" className="w-5 h-5" />
              ) : (
                <img src={showPasswordIcon} alt="" className="w-5 h-5" />
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
