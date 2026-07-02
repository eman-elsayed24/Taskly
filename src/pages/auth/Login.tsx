import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/button';
import { loginSchema } from '../../lib/validations/loginSchema';
import type { LoginFormData } from '../../lib/validations/loginSchema';
import { loginUser } from '../../api/authApi';
import { storeTokens } from '../../lib/cookies';
import mailIcon from '../../assets/icons/mail.svg';
import { ROUTES } from '../../constants/routes';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const { control, handleSubmit, register } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      storeTokens(
        {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        },
        data.rememberMe
      );

      toast.success('Welcome back!');

      if (returnUrl) {
        navigate(decodeURIComponent(returnUrl));
      } else {
        navigate(ROUTES.PROJECTS);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-heading-md text-slate-dark mb-2">Welcome Back</h1>
        <p className="text-body-md text-slate-medium">
          Please enter your details to access your workspace
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="relative">
          <div className="absolute right-4 top-[38px] md:hidden pointer-events-none z-10">
            <img src={mailIcon} alt="" className="w-5 h-5" />
          </div>
          <FormField
            control={control}
            name="email"
            label="EMAIL"
            type="email"
            placeholder="yourname@company.com"
            className="md:pr-4 pr-12"
          />
        </div>

        {/* Password Field */}
        <FormField
          control={control}
          name="password"
          label="PASSWORD"
          type="password"
          placeholder="Enter your password"
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-light text-primary focus:ring-2 focus:ring-primary/20"
              {...register('rememberMe')}
            />
            <span className="text-body-md text-slate-medium">Remember Me</span>
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-body-md text-primary font-medium hover:underline"
          >
            <span className="md:hidden">Forgot?</span>
            <span className="hidden md:inline">Forgot Password?</span>
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-body-md text-slate-medium">
          Don't have an account?{' '}
          <Link
            to={ROUTES.SIGNUP}
            className="text-primary font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}

export default Login;
