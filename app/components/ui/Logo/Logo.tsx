import Image from 'next/image';
export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/Logo.png" alt="logo" width={18} height={20} priority />
      <span className="text-logo  color-slate-dark">TASKLY</span>
    </div>
  );
}
