import Skeleton from '../../ui/skeleton';

export default function EpicCardSkeleton() {
  return (
    <div className="bg-white rounded-md p-6 border-l-4 border-slate-light/30">
      {/* Badge Skeleton */}
      <Skeleton className="h-6 w-24 mb-4" />

      {/* Title Skeleton */}
      <Skeleton className="h-7 w-3/4 mb-6" />

      {/* Assignee Section Skeleton */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-light/20">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
