import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { forgotPasswordSchema } from '../../lib/validations/forgotPasswordSchema';
import type { ForgotPasswordFormData } from '../../lib/validations/forgotPasswordSchema';
import { resetPassword } from '../../api/authApi';
import BackArrowIcon from '../../assets/icons/backarrow.svg';
import TimerIcon from '../../assets/icons/timer.svg';
import CheckIcon from '../../assets/icons/check.svg';
import ReloadIcon from '../../assets/icons/reload.svg';
import { ROUTES } from '../../constants/routes';

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [trialsLeft, setTrialsLeft] = useState(3);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (trialsLeft <= 0) {
      toast.error('Maximum attempts reached. Please try again later.');
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      await resetPassword(data.email);
      setSuccessMessage(
        "If an account exists with this email, we've sent a password reset link."
      );
      setRemainingTime(300); // 5 minutes = 300 seconds
      setTrialsLeft(prev => prev - 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send reset link'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Reload Icon - Mobile Only - Always show after success */}
      {successMessage && (
        <div className="md:hidden flex justify-center mb-6">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || remainingTime > 0 || trialsLeft <= 0}
            className="p-3  bg-surface-highest rounded-lg disabled:opacity-50"
            aria-label="Resend email"
          >
            <img src={ReloadIcon} alt="" className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-heading-md text-slate-dark mb-2">
          Forgot password?
        </h1>
        <p className="text-body-md text-slate-medium">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <Input
          label="EMAIL ADDRESS"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading || remainingTime > 0 || trialsLeft <= 0}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      {/* Back to Login Link */}
      <div className="text-center mt-6">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-body-lg text-primary font-medium hover:underline"
        >
          <img src={BackArrowIcon} alt="" className="w-4 h-4" />
          Back to log in
        </Link>
      </div>

      {/* Success Message & Resend Section */}
      {successMessage && (
        <>
          {/* Desktop: Separate boxes */}
          <div className="hidden md:block mt-6">
            {/* Success Message */}
            <div className="p-4 bg-green-50 rounded-md flex items-start gap-3 mb-6">
              <img src={CheckIcon} alt="" className="shrink-0" />
              <p className="text-body-lg text-success-dark flex-1">
                {successMessage}
              </p>
            </div>

            {/* Resend Section */}
            <div>
              <p className="text-center text-label-sm text-slate-medium font-medium mb-3">
                DIDN'T RECEIVE THE EMAIL?
              </p>
              <Button
                type="button"
                variant="surface"
                fullWidth
                disabled={remainingTime > 0 || trialsLeft <= 0 || isLoading}
                onClick={handleSubmit(onSubmit)}
                className="border border-slate-light"
              >
                {remainingTime > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    <img src={TimerIcon} alt="" className="w-5 h-5" />
                    Resend in {formatTime(remainingTime)}
                  </span>
                ) : trialsLeft > 0 ? (
                  `Resend (${trialsLeft} ${trialsLeft === 1 ? 'trial' : 'trials'} left)`
                ) : (
                  'Maximum attempts reached'
                )}
              </Button>
            </div>
          </div>

          {/* Mobile: Combined box */}
          <div className="md:hidden mt-6 bg-green-50 rounded-lg overflow-hidden">
            {/* Success Message */}
            <div className="p-4 flex items-start gap-3">
              <img src={CheckIcon} alt="" className="shrink-0" />
              <p className="text-body-md text-green-800 flex-1">
                {successMessage}
              </p>
            </div>

            {/* Border Separator with padding */}
            <div className="px-4">
              <div className="border-t border-green-700/20"></div>
            </div>

            {/* Resend Info */}
            <div className="p-4 flex items-center justify-between">
              <p className="text-label-sm text-slate-medium font-medium">
                DIDN'T RECEIVE THE EMAIL?
              </p>
              <span className="text-body-md text-primary font-semibold">
                RESEND IN {formatTime(remainingTime)}
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ForgotPassword;
