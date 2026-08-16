'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Input } from '@/app/components/ui/Input/Input';
import { Button } from '@/app/components/ui/Button/Button';
import { useForgotPassword } from './hooks/useForgotPassword';
import {
  forgotPasswordSchema,
  ForgotPasswordFormSchema,
  RESEND_SECONDS,
  MAX_TRIALS,
} from '@/app/lib/validations/forgotPassword';
import LongArrow from '@/assets/icons/LongArrow.svg';
import TimerIcon from '@/assets/icons/Timer.svg';
import CheckIcon from '@/assets/icons/CheckIcon.svg';
import EmailIcon from '@/assets/icons/Text.svg';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [trials, setTrials] = useState(0);

  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
  });

  // Drives the resend countdown. Runs whenever `trials` changes (i.e. a
  // successful submit happened). Only subscribes to the external timer
  // (setInterval) and calls setState from within its callback — the
  // initial countdown value is set in the onSubmit event handler instead,
  // so the effect body itself never calls setState synchronously.
  useEffect(() => {
    if (trials === 0) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [trials]);

  const onSubmit = async (data: ForgotPasswordFormSchema) => {
    try {
      const result = await forgotPassword({ email: data.email });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setSubmitted(true);
      setTimeLeft(RESEND_SECONDS);
      setTrials((t) => t + 1);
    } catch {
      toast.error(
        'No internet connection. Please check your network and try again.'
      );
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const submitDisabled = isPending || timeLeft > 0 || trials >= MAX_TRIALS;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
      noValidate
    >
      <Input
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
        endIcon={<EmailIcon width={20} height={20} />}
      />
      <Button type="submit" variant="primary" disabled={submitDisabled}>
        {isPending ? 'Sending...' : 'Send Reset Link'}
      </Button>
      <div className="flex justify-center">
        <Link
          href="/login"
          className=" text-primary font-medium flex items-center gap-1.5"
        >
          <span>
            <LongArrow />
          </span>
          Back to log in
        </Link>
      </div>
      {submitted && (
        <div className="flex flex-col gap-4 mt-2">
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-lg p-4 bg-success/20"
          >
            <CheckIcon width={20} height={20} />
            <p className="text-body-md text-slate-mid">
              If an account exists with this email, we&apos;ve sent a password
              reset link.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-label-sm text-slate-mid">
              DIDN&apos;T RECEIVE THE EMAIL?
            </p>

            {trials >= MAX_TRIALS && (
              <p className="text-body-md text-error text-center">
                Maximum resend attempts reached.
              </p>
            )}

            <button
              type="button"
              className="w-full h-12 rounded-sm flex items-center justify-center gap-3 text-body-md font-medium transition-all duration-150 disabled:cursor-not-allowed bg-surface-highest text-primary"
            >
              {timeLeft > 0 ? (
                <>
                  <TimerIcon width={20} height={20} />
                  Resend in {formatTime(timeLeft)}
                </>
              ) : (
                'Resend Email'
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
