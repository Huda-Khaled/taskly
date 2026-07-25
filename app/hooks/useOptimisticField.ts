'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  updateTaskAction,
  type UpdateTaskInput,
} from '@/app/actions/tasks/updateTask';

type FieldKey = keyof UpdateTaskInput;

interface UseOptimisticFieldOptions<T> {
  taskId: string;
  field: FieldKey;
  initialValue: T;
  validate?: (value: T) => string | null | undefined;
  serialize?: (value: T) => UpdateTaskInput[FieldKey];
  successMessage?: string;
}

export function useOptimisticField<T>({
  taskId,
  field,
  initialValue,
  validate,
  serialize,
  successMessage,
}: UseOptimisticFieldOptions<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  const previousValueRef = useRef<T>(initialValue);

  const save = useCallback(
    async (nextValue: T) => {
      const previousValue = previousValueRef.current;
      if (nextValue === previousValue) return;
      if (validate) {
        const validationError = validate(nextValue);
        if (validationError) {
          setValue(previousValue);
          toast.error(validationError);
          return;
        }
      }

      setValue(nextValue);
      setIsSaving(true);

      const payloadValue = serialize
        ? serialize(nextValue)
        : (nextValue as unknown as UpdateTaskInput[FieldKey]);

      const result = await updateTaskAction(taskId, {
        [field]: payloadValue,
      } as UpdateTaskInput);

      setIsSaving(false);

      if (result.error) {
        setValue(previousValue);
        toast.error('Failed to update task. Please try again.');
        return;
      }
      previousValueRef.current = nextValue;
      if (successMessage) toast.success(successMessage);
    },
    [taskId, field, validate, serialize, successMessage]
  );

  return { value, setValue, isSaving, save };
}
