import { getInitials } from '../../utils/stringHelpers';
import UnassignedIcon from '../../assets/icons/unassigned.svg?react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
type AvatarVariant = 'primary' | 'success' | 'info';

interface UserAvatarProps {
  name?: string | null;
  jobTitle?: string | null;
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

const variantClasses: Record<AvatarVariant, string> = {
  primary: 'bg-primary text-white',
  success: 'bg-success/20 text-success-dark',
  info: 'bg-surface-highest text-slate-dark',
};

export default function UserAvatar({
  name,
  jobTitle,
  size = 'md',
  variant = 'info',
  showName = false,
  className = '',
  containerClassName = '',
}: UserAvatarProps) {
  const hasName = name && name.trim().length > 0;
  const avatarSize = sizeClasses[size];
  const colorClass = variantClasses[variant];

  if (!hasName) {
    return (
      <div className={`flex items-center gap-2 ${containerClassName}`}>
        <div
          className={`${avatarSize.container} rounded-lg bg-slate-light/20 flex items-center justify-center ${className}`}
          title="Unassigned"
        >
          <UnassignedIcon className={avatarSize.icon} />
        </div>
        {showName && (
          <span className="text-sm text-slate-medium font-medium">
            Unassigned
          </span>
        )}
      </div>
    );
  }

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
        <div className="flex flex-col">
          <span className="text-sm text-slate-dark font-semibold">{name}</span>
          {jobTitle && (
            <span className="text-xs text-slate-medium">{jobTitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
