interface CategoryBadgeProps {
  name: string;
  color?: string;
  icon?: string | null;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ name, color = '#E8002D', icon, size = 'md' }: CategoryBadgeProps) {
  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-2 py-0.5 gap-1'
    : 'text-xs px-3 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider w-fit ${sizeClasses}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {name}
    </span>
  );
}
