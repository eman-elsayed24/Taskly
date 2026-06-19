import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Epic, EpicUser } from '../../../types/epic';
import type { ProjectMember } from '../../../types/member';
import { formatDate } from '../../../utils/formatDate';
import { getInitials } from '../../../utils/stringHelpers';
import { getEpicById, updateEpic } from '../../../api/epicApi';
import { getProjectMembers } from '../../../api/memberApi';
import { getEpicTasks, type EpicTask } from '../../../api/taskApi';
import Modal, { ModalHeader, ModalContent } from '../../ui/Modal';
import EpicDetailsSkeleton from './EpicDetailsSkeleton';
import EditableEpicTitle from './editable/EditableEpicTitle';
import EditableEpicDescription from './editable/EditableEpicDescription';
import EditableEpicAssignee from './editable/EditableEpicAssignee';
import EditableEpicDeadline from './editable/EditableEpicDeadline';
import EpicTasksList from './EpicTasksList';
import EpicsIcon from '../../../assets/icons/epic.svg?react';
import EventIcon from '../../../assets/icons/event.svg?react';
import { ROUTES } from '../../../constants/routes';

interface EpicDetailsModalProps {
  epic: Epic;
  projectId: string;
  onClose: () => void;
  onUpdate?: (updatedEpic: Epic) => void;
}

export default function EpicDetailsModal({
  epic,
  projectId,
  onClose,
  onUpdate,
}: EpicDetailsModalProps) {
  const navigate = useNavigate();
  const [epicDetails, setEpicDetails] = useState<Epic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [tasks, setTasks] = useState<EpicTask[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(false);

  // Fetch epic details and project members when modal opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [details, members] = await Promise.all([
          getEpicById(projectId, epic.id),
          getProjectMembers(projectId),
        ]);
        setEpicDetails(details);
        setProjectMembers(members);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to load epic details'
        );
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [epic.id, projectId, onClose]);

  // Fetch tasks for this epic
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsTasksLoading(true);
        setTasksError(false);
        const epicTasks = await getEpicTasks(epic.id);
        setTasks(epicTasks);
      } catch (error) {
        setTasksError(true);
        console.error('Failed to load tasks:', error);
      } finally {
        setIsTasksLoading(false);
      }
    };

    fetchTasks();
  }, [epic.id]);

  const displayEpic = epicDetails || epic;

  const handleUpdateField = async (
    field: 'title' | 'description' | 'assignee_id' | 'deadline',
    value: string | null
  ) => {
    if (!epicDetails) return;

    // Store previous value for rollback
    const previousValue =
      field === 'assignee_id'
        ? epicDetails.assignee
        : epicDetails[field as keyof Epic];

    // Optimistic update for all fields
    if (field === 'assignee_id') {
      // For assignee, find the member data to show immediately
      const selectedMember = projectMembers.find(m => m.user_id === value);
      const assigneeData = selectedMember
        ? {
            sub: selectedMember.metadata.sub,
            name: selectedMember.metadata.name,
            email: selectedMember.metadata.email,
            department: selectedMember.metadata.jobTitle || null,
          }
        : null;
      setEpicDetails({ ...epicDetails, assignee: assigneeData });
    } else {
      setEpicDetails({ ...epicDetails, [field]: value } as Epic);
    }

    try {
      setIsSaving(true);
      await updateEpic(epicDetails.id, { [field]: value });
      toast.success('Epic updated successfully');

      // Update parent component without refetching from API
      if (onUpdate) {
        const updatedEpic = { ...epicDetails };
        if (field === 'assignee_id') {
          const selectedMember = projectMembers.find(m => m.user_id === value);
          updatedEpic.assignee = selectedMember
            ? {
                sub: selectedMember.metadata.sub,
                name: selectedMember.metadata.name,
                email: selectedMember.metadata.email,
                department: selectedMember.metadata.jobTitle || null,
              }
            : null;
        } else {
          (updatedEpic as any)[field] = value;
        }
        onUpdate(updatedEpic);
      }
    } catch {
      // Revert on error
      if (field === 'assignee_id') {
        setEpicDetails({
          ...epicDetails,
          assignee: previousValue as EpicUser | null,
        });
      } else {
        setEpicDetails({ ...epicDetails, [field]: previousValue } as Epic);
      }
      toast.error('Failed to update epic. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleUpdate = (value: string) => {
    handleUpdateField('title', value);
  };

  const handleDescriptionUpdate = (value: string | null) => {
    handleUpdateField('description', value);
  };

  const handleAssigneeUpdate = (userId: string | null) => {
    handleUpdateField('assignee_id', userId);
  };

  const handleDeadlineUpdate = (date: string | null) => {
    handleUpdateField('deadline', date);
  };

  const creatorInitials = getInitials(displayEpic.created_by.name);

  const handleAddTask = () => {
    navigate(`${ROUTES.ADD_TASK(projectId)}?epicId=${epic.id}`);
  };

  return (
    <Modal isOpen={true} onClose={onClose} maxWidth="2xl">
      <ModalHeader onClose={onClose}>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-label-sm text-primary">
            <EpicsIcon className="w-5 h-5" />
            {epic.epic_id}
          </span>

          <EditableEpicTitle
            title={displayEpic.title}
            isSaving={isSaving}
            onUpdate={handleTitleUpdate}
          />
        </div>
      </ModalHeader>

      <ModalContent className="space-y-6">
        {isLoading && !epicDetails ? (
          <EpicDetailsSkeleton />
        ) : (
          <>
            {/* Editable Description */}
            <section>
              <EditableEpicDescription
                description={displayEpic.description}
                isSaving={isSaving}
                onUpdate={handleDescriptionUpdate}
              />
            </section>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
              {/* Created By */}
              <div className="space-y-3">
                <p className="text-label-sm text-slate-light uppercase">
                  Created By
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    {creatorInitials}
                  </div>
                  <div>
                    <h5 className="text-slate-dark text-body-md ">
                      {displayEpic.created_by.name}
                    </h5>
                  </div>
                </div>
              </div>

              {/* Editable Assignee */}
              <EditableEpicAssignee
                assignee={displayEpic.assignee}
                projectMembers={projectMembers}
                isSaving={isSaving}
                onUpdate={handleAssigneeUpdate}
              />

              {/* Editable Deadline */}
              <EditableEpicDeadline
                deadline={displayEpic.deadline}
                isSaving={isSaving}
                onUpdate={handleDeadlineUpdate}
              />

              {/* Created At */}
              <div className="space-y-3">
                <p className="text-label-sm text-slate-light uppercase">
                  Created At
                </p>
                <div className="flex items-center  text-slate-dark">
                  <div className="w-9 h-9 flex items-center justify-center">
                    <EventIcon className="w-4 h-4 text-slate-light" />
                  </div>
                  <span className="text-body-md font-medium">
                    {formatDate(displayEpic.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <EpicTasksList
              tasks={tasks}
              isLoading={isTasksLoading}
              hasError={tasksError}
              onAddTask={handleAddTask}
            />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
