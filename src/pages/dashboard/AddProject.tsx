import { useState } from 'react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/button';
import { projectSchema } from '../../lib/validations/projectSchema';
import type { ProjectFormData } from '../../lib/validations/projectSchema';
import { createProject } from '../../api/projectApi';
import { ROUTES } from '../../constants/routes';
import ProjectInitIcon from '../../assets/icons/project-init.svg';
import PersonAddIcon from '../../assets/icons/person-add.svg';
import LightbulbIcon from '../../assets/icons/lightbulb.svg';

function AddProject() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { field: descriptionField, fieldState: descriptionFieldState } =
    useController({
      name: 'description',
      control,
    });

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);

    try {
      await createProject({
        name: data.name,
        description: data.description,
      });

      toast.success('Project created successfully!');
      reset();
      navigate(ROUTES.PROJECTS);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create project'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-label-sm text-slate-medium mb-4">
          <Link
            to={ROUTES.PROJECTS}
            className="hover:text-primary transition-colors"
          >
            PROJECTS
          </Link>
          <span>/</span>
          <span className="text-primary">ADD NEW PROJECT</span>
        </div>
        <div className="flex items-center justify-between ">
          <h1 className="text-heading-xl text-slate-dark">Add New Project</h1>
          <Button
            variant="primary"
            className="hidden md:flex items-center gap-2"
          >
            <img src={PersonAddIcon} alt="" className="w-5 h-5" />
            Invite Member
          </Button>
        </div>
      </div>

      <div className="lg:bg-white rounded-md  flex flex-col lg:w-2xl mx-auto overflow-hidden">
        <div className="px-6 md:px-8 pt-6 md:pt-8">
          <div className="mb-6 border-b border-slate-light/30  pb-8">
            <div className="flex items-center gap-4">
              <div className="hidden  w-12 h-12 bg-primary/10 rounded-sm lg:flex items-center justify-center ">
                <img src={ProjectInitIcon} alt="" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-heading-md text-slate-dark">
                  Initialize New Project
                </h2>
                <p className="text-body-sm text-slate-medium">
                  Define the scope and foundational details of your project.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col mb-6"
          >
            <div className="space-y-6">
              <FormField
                control={control}
                name="name"
                label="PROJECT TITLE"
                type="text"
                placeholder="Enter project title"
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="description"
                    className="block text-label-sm text-slate-medium"
                  >
                    DESCRIPTION
                  </label>
                  <span className="text-sm text-slate-light">Optional</span>
                </div>
                <textarea
                  {...descriptionField}
                  id="description"
                  placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                  className={`w-full px-4 py-3 rounded-sm text-body-md text-slate-dark placeholder:text-slate-muted outline-none resize-none ${
                    descriptionFieldState.error
                      ? 'bg-error-low'
                      : 'bg-surface-highest'
                  }`}
                  rows={6}
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-1">
                  {descriptionFieldState.error ? (
                    <p className="text-error text-body-sm">
                      {descriptionFieldState.error.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p className="text-sm text-slate-light">
                    {descriptionField.value?.length || 0} / 500 characters
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 ">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(ROUTES.PROJECTS)}
                disabled={isLoading}
                className="text-slate-medium"
              >
                Back
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-primary-light px-6 md:px-8 py-4">
          <div className="flex items-start gap-2 text-body-sm text-slate-medium">
            <img
              src={LightbulbIcon}
              alt=""
              className="w-5 h-5 mt-0.5 shrink-0"
            />
            <p>
              <strong className="text-slate-dark">Pro Tip:</strong> You can
              invite project members and assign epics immediately after the
              initial creation process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProject;
