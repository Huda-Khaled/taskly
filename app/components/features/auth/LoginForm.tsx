'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginSchema, type LoginSchema } from '@/app/lib/validations/auth';
import { Input } from '@/app/components/ui/Input/Input';
import { Button } from '@/app/components/ui/Button/Button';
import { loginAction } from '@/app/actions/auth/login';
import Link from 'next/link';
import Image from 'next/image';
import EmailIcon from '@/assets/icons/Text.png';
import EyeIcon from '@/assets/icons/eye.png';
import EyeOffIcon from '@/assets/icons/eyeoff.png';

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema) as Resolver<LoginSchema>,
    mode: 'onTouched',
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginSchema) => {
    setServerError(null);

    const result = await loginAction({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });

    if (result.error) {
      setServerError(result.error);
      return;
    }

    router.push('/');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
      noValidate
    >
      <Input
        label="Email"
        placeholder="yourname@company.com"
        type="email"
        error={errors.email?.message}
        aria-required="true"
        aria-invalid={!!errors.email}
        {...register('email')}
        endIcon={
          <Image src={EmailIcon} alt="Email icon" width={20} height={20} />
        }
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        type={showPassword ? 'text' : 'password'}
        error={errors.password?.message}
        aria-required="true"
        aria-invalid={!!errors.password}
        {...register('password')}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Image
              src={showPassword ? EyeOffIcon : EyeIcon}
              alt={showPassword ? 'Hide password' : 'Show password'}
              width={20}
              height={20}
            />
          </button>
        }
        labelAction={
          <Link
            href="/forgot-password"
            className="text-label-sm text-primary font-semibold md:hidden"
          >
            Forgot?
          </Link>
        }
      />

      <div className="hidden md:flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-body-md text-slate-mid">Remember me</span>
        </label>

        <Link
          href="/forgot-password"
          className="text-body-md text-primary font-semibold"
        >
          Forgot password?
        </Link>
      </div>

      <div className="flex md:hidden items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-body-md text-slate-mid">Remember me</span>
        </label>
      </div>

      {serverError && (
        <p
          role="alert"
          aria-live="assertive"
          className="text-sm text-error text-center"
        >
          {serverError}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </Button>

      <p className="text-center text-slate-mid">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-primary font-semibold">
          Sign up
        </Link>
      </p>
    </form>
  );
}
