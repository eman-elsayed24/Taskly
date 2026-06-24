import TaskListItemSkeleton from './TaskListItemSkeleton';

const thStyle =
  'text-secondary py-3 px-6 font-bold text-label-sm uppercase tracking-wide text-left';

export default function TasksListSkeleton() {
  return (
    <>
      {/* Desktop Skeleton */}
      <div className="hidden lg:block rounded-lg shadow-sm overflow-hidden border border-surface-high">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-transparent">
              <tr className="border-b border-slate-light/20">
                <th className={`${thStyle} w-32`}>Task ID</th>
                <th className={`${thStyle} w-1/4`}>Title</th>
                <th className={`${thStyle} w-1/6`}>Status</th>
                <th className={`${thStyle} w-1/6`}>Due Date</th>
                <th className={`${thStyle} w-1/6`}>Assignee</th>
                <th className={`${thStyle} w-16`}></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {Array.from({ length: 5 }).map((_, index) => (
                <TaskListItemSkeleton key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="lg:hidden space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 border border-surface-high"
          >
            <div className="h-4 w-20 bg-surface-highest rounded animate-pulse mb-2" />
            <div className="h-5 w-full bg-surface-highest rounded animate-pulse mb-3" />
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-20 bg-surface-highest rounded animate-pulse" />
              <div className="h-4 w-24 bg-surface-highest rounded animate-pulse" />
            </div>
            <div className="h-4 w-32 bg-surface-highest rounded animate-pulse" />
          </div>
        ))}
      </div>
    </>
  );
}
