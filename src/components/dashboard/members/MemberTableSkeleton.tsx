import Skeleton from '../../ui/skeleton';

export default function MemberTableSkeleton() {
  return (
    <div className="w-full">
      {/* Desktop Table Skeleton */}
      <div className="hidden sm:block">
        <table className="w-full border border-slate-light/30">
          <thead className="bg-surface-low">
            <tr>
              <th className="py-4 px-6 text-left">
                <Skeleton className="h-3 w-16" />
              </th>
              <th className="py-4 px-6 text-left">
                <Skeleton className="h-3 w-12" />
              </th>
              <th className="py-4 px-6 text-right">
                <Skeleton className="h-3 w-16" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-t border-slate-light/30">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-end">
                    <Skeleton className="w-9 h-9 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="sm:hidden space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-md p-4 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0 max-w-[60%]">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="min-w-0">
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="w-6 h-6 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
