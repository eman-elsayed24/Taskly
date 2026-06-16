interface InfiniteScrollLoaderProps {
  loading: boolean;
  hasMore: boolean;
  observerTarget: (node: HTMLDivElement | null) => void;
}

export default function InfiniteScrollLoader({
  loading,
  hasMore,
  observerTarget,
}: InfiniteScrollLoaderProps) {
  if (!hasMore && !loading) return null;

  return (
    <div ref={observerTarget} className="flex justify-center py-4 sm:hidden">
      {loading && (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      )}
    </div>
  );
}
