import Skeleton from '../../ui/skeleton';

export default function StatisticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-border-light">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-6 border border-border-light"
          >
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-10 w-20" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 border border-border-light">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="border border-border-light rounded-lg p-4 space-y-3"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-border-light">
          <Skeleton className="h-6 w-40 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="bg-white rounded-lg p-6 border border-border-light">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
