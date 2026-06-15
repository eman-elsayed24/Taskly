import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProjectForm from '../../components/dashboard/projects/ProjectForm';
import type { ProjectFormData } from '../../lib/validations/projectSchema';
import { createProject } from '../../api/projectApi';
import { ROUTES } from '../../constants/routes';

function AddProject() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);

    try {
      await createProject({
        name: data.name,
        description: data.description,
      });

      toast.success('Project created successfully!');
      navigate(ROUTES.PROJECTS);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create project'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PROJECTS);
  };

  return (
    <ProjectForm
      mode="create"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      onCancel={handleCancel}
    />
  );
}

export default AddProject;
