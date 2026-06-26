import { useState } from 'react';
import { useDebounce } from './useDebounce';

export function useTasksSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
  };
}
