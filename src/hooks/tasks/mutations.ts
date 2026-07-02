import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, type UpdateTaskRequest } from '../../api/taskApi';
import { taskKeys } from './queries';
import toast from 'react-hot-toast';
import type { TaskDetails } from '../../types/task';

interface UpdateTaskVariables {
  taskId: string;
  projectId: string;
  data: UpdateTaskRequest;
}

interface MutationContext {
  previousTask?: TaskDetails;
  detailKey: readonly unknown[];
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateTaskVariables, MutationContext>({
    mutationFn: ({ taskId, data }: UpdateTaskVariables) =>
      updateTask(taskId, data),

    onMutate: async variables => {
      const detailKey = taskKeys.detail(variables.projectId, variables.taskId);
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previousTask = queryClient.getQueryData<TaskDetails>(detailKey);

      queryClient.setQueryData<TaskDetails>(detailKey, oldTask => {
        if (!oldTask) return oldTask;
        return { ...oldTask, ...variables.data };
      });

      return { previousTask, detailKey };
    },

    onSuccess: () => {
      toast.success('Task updated successfully');
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });
    },

    onError: (error: Error, _variables, context) => {
      if (context?.previousTask && context?.detailKey) {
        queryClient.setQueryData(context.detailKey, context.previousTask);
      }
      toast.error(error.message || 'Failed to update task. Please try again.');
    },

    onSettled: (_data, _error, _variables, context) => {
      if (context?.detailKey) {
        queryClient.invalidateQueries({ queryKey: context.detailKey });
      }
    },
  });
}
