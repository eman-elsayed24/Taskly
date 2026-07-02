import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProjectDetails } from '../../hooks/queries/useProjects';
import ProjectForm from '../../components/dashboard/projects/ProjectForm';
import Spinner from '../../components/ui/spinner';
import ErrorState from '../../components/ui/ErrorState';
import Breadcrumb from '../../components/ui/Breadcrumb';
import type { ProjectFormData } from '../../lib/validations/projectSchema';
import { updateProject } from '../../api/projectApi';
import { ROUTES } from '../../constants/routes';

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: project,
    isLoading: isFetching,
    isError,
    refetch,
  } = useProjectDetails(projectId || '');

  const defaultValues: ProjectFormData = {
    name: project?.name || '',
    description: project?.description || '',
  };

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
    refetch();
  };

  if (isFetching) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'DETAILS' }]} />
      <ProjectForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onCancel={handleCancel}
      />
    </>
  );
}
