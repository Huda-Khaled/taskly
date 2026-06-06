'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Input } from '@/app/components/ui/Input/Input';
import { Button } from '@/app/components/ui/Button/Button';
import { forgotPasswordAction } from '@/app/actions/auth/forgotPassword';
import {
  forgotPasswordSchema,
  ForgotPasswordFormSchema,
  RESEND_SECONDS,
  MAX_TRIALS,
} from '@/app/lib/validations/forgotPassword.schema';
import LongArrow from '@/assets/icons/LongArrow.png';
import EmailIcon from '@/assets/icons/Text.png';
import TimerIcon from '@/assets/icons/Timer.png';
import CheckIcon from '@/assets/icons/CheckIcon.png';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [trials, setTrials] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
  });

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(RESEND_SECONDS);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (timeLeft === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const onSubmit = async (data: ForgotPasswordFormSchema) => {
    setServerError(null);
    const result = await forgotPasswordAction({ email: data.email });
    if (result.error) {
      setServerError(result.error);
      return;
    }
    setSubmitted(true);
    setTrials((t) => t + 1);
    startTimer();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const submitDisabled = isSubmitting || timeLeft > 0 || trials >= MAX_TRIALS;

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
        endIcon={
          <Image src={EmailIcon} alt="Email icon" width={20} height={20} />
        }
      />

      {serverError && (
        <p
          role="alert"
          aria-live="assertive"
          className="text-sm text-error text-center"
        >
          {serverError}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={submitDisabled}>
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </Button>

      <div className="flex justify-center">
        <Link
          href="/login"
          className=" text-primary font-medium flex items-center gap-1.5"
        >
          <span>
            <Image src={LongArrow} alt="arrowicon" width={16} height={16} />
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
            <Image src={CheckIcon} alt="Success icon" width={20} height={20} />
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
                  <Image
                    src={TimerIcon}
                    alt="Timer icon"
                    width={18}
                    height={21}
                  />
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
