interface MemberAvatarProps {
  name: string;
  size?: number;
  radius?: number;
  fontSize?: number;
}

const palette = [
  { bg: 'bg-surface-highest', text: 'text-primary' },
  { bg: 'bg-success', text: 'text-slate-dark' },
] as const;

function getInitials(name: string): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function getPaletteIndex(name: string): number {
  const safeName = name ?? '';
  const sum = safeName
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return sum % palette.length;
}

function getFontSize(size: number): number {
  return Math.max(8, Math.round(size * 0.4));
}

export function MemberAvatar({
  name,
  size = 36,
  radius = 4,
  fontSize,
}: MemberAvatarProps) {
  const initials = getInitials(name);
  const color = palette[getPaletteIndex(name)];
  const resolvedFontSize = fontSize ?? getFontSize(size);

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center font-bold ${color.bg} ${color.text}`}
      style={{
        fontSize: resolvedFontSize,
        width: size,
        height: size,
        borderRadius: radius,
        paddingTop: 6,
        paddingBottom: 7,
      }}
    >
      {initials}
    </div>
  );
}
