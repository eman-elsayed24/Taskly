import Skeleton from '../../ui/skeleton';

export default function TaskCardSkeleton() {
  return (
    <div className="p-4 rounded-lg shadow-sm bg-white border border-slate-light/10">
      {/* Task Title Skeleton */}
      <div className="mb-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Task Footer Skeleton */}
      <div className="flex items-center justify-between">
        {/* Due Date Skeleton */}
        <Skeleton className="h-4 w-16" />

        {/* Avatar Skeleton */}
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  );
}
