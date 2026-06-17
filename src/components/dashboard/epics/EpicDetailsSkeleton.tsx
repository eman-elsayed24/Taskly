import Skeleton from '../../ui/skeleton';

export default function EpicDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Description Skeleton */}
      <section className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </section>

      {/* Details Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Tasks Section Skeleton */}
      <section className="space-y-4 pt-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-32 rounded-lg" />
      </section>
    </div>
  );
}
