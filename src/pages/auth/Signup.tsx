import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import PasswordRequirements from '../../components/auth/PasswordRequirements';
import { signupSchema } from '../../lib/validations/signupSchema';
import type { SignupFormData } from '../../lib/validations/signupSchema';
import { signupUser } from '../../api/authApi';
import { storeTokens } from '../../lib/cookies';
import { ROUTES } from '../../constants/routes';

function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password', defaultValue: '' });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const response = await signupUser({
        name: data.name,
        email: data.email,
        password: data.password,
        jobTitle: data.jobTitle,
      });

      storeTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      toast.success('Account created successfully!');
      navigate(ROUTES.PROJECTS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-heading-md text-slate-dark mb-2">
          Create your workspace
        </h1>
        <p className="text-body-md text-slate-medium">
          Join the editorial approach to task management.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <Input
          label="NAME"
          type="text"
          placeholder="Enter your full name"
          error={errors.name?.message}
          helperText="3-50 characters, letters only."
          {...register('name')}
        />

        {/* Email Field */}
        <Input
          label="EMAIL"
          type="email"
          placeholder="yourname@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Job Title Field (Optional) */}
        <Input
          label="JOB TITLE (OPTIONAL)"
          type="text"
          placeholder="e.g. Project Manager"
          {...register('jobTitle')}
        />

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <Input
            label="PASSWORD"
            type="password"
            placeholder="Password"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Confirm Password - No toggle icon */}
          <Input
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            showPasswordToggle={false}
            {...register('confirmPassword')}
          />
        </div>

        {/* Password Requirements */}
        <PasswordRequirements password={password} />

        {/* Submit Button */}
        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-body-md text-slate-medium">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}

export default Signup;
