import Skeleton from '../../ui/skeleton';

export default function TaskListItemSkeleton() {
  const tdStyle = 'py-4 px-6';

  return (
    <tr className="border-b border-surface-low">
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
    </tr>
  );
}
