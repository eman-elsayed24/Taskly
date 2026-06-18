import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { taskSchema } from '../../lib/validations/taskSchema';
import type { TaskFormData } from '../../lib/validations/taskSchema';
import { TaskStatus, TASK_STATUS_LABELS } from '../../types/task';
import { ROUTES } from '../../constants/routes';

export default function AddTask() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const epicIdFromUrl = searchParams.get('epicId');
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      status: TaskStatus.TO_DO,
      assignee_id: '',
      epic_id: epicIdFromUrl || '',
      due_date: '',
      description: '',
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

  const { field: epicField, fieldState: epicFieldState } = useController({
    name: 'epic_id',
    control,
  });

  const { field: dueDateField, fieldState: dueDateFieldState } = useController({
    name: 'due_date',
    control,
  });

  const { field: statusField, fieldState: statusFieldState } = useController({
    name: 'status',
    control,
  });

  const onSubmit = (data: TaskFormData) => {
    console.log('Task data:', {
      project_id: projectId,
      title: data.title,
      status: data.status,
      description: data.description,
      assignee_id: data.assignee_id,
      epic_id: data.epic_id,
      due_date: data.due_date,
    });
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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'PROJECTS', href: ROUTES.PROJECTS },
            {
              label: 'PROJECT ALPHA',
              href: projectId ? ROUTES.PROJECT_DETAILS(projectId) : undefined,
            },
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

            {/* Status and Assignee Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Field */}
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <label
                    htmlFor="status"
                    className="block text-label-sm text-slate-medium"
                  >
                    STATUS
                  </label>
                  <span className="text-error text-sm">*</span>
                </div>
                <select
                  {...statusField}
                  id="status"
                  className={`w-full px-4 py-3 rounded-sm text-body-md text-slate-dark outline-none cursor-pointer ${
                    statusFieldState.error
                      ? 'bg-error-low'
                      : 'bg-surface-highest'
                  }`}
                >
                  {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {statusFieldState.error && (
                  <p className="text-error text-body-sm mt-1">
                    {statusFieldState.error.message}
                  </p>
                )}
              </div>

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
                  className={`w-full px-4 py-3 rounded-sm text-body-md outline-none cursor-pointer ${
                    assigneeFieldState.error
                      ? 'bg-error-low'
                      : 'bg-surface-highest'
                  } ${!assigneeField.value ? 'text-slate-muted' : 'text-slate-dark'}`}
                >
                  <option value="">Select Team Member</option>
                </select>
                {assigneeFieldState.error && (
                  <p className="text-error text-body-sm mt-1">
                    {assigneeFieldState.error.message}
                  </p>
                )}
              </div>
            </div>

            {/* Epic Field */}
            <div>
              <label
                htmlFor="epic_id"
                className="block text-label-sm text-slate-medium mb-2"
              >
                EPIC
              </label>
              <select
                {...epicField}
                id="epic_id"
                className={`w-full px-4 py-3 rounded-sm text-body-md outline-none cursor-pointer ${
                  epicFieldState.error ? 'bg-error-low' : 'bg-surface-highest'
                } ${!epicField.value ? 'text-slate-muted' : 'text-slate-dark'}`}
              >
                <option value="">Select Epic Link</option>
              </select>
              {epicFieldState.error && (
                <p className="text-error text-body-sm mt-1">
                  {epicFieldState.error.message}
                </p>
              )}
            </div>

            {/* Due Date Field */}
            <div>
              <label
                htmlFor="due_date"
                className="block text-label-sm text-slate-medium mb-2"
              >
                DUE DATE
              </label>
              <div
                className="cursor-pointer"
                onClick={() => {
                  const input = document.getElementById(
                    'due_date'
                  ) as HTMLInputElement;
                  input?.showPicker?.();
                }}
              >
                <input
                  {...dueDateField}
                  id="due_date"
                  type="date"
                  min={today}
                  placeholder="mm/dd/yyyy"
                  className={`w-full px-4 py-3 rounded-sm text-body-md outline-none cursor-pointer ${
                    dueDateFieldState.error
                      ? 'bg-error-low'
                      : 'bg-surface-highest'
                  } ${!dueDateField.value ? 'text-slate-muted' : 'text-slate-dark'}`}
                />
              </div>
              {dueDateFieldState.error && (
                <p className="text-error text-body-sm mt-1">
                  {dueDateFieldState.error.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-label-sm text-slate-medium mb-2"
              >
                DESCRIPTION
              </label>
              <textarea
                {...descriptionField}
                id="description"
                placeholder="Provide detailed context for this task..."
                className={`w-full px-4 py-3 rounded-sm text-body-md text-slate-dark placeholder:text-slate-muted outline-none resize-none ${
                  descriptionFieldState.error
                    ? 'bg-error-low'
                    : 'bg-surface-highest'
                }`}
                rows={6}
                maxLength={1000}
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
                  {descriptionField.value?.length || 0} / 1000 characters
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="text-slate-medium"
              >
                Back
              </Button>
              <Button type="submit" variant="primary">
                Create Task
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
