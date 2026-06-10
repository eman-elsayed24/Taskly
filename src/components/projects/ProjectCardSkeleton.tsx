import Skeleton from '../ui/skeleton';

export default function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 pb-6 md:p-6 shadow-sm border border-slate-light/30 min-h-[212px] md:min-h-[220px]">
      <Skeleton className="h-32 w-full mb-4 rounded" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
