'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/app/components/ui/Input/Input';
import { Button } from '@/app/components/ui/Button/Button';
import { resetPasswordAction } from '@/app/actions/auth/resetPassword';
import EyeIcon from '@/assets/icons/eye.png';
import EyeOffIcon from '@/assets/icons/eyeoff.png';
import CheckIcon from '@/assets/icons/CheckIcon.png';
import CircleCheck from '@/assets/icons/RadioCircle.png';
import CircleEmpty from '@/assets/icons/Circle.png';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .max(64, 'Max 64 characters')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a digit')
      .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormSchema = z.infer<typeof schema>;

const checks = [
  {
    label: '8-64 characters',
    test: (v: string) => v.length >= 8 && v.length <= 64,
  },
  { label: 'Lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One digit', test: (v: string) => /[0-9]/.test(v) },
  {
    label: 'Special character',
    test: (v: string) => /[^a-zA-Z0-9]/.test(v),
  },
];

interface Props {
  accessToken: string;
}

export function ResetPasswordForm({ accessToken }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const onSubmit = async (data: FormSchema) => {
    console.log('accessToken being sent:', accessToken);
    setServerError(null);
    const result = await resetPasswordAction({
      password: data.password,
      accessToken,
    });
    console.log('result:', result);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push('/login'), 3000);
  };

  if (success) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-lg p-4 bg-success/20"
      >
        <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center ">
          <Image src={CheckIcon} alt="Success icon" width={16} height={16} />
        </span>
        <p className="text-body-md text-slate-mid">
          Your password has been updated successfully. You can now log in.
          Redirecting…
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
      noValidate
    >
      <div className="relative">
        <Input
          label="New Password"
          placeholder="Enter new password"
          type={showPassword ? 'text' : 'password'}
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-[2.1rem] text-slate-mid"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <Image
              src={EyeOffIcon}
              alt="Hide password"
              width={20}
              height={20}
            />
          ) : (
            <Image src={EyeIcon} alt="Show password" width={20} height={20} />
          )}
        </button>
      </div>

      <Input
        label="Confirm Password"
        placeholder="Confirm new password"
        type={showPassword ? 'text' : 'password'}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <div className="rounded-lg p-4 bg-surface-highest bg-opacity-50">
        <p className="text-label-sm text-slate-mid mb-3">
          SECURITY REQUIREMENTS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          {checks.map(({ label, test }) => {
            const passed = passwordValue ? test(passwordValue) : false;
            return (
              <div key={label} className="flex items-center gap-2">
                <Image
                  src={passed ? CircleCheck : CircleEmpty}
                  alt={passed ? 'passed' : 'not passed'}
                  width={15}
                  height={15}
                />
                <span
                  className={`text-body-sm ${passed ? '' : 'text-slate-mid'}`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Updating…' : 'Update Password'}
      </Button>

      <div className="flex justify-center">
        <Link
          href="/login"
          className=" text-primary font-medium flex items-center gap-1.5"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
