import Skeleton from '../../ui/skeleton';

export default function TaskListItemSkeleton() {
  const tdStyle = 'py-4 px-6';

  return (
    <tr className="border-b border-slate-light/20">
      {/* Task ID */}
      <td className={tdStyle}>
        <Skeleton className="h-4 w-20" />
      </td>

      {/* Title */}
      <td className={tdStyle}>
        <Skeleton className="h-5 w-3/4" />
      </td>

      {/* Status Badge */}
      <td className={tdStyle}>
        <Skeleton className="h-6 w-24 rounded-full" />
      </td>

      {/* Due Date */}
      <td className={tdStyle}>
        <Skeleton className="h-4 w-20" />
      </td>

      {/* Assignee */}
      <td className={tdStyle}>
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-4 w-28" />
        </div>
      </td>

      {/* Actions */}
      <td className={`${tdStyle} text-center`}>
        <Skeleton className="w-5 h-5 mx-auto" />
      </td>
    </tr>
  );
}
