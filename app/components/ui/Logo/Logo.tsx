import LogoIcon from '@/public/Logo.svg';
interface LogoProps {
  collapsed?: boolean;
}
export default function Logo({ collapsed = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <LogoIcon width={18} height={20} />
      <span
        className={`text-logo color-slate-dark ${collapsed ? 'lg:hidden' : ''}`}
      >
        TASKLY
      </span>
    </div>
  );
}
