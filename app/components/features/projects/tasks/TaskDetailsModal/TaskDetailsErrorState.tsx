import { Button } from '@/app/components/ui/Button/Button';

interface TaskDetailsErrorStateProps {
  message: string;
  onClose: () => void;
}

export function TaskDetailsErrorState({
  message,
  onClose,
}: TaskDetailsErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-16 text-center">
      <p className="text-body-md text-slate-mid">{message}</p>
      <Button variant="ghost" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
