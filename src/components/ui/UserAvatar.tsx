import { getInitials } from '../../utils/stringHelpers';
import UnassignedIcon from '../../assets/icons/unassigned.svg?react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
type AvatarVariant = 'primary' | 'success' | 'slate' | 'auto';

interface UserAvatarProps {
  name?: string | null;
  size?: AvatarSize;
  variant?: AvatarVariant;
  showName?: boolean;
  className?: string;
  containerClassName?: string;
}

// Size mappings
const sizeClasses: Record<
  AvatarSize,
  { container: string; icon: string; text: string }
> = {
  xs: { container: 'w-6 h-6', icon: 'w-3 h-3', text: 'text-xs' },
  sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-label-sm' },
  md: { container: 'w-9 h-9', icon: 'w-4 h-4', text: 'text-sm' },
  lg: { container: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-sm' },
};

// Color mappings for auto variant (based on name hash)
const autoColors = [
  'bg-blue-500 text-white',
  'bg-purple-500 text-white',
  'bg-pink-500 text-white',
  'bg-indigo-500 text-white',
  'bg-teal-500 text-white',
  'bg-orange-500 text-white',
  'bg-cyan-500 text-white',
];

// Variant mappings
const variantClasses: Record<AvatarVariant, string> = {
  primary: 'bg-primary/20 text-primary',
  success: 'bg-success/20 text-success-dark',
  slate: 'bg-slate-light/30 text-slate-medium',
  auto: '', // Will be computed based on name
};

const getAutoColor = (name: string): string => {
  const index = name.charCodeAt(0) % autoColors.length;
  return autoColors[index];
};

export default function UserAvatar({
  name,
  size = 'md',
  variant = 'primary',
  showName = false,
  className = '',
  containerClassName = '',
}: UserAvatarProps) {
  const hasName = name && name.trim().length > 0;
  const avatarSize = sizeClasses[size];

  // Determine the color class
  let colorClass = variantClasses[variant];
  if (variant === 'auto' && hasName) {
    colorClass = getAutoColor(name);
  }

  // Unassigned state
  if (!hasName) {
    return (
      <div className={containerClassName}>
        <div
          className={`${avatarSize.container} rounded-lg bg-slate-light/20 flex items-center justify-center ${className}`}
          title="Unassigned"
        >
          <UnassignedIcon className={avatarSize.icon} />
        </div>
        {showName && (
          <span className="text-body-sm text-slate-light ml-2">Unassigned</span>
        )}
      </div>
    );
  }

  // Assigned state
  const initials = getInitials(name);

  return (
    <div className={`flex items-center gap-2 ${containerClassName}`}>
      <div
        className={`${avatarSize.container} rounded-lg ${colorClass} flex items-center justify-center font-bold ${avatarSize.text} ${className}`}
        title={name}
      >
        {initials}
      </div>
      {showName && (
        <span className="text-body-sm text-slate-medium">{name}</span>
      )}
    </div>
  );
}
