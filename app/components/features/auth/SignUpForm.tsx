'use client';

import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useWatch } from 'react-hook-form';
import { useState } from 'react';
import { signUpSchema, type SignUpSchema } from '@/app/lib/validations/auth';
import { Input } from '@/app/components/ui/Input/Input';
import { Button } from '@/app/components/ui/Button/Button';
import { PasswordChecklist } from '@/app/components/ui/PasswordChecklist/PasswordChecklist';
import { signUpAction } from '@/app/actions/auth/signup';
import EyeIcon from '@/assets/icons/eye.png';
import EyeOffIcon from '@/assets/icons/eyeoff.png';
import Link from 'next/link';

export function SignUpForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
  });

  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const onSubmit = async (data: SignUpSchema) => {
    setServerError(null);

    const result = await signUpAction({
      email: data.email,
      password: data.password,
      name: data.name,
      jobTitle: data.jobTitle,
    });

    if (result.error) {
      setServerError(result.error);
      return;
    }

    router.push('/project');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
      noValidate
    >
      <Input
        label="Name"
        placeholder="Enter your full name"
        type="text"
        hint="3-50 characters, letters only."
        error={errors.name?.message}
        aria-required="true"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? 'name-error' : 'name-hint'}
        {...register('name')}
      />

      <Input
        label="Email"
        placeholder="yourname@company.com"
        type="email"
        error={errors.email?.message}
        aria-required="true"
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? 'email-error' : undefined}
        {...register('email')}
      />

      <Input
        label="Job Title (Optional)"
        placeholder="e.g. Project Manager"
        type="text"
        error={errors.jobTitle?.message}
        aria-required="false"
        {...register('jobTitle')}
      />

      <div className="flex gap-4 w-full flex-col md:flex-row">
        <div className="w-full ">
          <Input
            label="Password"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            error={errors.password?.message}
            aria-required="true"
            aria-invalid={!!errors.password}
            aria-describedby="password-rules"
            {...register('password')}
            endIcon={
              <button
                type="button"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                  setShowConfirmPassword((prev) => !prev);
                }}
              >
                <Image
                  src={showPassword ? EyeIcon : EyeOffIcon}
                  alt={showPassword ? 'show password' : 'hide password'}
                  width={20}
                  height={20}
                />
              </button>
            }
          />
        </div>

        <div className="w-full">
          <Input
            label="Confirm Password"
            placeholder="Repeat your password"
            type={showConfirmPassword ? 'text' : 'password'}
            error={errors.confirmPassword?.message}
            aria-required="true"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? 'confirm-error' : undefined
            }
            {...register('confirmPassword')}
          />
        </div>
      </div>

      <div id="password-rules" aria-live="polite">
        <PasswordChecklist password={passwordValue} />
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
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-slate-mid">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-semibold">
          Log in
        </Link>
      </p>
    </form>
  );
}
