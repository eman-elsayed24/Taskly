import { formatDate } from '../../../utils/formatDate';
import UserAvatar from '../../ui/UserAvatar';

interface TaskCardProps {
  id: string;
  title: string;
  dueDate: string | null;
  assignee: {
    sub: string;
    name: string;
    email: string;
  } | null;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  dueDate,
  assignee,
  onClick,
}) => {
  // Check if date is overdue
  const isOverdue = (date: string | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  // Check if date is today
  const isToday = (date: string | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  };

  // Get card background and border
  const getCardStyle = () => {
    if (isOverdue(dueDate)) {
      return 'bg-error-background/20 border-error/10';
    }
    return 'bg-white border-slate-light/10';
  };

  // Get border left style for today
  const getTodayBorder = () => {
    if (isToday(dueDate)) {
      return 'border-l-4 border-l-primary';
    }
    return '';
  };

  // Get avatar style based on date
  const getAvatarVariantAndClass = (): {
    variant: 'auto' | 'primary';
    className?: string;
  } => {
    if (isToday(dueDate)) {
      return {
        variant: 'primary',
        className: 'bg-primary-container text-white border border-white',
      };
    }
    return { variant: 'auto' };
  };

  const avatarConfig = getAvatarVariantAndClass();

  return (
    <div
      className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border ${getCardStyle()} ${getTodayBorder()}`}
      onClick={onClick}
    >
      {/* Task Title */}
      <h4 className="text-body font-medium text-slate-dark mb-4 line-clamp-2 leading-5">
        {title}
      </h4>

      <div className="flex items-center justify-between">
        {/* Due Date */}
        <div className="flex items-center gap-2">
          {dueDate && (
            <>
              {isOverdue(dueDate) && (
                <svg
                  className="w-3.5 h-3.5 text-error"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span
                className={`text-label-sm font-bold uppercase ${
                  isOverdue(dueDate)
                    ? 'text-error'
                    : isToday(dueDate)
                      ? 'text-primary'
                      : 'text-slate-medium'
                }`}
              >
                {isOverdue(dueDate)
                  ? 'Delayed'
                  : isToday(dueDate)
                    ? 'Today'
                    : formatDate(dueDate)}
              </span>
            </>
          )}
        </div>

        {/* Assignee Avatar */}
        <UserAvatar
          name={assignee?.name}
          size="sm"
          variant={avatarConfig.variant}
          className={avatarConfig.className}
        />
      </div>
    </div>
  );
};

export default TaskCard;
