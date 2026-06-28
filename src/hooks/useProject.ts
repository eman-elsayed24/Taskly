import { useState, useEffect } from 'react';
import { getProjectById } from '../api/projectApi';
import type { Project } from '../types/project';
import toast from 'react-hot-toast';

// In-memory cache storing project data with timestamp
const projectCache = new Map<string, { data: Project; cachedAt: number }>();

const CACHE_DURATION = 5 * 60 * 1000; // Cache expires after 5 minutes

export function useProject(projectId: string | undefined) {
  // Get cached data if it exists and is still valid
  const getCachedData = (id: string | undefined) => {
    if (!id) return null;
    const cached = projectCache.get(id);
    if (cached && Date.now() - cached.cachedAt < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  const [project, setProject] = useState<Project | null>(() =>
    getCachedData(projectId)
  );
  const [isLoading, setIsLoading] = useState(
    () => !projectId || !getCachedData(projectId)
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // If cached data is valid, use it immediately
    const cachedData = getCachedData(projectId);
    if (cachedData) {
      setProject(cachedData);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Otherwise, fetch from API
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchProject = async () => {
      try {
        const projectData = await getProjectById(projectId);

        if (isMounted) {
          // Store data with current timestamp
          projectCache.set(projectId, {
            data: projectData,
            cachedAt: Date.now(),
          });
          setProject(projectData);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const error =
            err instanceof Error ? err : new Error('Failed to load project');
          setError(error);
          setIsLoading(false);
          toast.error(error.message);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return { project, isLoading, error };
}

export function clearProjectCache(projectId?: string) {
  if (projectId) {
    projectCache.delete(projectId);
  } else {
    projectCache.clear();
  }
}
