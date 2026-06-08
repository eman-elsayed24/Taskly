import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import PasswordRequirements from '../../components/auth/PasswordRequirements';
import { resetPasswordSchema } from '../../lib/validations/resetPasswordSchema';
import type { ResetPasswordFormData } from '../../lib/validations/resetPasswordSchema';
import { updatePassword } from '../../api/authApi';
import { ROUTES } from '../../constants/routes';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password', defaultValue: '' });

  useEffect(() => {
    const extractToken = () => {
      // Try to get access_token from query params first
      let token = searchParams.get('access_token');

      // If not found, try hash (#access_token=...&type=recovery)
      if (!token) {
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        if (
          hashParams.get('type') === 'recovery' ||
          hashParams.has('access_token')
        ) {
          token = hashParams.get('access_token');
          // Clean URL after extracting from hash
          if (token) {
            window.history.replaceState(null, '', '/reset-password');
          }
        }
      }

      if (token) {
        setAccessToken(token);
        setVerificationError('');
      } else {
        setVerificationError('Invalid or expired reset link.');
      }
      setIsVerifying(false);
    };

    extractToken();
  }, [searchParams]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate(ROUTES.LOGIN, { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!accessToken) {
      toast.error('Invalid or expired reset link.');
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(accessToken, data.password);
      toast.success('Password updated successfully!');
      setSuccessMessage(
        'Your password has been updated successfully. You can now log in'
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to reset password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while verifying token
  if (isVerifying) {
    return (
      <div className="text-center py-8">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-body-md text-slate-medium">
          Validating reset link...
        </p>
      </div>
    );
  }

  // Show error if verification failed
  if (verificationError || !accessToken) {
    return (
      <>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-heading-md text-slate-dark mb-2">
            Invalid or Expired Link
          </h1>
          <p className="text-body-md text-slate-medium mb-2">
            {verificationError || 'Invalid or expired reset link.'}
          </p>
          <p className="text-body-sm text-slate-medium">
            Please request a new password reset link.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
          >
            Request New Link
          </Button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="w-full text-body-md text-slate-medium hover:text-slate-dark transition-colors"
          >
            Back to Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-heading-md text-slate-dark mb-2">
          Create a New Password
        </h1>
        <p className="text-body-md text-slate-medium">
          Create a new, strong password to secure your workstation access.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password Fields */}
        <div className="space-y-4">
          {/* New Password */}
          <Input
            label="NEW PASSWORD"
            type="password"
            placeholder="Enter new password"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Confirm Password */}
          <Input
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            showPasswordToggle={false}
            {...register('confirmPassword')}
          />
        </div>

        {/* Password Requirements */}
        <PasswordRequirements password={password} variant="reset" />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading || !!successMessage}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <svg
            className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-body-md text-green-800 font-medium">
              {successMessage}
            </p>
            <p className="text-body-sm text-green-700 mt-1">
              Redirecting to login page...
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
