type PasswordRequirementsProps = {
  password: string;
  variant?: 'signup' | 'reset';
};

export default function PasswordRequirements({
  password,
  variant = 'signup',
}: PasswordRequirementsProps) {
  // Signup Requirements (3 items, column layout, no title)
  const signupRequirements = [
    {
      id: 'minLength',
      met: password.length >= 8,
      label: 'At least 8 characters',
    },
    {
      id: 'hasUpperLowerDigit',
      met:
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password),
      label: 'One uppercase, lowercase, and digit',
    },
    {
      id: 'hasSpecial',
      met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      label: 'One special character',
    },
  ];

  // Reset Password Requirements (5 items, grid layout, with title)
  const resetRequirements = [
    {
      id: 'minLength',
      met: password.length >= 8 && password.length <= 64,
      label: '8 - 64 characters',
    },
    {
      id: 'hasUppercase',
      met: /[A-Z]/.test(password),
      label: 'Uppercase letter',
    },
    {
      id: 'hasLowercase',
      met: /[a-z]/.test(password),
      label: 'Lowercase letter',
    },
    {
      id: 'hasDigit',
      met: /[0-9]/.test(password),
      label: 'At least one digit',
    },
    {
      id: 'hasSpecial',
      met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      label: 'Special character (e.g. !@#$%)',
    },
  ];

  const isReset = variant === 'reset';
  const requirements = isReset ? resetRequirements : signupRequirements;
  const containerClass = isReset
    ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
    : 'flex flex-col gap-2';
  const bgColor = isReset ? 'bg-[#F1F3FF80]' : 'bg-[#E8EDFF]';

  return (
    <div className={`flex flex-col rounded-md p-4 w-full ${bgColor}`}>
      {isReset && (
        <p className="text-label-sm text-slate-medium mb-3 pb-2 border-b border-slate-light">
          SECURITY REQUIREMENTS
        </p>
      )}
      <div className={containerClass}>
        {requirements.map(req => (
          <div key={req.id} className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-success-dark text-[10px] font-bold border-2 ${
                req.met ? ' border-success-dark' : ' border-slate-muted'
              }`}
            >
              {req.met && '✓'}
            </div>
            <span
              className={`text-body-md ${
                isReset
                  ? req.met
                    ? 'text-slate-dark'
                    : 'text-slate-light'
                  : 'text-slate-dark'
              }`}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
