import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProjectForm from '../../components/dashboard/projects/ProjectForm';
import Spinner from '../../components/ui/spinner';
import ErrorState from '../../components/ui/ErrorState';
import type { ProjectFormData } from '../../lib/validations/projectSchema';
import { getProjectById, updateProject } from '../../api/projectApi';
import { ROUTES } from '../../constants/routes';

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [defaultValues, setDefaultValues] = useState<ProjectFormData>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (!projectId) {
      navigate(ROUTES.PROJECTS);
      return;
    }

    const loadProject = async () => {
      try {
        setIsFetching(true);
        setHasError(false);
        const project = await getProjectById(projectId);
        setDefaultValues({
          name: project.name,
          description: project.description || '',
        });
      } catch (error) {
        setHasError(true);
        toast.error(
          error instanceof Error ? error.message : 'Failed to load project'
        );
      } finally {
        setIsFetching(false);
      }
    };

    loadProject();
  }, [projectId, navigate]);

  const handleSubmit = async (data: ProjectFormData) => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      await updateProject(projectId, {
        name: data.name,
        description: data.description,
      });

      toast.success('Project updated successfully!');
      navigate(ROUTES.PROJECTS);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update project'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PROJECTS);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isFetching) {
    return <Spinner />;
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <ProjectForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      onCancel={handleCancel}
    />
  );
}
