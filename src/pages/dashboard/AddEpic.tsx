import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { epicSchema } from '../../lib/validations/epicSchema';
import type { EpicFormData } from '../../lib/validations/epicSchema';
import { createEpic } from '../../api/epicApi';
import { getProjectMembers } from '../../api/memberApi';
import { getProjectById } from '../../api/projectApi';
import { getMemberName } from '../../types/member';
import type { ProjectMember } from '../../types/member';
import type { Project } from '../../types/project';
import { ROUTES } from '../../constants/routes';

export default function AddEpic() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isMembersLoading, setIsMembersLoading] = useState(true);

  const { control, handleSubmit } = useForm<EpicFormData>({
    resolver: zodResolver(epicSchema),
    defaultValues: {
      title: '',
      description: '',
      assignee_id: '',
      deadline: '',
    },
  });

  const { field: descriptionField, fieldState: descriptionFieldState } =
    useController({
      name: 'description',
      control,
    });

  const { field: assigneeField, fieldState: assigneeFieldState } =
    useController({
      name: 'assignee_id',
      control,
    });

  const { field: deadlineField, fieldState: deadlineFieldState } =
    useController({
      name: 'deadline',
      control,
    });

  useEffect(() => {
    if (!projectId) return;

    const loadData = async () => {
      try {
        const [projectData, membersData] = await Promise.all([
          getProjectById(projectId),
          getProjectMembers(projectId),
        ]);
        setProject(projectData);
        setMembers(membersData);
      } catch (error) {
        toast.error('Failed to load project data');
      } finally {
        setIsMembersLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const onSubmit = async (data: EpicFormData) => {
    if (!projectId) return;

    setIsLoading(true);

    try {
      await createEpic({
        title: data.title,
        description: data.description,
        assignee_id: data.assignee_id,
        project_id: projectId,
        deadline: data.deadline,
      });

      toast.success('Epic created successfully!');
      navigate(ROUTES.PROJECT_EPICS(projectId));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create epic'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (projectId) {
      navigate(ROUTES.PROJECT_EPICS(projectId));
    } else {
      navigate(ROUTES.PROJECTS);
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'PROJECTS', href: ROUTES.PROJECTS },
            {
              label: project?.name || 'PROJECT',
              href: projectId ? ROUTES.PROJECT_DETAILS(projectId) : undefined,
            },
            {
              label: 'EPICS',
              href: projectId ? ROUTES.PROJECT_EPICS(projectId) : undefined,
            },
            { label: 'NEW EPIC' },
          ]}
        />
        <h1 className="text-heading-xl text-slate-dark">Create New Epic</h1>
      </div>

      <div className="lg:bg-white rounded-md flex flex-col lg:w-3xl mx-auto overflow-hidden">
        <div className="px-6 md:px-8 pt-6 md:pt-8">
          <div className="mb-8 pb-8">
            <div>
              <h2 className="text-heading-md text-slate-dark mb-2">
                Create New Epic
              </h2>
              <p className="text-body-md text-slate-medium">
                Define a major project phase or high-level milestone to group
                related tasks and track architectural progress.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mb-6">
            {/* Title Field */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start">
              <div className="flex items-center gap-1">
                <label
                  htmlFor="title"
                  className="block text-label-sm text-slate-medium"
                >
                  TITLE
                </label>
                <span className="text-error text-sm">*</span>
              </div>
              <div>
                <FormField
                  control={control}
                  name="title"
                  type="text"
                  placeholder="e.g. Structural Foundation Phase"
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start">
              <div className="flex items-center justify-between md:justify-start md:gap-2">
                <label
                  htmlFor="description"
                  className="block text-label-sm text-slate-medium"
                >
                  DESCRIPTION
                </label>
                <span className="text-sm text-slate-light">Optional</span>
              </div>
              <div>
                <textarea
                  {...descriptionField}
                  id="description"
                  placeholder="Describe the scope and objectives of this epic..."
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

            {/* Assignee and Deadline Row */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start">
              <div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Assignee Field */}
                <div>
                  <label
                    htmlFor="assignee_id"
                    className="block text-label-sm text-slate-medium mb-2"
                  >
                    ASSIGNEE
                  </label>
                  <select
                    {...assigneeField}
                    id="assignee_id"
                    disabled={isMembersLoading}
                    className={`w-full px-4 py-3 rounded-sm text-body-md text-slate-dark outline-none ${
                      assigneeFieldState.error
                        ? 'bg-error-low'
                        : 'bg-surface-highest'
                    } ${isMembersLoading ? 'cursor-wait' : 'cursor-pointer'}`}
                  >
                    <option value="">Select a member...</option>
                    {members.map(member => (
                      <option key={member.user_id} value={member.user_id}>
                        {getMemberName(member)}
                      </option>
                    ))}
                  </select>
                  {assigneeFieldState.error && (
                    <p className="text-error text-body-sm mt-1">
                      {assigneeFieldState.error.message}
                    </p>
                  )}
                </div>

                {/* Deadline Field */}
                <div>
                  <label
                    htmlFor="deadline"
                    className="block text-label-sm text-slate-medium mb-2"
                  >
                    DEADLINE
                  </label>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      const input = document.getElementById(
                        'deadline'
                      ) as HTMLInputElement;
                      input?.showPicker?.();
                    }}
                  >
                    <input
                      {...deadlineField}
                      id="deadline"
                      type="date"
                      min={today}
                      placeholder="mm/dd/yyyy"
                      className={`w-full px-4 py-3 rounded-sm text-body-md text-slate-dark outline-none cursor-pointer ${
                        deadlineFieldState.error
                          ? 'bg-error-low'
                          : 'bg-surface-highest'
                      }`}
                    />
                  </div>
                  {deadlineFieldState.error && (
                    <p className="text-error text-body-sm mt-1">
                      {deadlineFieldState.error.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
                className="text-slate-medium"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Epic'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
