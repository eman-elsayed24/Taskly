import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Epic, EpicUser } from '../../../types/epic';
import type { ProjectMember } from '../../../types/member';
import { formatDate } from '../../../utils/formatDate';
import { getInitials } from '../../../utils/stringHelpers';
import { getEpicById, updateEpic } from '../../../api/epicApi';
import { getProjectMembers } from '../../../api/memberApi';
import Modal, { ModalHeader, ModalContent } from '../../ui/Modal';
import Button from '../../ui/button';
import EpicDetailsSkeleton from './EpicDetailsSkeleton';
import EditableEpicTitle from './editable/EditableEpicTitle';
import EditableEpicDescription from './editable/EditableEpicDescription';
import EditableEpicAssignee from './editable/EditableEpicAssignee';
import EditableEpicDeadline from './editable/EditableEpicDeadline';
import EpicsIcon from '../../../assets/icons/epic.svg?react';
import EventIcon from '../../../assets/icons/event.svg?react';
import TasksListIcon from '../../../assets/icons/tasksList.svg?react';

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
  const [epicDetails, setEpicDetails] = useState<Epic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);

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

    // Optimistic update - for assignee_id we'll update after API call
    if (field !== 'assignee_id') {
      setEpicDetails({ ...epicDetails, [field]: value } as Epic);
    }

    try {
      setIsSaving(true);
      await updateEpic(epicDetails.id, { [field]: value });
      toast.success('Epic updated successfully');

      // Refresh epic details to get updated data with relationships
      const refreshedEpic = await getEpicById(projectId, epicDetails.id);
      setEpicDetails(refreshedEpic);
      if (onUpdate) {
        onUpdate(refreshedEpic);
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
        {isLoading ? (
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
                <div className="flex items-center gap-3 text-slate-dark">
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
            <section className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-title-md text-slate-dark capitalize">
                  Tasks
                </h4>
                <Button variant="secondary" className="capitalize text-body-md">
                  + Add Task
                </Button>
              </div>

              {/* Empty State */}
              <div className="bg-surface-low flex flex-col items-center gap-6 rounded-lg p-10">
                <div className="bg-surface-highest rounded-xl p-3">
                  <TasksListIcon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-title-md text-slate-dark text-center">
                  No tasks have been added to this epic yet
                </p>
                <Button className="text-body-md">+ Add Task</Button>
              </div>
            </section>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
