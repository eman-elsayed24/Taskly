import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Epic } from '../../../types/epic';
import type { ProjectMember } from '../../../types/member';
import { formatDate } from '../../../utils/formatDate';
import { getInitials } from '../../../utils/stringHelpers';
import { getEpicById, updateEpic } from '../../../api/epicApi';
import { getProjectMembers } from '../../../api/memberApi';
import Modal, { ModalHeader, ModalContent } from '../../ui/Modal';
import Button from '../../ui/button';
import EpicDetailsSkeleton from './EpicDetailsSkeleton';
import EpicsIcon from '../../../assets/icons/epic.svg?react';
import EventIcon from '../../../assets/icons/event.svg?react';
import TasksListIcon from '../../../assets/icons/tasksList.svg?react';
import UnassignedIcon from '../../../assets/icons/unassigned.svg?react';

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

  // Edit states
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState('');
  const [editingAssignee, setEditingAssignee] = useState(false);

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
        setTitleValue(details.title);
        setDescriptionValue(details.description || '');
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

    const previousValue = epicDetails[field];

    // Optimistic update
    const updatedEpic = { ...epicDetails, [field]: value };
    setEpicDetails(updatedEpic);

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
      setEpicDetails({ ...epicDetails, [field]: previousValue });
      toast.error('Failed to update epic. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleBlur = () => {
    setEditingTitle(false);
    if (titleValue.trim() && titleValue !== displayEpic.title) {
      handleUpdateField('title', titleValue.trim());
    } else if (!titleValue.trim()) {
      setTitleValue(displayEpic.title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      setTitleValue(displayEpic.title);
      setEditingTitle(false);
    }
  };

  const handleDescriptionBlur = () => {
    setEditingDescription(false);
    if (descriptionValue !== (displayEpic.description || '')) {
      handleUpdateField('description', descriptionValue || null);
    }
  };

  const handleDescriptionKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Escape') {
      setDescriptionValue(displayEpic.description || '');
      setEditingDescription(false);
    }
  };

  const handleAssigneeChange = (userId: string | null) => {
    setEditingAssignee(false);
    if (userId !== (displayEpic.assignee?.sub || null)) {
      handleUpdateField('assignee_id', userId);
    }
  };

  const handleDeadlineChange = (date: string | null) => {
    if (date !== (displayEpic.deadline || null)) {
      handleUpdateField('deadline', date);
    }
  };

  const assigneeInitials = displayEpic.assignee
    ? getInitials(displayEpic.assignee.name)
    : null;
  const creatorInitials = getInitials(displayEpic.created_by.name);


  return (
    <Modal isOpen={true} onClose={onClose} maxWidth="2xl">
      <ModalHeader onClose={onClose}>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-label-sm text-primary">
            <EpicsIcon className="w-5 h-5" />
            {epic.epic_id}
          </span>

          {/* Editable Title */}
          {editingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={e => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-2xl font-bold text-slate-dark capitalize bg-transparent border border-primary rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
              disabled={isSaving}
            />
          ) : (
            <h3
              onClick={() => setEditingTitle(true)}
              className="text-2xl font-bold text-slate-dark capitalize cursor-pointer hover:bg-surface-low rounded px-2 py-1 -mx-2"
            >
              {displayEpic.title}
            </h3>
          )}
        </div>
      </ModalHeader>

      <ModalContent className="space-y-6">
        {isLoading ? (
          <EpicDetailsSkeleton />
        ) : (
          <>
            {/* Editable Description */}
            <section>
              {editingDescription ? (
                <textarea
                  value={descriptionValue}
                  onChange={e => setDescriptionValue(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  onKeyDown={handleDescriptionKeyDown}
                  className="w-full text-body-md text-slate-medium leading-relaxed bg-transparent border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                  placeholder="Add a description..."
                  autoFocus
                  disabled={isSaving}
                />
              ) : (
                <p
                  onClick={() => setEditingDescription(true)}
                  className="text-body-md text-slate-medium leading-relaxed cursor-pointer hover:bg-surface-low rounded px-3 py-2 -mx-3"
                >
                  {displayEpic.description || 'No description provided.'}
                </p>
              )}
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
              <div className="space-y-3">
                <p className="text-label-sm text-slate-light uppercase">
                  Assignee
                </p>
                {editingAssignee ? (
                  <select
                    value={displayEpic.assignee?.sub || ''}
                    onChange={e => handleAssigneeChange(e.target.value || null)}
                    className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md"
                    autoFocus
                    onBlur={() => setEditingAssignee(false)}
                    disabled={isSaving}
                  >
                    <option value="">Unassigned</option>
                    {projectMembers.map(member => (
                      <option key={member.user_id} value={member.user_id}>
                        {member.metadata.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    onClick={() => setEditingAssignee(true)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-surface-low rounded px-3 py-2 -mx-3"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                        displayEpic.assignee
                          ? 'bg-success/20 text-success-dark'
                          : 'bg-slate-light/20 text-slate-muted'
                      }`}
                    >
                      {displayEpic.assignee && displayEpic.assignee.name ? (
                        assigneeInitials
                      ) : (
                        <UnassignedIcon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h5
                        className={`text-body-md ${
                          displayEpic.assignee
                            ? 'text-slate-dark'
                            : 'text-slate-muted font-medium'
                        }`}
                      >
                        {displayEpic.assignee?.name || 'Unassigned'}
                      </h5>
                    </div>
                  </div>
                )}
              </div>

              {/* Editable Deadline */}
              <div className="space-y-3">
                <p className="text-label-sm text-slate-light uppercase">
                  Deadline
                </p>
                <div className="flex items-center gap-3 relative">
                  <div
                    className="w-9 h-9 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      const input = document.getElementById(
                        'deadline-input'
                      ) as HTMLInputElement;
                      input?.showPicker?.();
                    }}
                  >
                    <EventIcon className="w-4 h-4 text-slate-light" />
                  </div>
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      const input = document.getElementById(
                        'deadline-input'
                      ) as HTMLInputElement;
                      input?.showPicker?.();
                    }}
                  >
                    <input
                      id="deadline-input"
                      type="date"
                      value={displayEpic.deadline || ''}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e =>
                        handleDeadlineChange(e.target.value || null)
                      }
                      className="text-body-md font-medium border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 cursor-pointer w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>

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
