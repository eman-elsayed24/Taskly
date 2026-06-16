import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  initialItems: T[];
  totalCount: number;
  pageSize: number;
  fetchMore: (
    offset: number,
    limit: number
  ) => Promise<{ data: T[]; totalCount: number }>;
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  observerTarget: (node: HTMLDivElement | null) => void;
}

export function useInfiniteScroll<T>({
  initialItems,
  totalCount,
  pageSize,
  fetchMore,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(totalCount);
  const observer = useRef<IntersectionObserver | null>(null);

  const hasMore = items.length < total;

  // Reset items when initialItems changes (e.g., when changing projects)
  useEffect(() => {
    setItems(initialItems);
    setTotal(totalCount);
  }, [initialItems, totalCount]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const offset = items.length;
      const response = await fetchMore(offset, pageSize);

      setItems(prev => [...prev, ...response.data]);
      setTotal(response.totalCount);
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, items.length, pageSize, fetchMore]);

  // Intersection Observer callback
  const observerTarget = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return {
    items,
    loading,
    hasMore,
    loadMore,
    observerTarget,
  };
}
