import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../../components/ui/FormField';
import SelectField from '../../components/ui/SelectField';
import TextareaField from '../../components/ui/TextareaField';
import Button from '../../components/ui/button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { taskSchema } from '../../lib/validations/taskSchema';
import type { TaskFormData } from '../../lib/validations/taskSchema';
import { TaskStatus, TASK_STATUS_LABELS } from '../../types/task';
import { ROUTES } from '../../constants/routes';
import { createTask, getEpicsByProject } from '../../api/taskApi';
import { getProjectMembers } from '../../api/memberApi';
import { getMemberName } from '../../types/member';
import type { ProjectMember } from '../../types/member';
import type { Epic } from '../../types/epic';

export default function AddTask() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const epicIdFromUrl = searchParams.get('epicId');
  const statusFromUrl = searchParams.get('status');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const { control, handleSubmit } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      status: (statusFromUrl as TaskStatus) || TaskStatus.TO_DO,
      assignee_id: '',
      epic_id: epicIdFromUrl || '',
      due_date: '',
      description: '',
    },
  });

  useEffect(() => {
    if (!projectId) return;

    const loadData = async () => {
      try {
        const [membersData, epicsData] = await Promise.all([
          getProjectMembers(projectId),
          getEpicsByProject(projectId),
        ]);
        setMembers(membersData);
        setEpics(epicsData);
      } catch {
        toast.error('Failed to load project data');
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const onSubmit = async (data: TaskFormData) => {
    if (!projectId) return;

    setIsLoading(true);

    try {
      await createTask({
        project_id: projectId,
        title: data.title,
        status: data.status,
        description: data.description,
        assignee_id: data.assignee_id,
        epic_id: data.epic_id,
        due_date: data.due_date,
      });

      toast.success('Task created successfully!');
      navigate(ROUTES.PROJECT_TASKS(projectId));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create task'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (projectId) {
      navigate(ROUTES.PROJECT_TASKS(projectId));
    } else {
      navigate(ROUTES.PROJECTS);
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  // Truncate epic title if longer than 100 characters
  const truncateEpicTitle = (title: string) => {
    return title.length > 100 ? `${title.substring(0, 100)}...` : title;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <Breadcrumb
          items={[
            {
              label: 'TASKS',
              href: projectId ? ROUTES.PROJECT_TASKS(projectId) : undefined,
            },
            { label: 'NEW TASK' },
          ]}
        />
        <h1 className="text-heading-xl text-slate-dark">Create New Task</h1>
      </div>

      <div className="lg:bg-white rounded-md flex flex-col lg:w-3xl mx-auto overflow-hidden">
        <div className="px-6 md:px-8 pt-6 md:pt-8">
          <div className="mb-8 pb-8">
            <div>
              <h2 className="text-heading-md text-slate-dark mb-2">
                Create New Task
              </h2>
              <p className="text-body-md text-slate-medium">
                Initialize a new work item within the Architectural Workspace
                ecosystem.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-6">
            {/* Title Field */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <label
                  htmlFor="title"
                  className="block text-label-sm text-slate-medium"
                >
                  TITLE
                </label>
                <span className="text-error text-sm">*</span>
              </div>
              <FormField
                control={control}
                name="title"
                type="text"
                placeholder="e.g., Finalize structural schematics"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                control={control}
                name="status"
                label="STATUS"
                required
              >
                {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectField>

              <SelectField
                control={control}
                name="assignee_id"
                label="ASSIGNEE"
                disabled={isDataLoading}
                className={isDataLoading ? 'cursor-wait' : ''}
              >
                <option value="">Select Team Member</option>
                {members.map(member => (
                  <option key={member.user_id} value={member.user_id}>
                    {getMemberName(member)}
                  </option>
                ))}
              </SelectField>
            </div>

            <SelectField
              control={control}
              name="epic_id"
              label="EPIC"
              disabled={isDataLoading}
              className={isDataLoading ? 'cursor-wait' : ''}
            >
              <option value="">Select Epic Link</option>
              {epics.map(epic => (
                <option key={epic.id} value={epic.id}>
                  {epic.epic_id} {truncateEpicTitle(epic.title)}
                </option>
              ))}
            </SelectField>

            <div>
              <label
                htmlFor="due_date"
                className="block text-label-sm text-slate-medium mb-2"
              >
                DUE DATE
              </label>
              <FormField
                control={control}
                name="due_date"
                type="date"
                min={today}
                placeholder="mm/dd/yyyy"
                className="cursor-pointer"
              />
            </div>

            <TextareaField
              control={control}
              name="description"
              label="DESCRIPTION"
              placeholder="Provide detailed context for this task..."
              rows={6}
              maxLength={1000}
              showCharCount
              maxCharCount={1000}
            />

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
                className="text-slate-medium"
              >
                Back
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
