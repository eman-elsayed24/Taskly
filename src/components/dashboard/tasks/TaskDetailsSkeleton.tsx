import Skeleton from '../../ui/skeleton';

export default function TaskDetailsSkeleton() {
  return (
    <div className="h-full grid grid-cols-[1fr_320px]">
   
      <div className="flex flex-col">
      
        <div className="border-b border-slate-light/20 p-8">
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-3/4 mb-2" />
          <Skeleton className="h-9 w-1/2" />
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <Skeleton className="h-4 w-24 mb-4" />
          <div className="space-y-2 max-w-3xl">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <div className="bg-surface-low flex items-center justify-between border-t border-slate-light/20 px-8 py-5">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>

   
      <aside className="border-l border-slate-light/20 bg-surface-low p-6 overflow-y-auto">
        <div className="space-y-6">
  
          <div>
            <Skeleton className="h-3 w-12 mb-3" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

 
          <div>
            <Skeleton className="h-3 w-16 mb-3" />
            <div className="rounded-xl bg-white p-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

         
          <div>
            <Skeleton className="h-3 w-16 mb-3" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          <hr className="border-slate-light/20" />

     
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
