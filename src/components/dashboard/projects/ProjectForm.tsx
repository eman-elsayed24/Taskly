import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import FormField from '../../ui/FormField';
import TextareaField from '../../ui/TextareaField';
import Button from '../../ui/button';
import { projectSchema } from '../../../lib/validations/projectSchema';
import type { ProjectFormData } from '../../../lib/validations/projectSchema';
import { ROUTES } from '../../../constants/routes';
import ProjectInitIcon from '../../../assets/icons/project-init.svg';
import PersonAddIcon from '../../../assets/icons/person-add.svg';
import LightbulbIcon from '../../../assets/icons/lightbulb.svg';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  defaultValues?: ProjectFormData;
  onSubmit: (data: ProjectFormData) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export default function ProjectForm({
  mode,
  defaultValues = { name: '', description: '' },
  onSubmit,
  isLoading,
  onCancel,
}: ProjectFormProps) {
  const { control, handleSubmit } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Project' : 'Add New Project';
  const subtitle = isEditMode
    ? 'Define the scope and foundational details of your project.'
    : 'Define the scope and foundational details of your project.';
  const submitButtonText = isEditMode
    ? isLoading
      ? 'Saving...'
      : 'Save Changes'
    : isLoading
      ? 'Creating...'
      : 'Create Project';
  const icon = ProjectInitIcon;
  const iconTitle = isEditMode ? 'Edit Project' : 'Initialize New Project';

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
          <span className="text-primary">
            {isEditMode ? 'EDIT' : 'ADD NEW PROJECT'}
          </span>
        </div>
        <div className="flex items-center justify-between ">
          <h1 className="text-heading-xl text-slate-dark">{title}</h1>
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
                <img src={icon} alt="" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-heading-md text-slate-dark">{iconTitle}</h2>
                <p className="text-body-sm text-slate-medium">{subtitle}</p>
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

              <TextareaField
                control={control}
                name="description"
                label="DESCRIPTION"
                showOptional
                placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                rows={6}
                maxLength={500}
                showCharCount
                maxCharCount={500}
              />
            </div>

            <div className="flex items-center justify-between pt-6 ">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isLoading}
                className="text-slate-medium"
              >
                Back
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {submitButtonText}
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
