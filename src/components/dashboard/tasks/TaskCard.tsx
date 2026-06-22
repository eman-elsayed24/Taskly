import { formatDate } from '../../../utils/formatDate';

interface TaskCardProps {
  id: string;
  title: string;
  dueDate: string | null;
  assignee: {
    sub: string;
    name: string;
    email: string;
  } | null;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, dueDate, assignee }) => {
  // Generate a color for avatar based on assignee name
  const getAvatarColor = (name: string | null | undefined) => {
    if (!name) return 'bg-slate-400';
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get initials from name
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
  const getAvatarStyle = () => {
    if (isToday(dueDate)) {
      return 'bg-primary-container text-white border border-white';
    }
    if (assignee) {
      return `${getAvatarColor(assignee.name)} text-white`;
    }
    return 'bg-surface-high text-slate-dark';
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border ${getCardStyle()} ${getTodayBorder()}`}
    >
      {/* Task Title */}
      <h4 className="text-body font-medium text-slate-dark mb-4 line-clamp-2 leading-5">
        {title}
      </h4>

      {/* Task Footer */}
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
        {assignee ? (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm font-bold ${getAvatarStyle()}`}
            title={assignee.name}
          >
            {getInitials(assignee.name)}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-light/50 flex items-center justify-center">
            <span className="text-slate-medium text-label-sm">?</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
