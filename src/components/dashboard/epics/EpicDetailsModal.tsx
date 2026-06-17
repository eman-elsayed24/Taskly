import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Epic } from '../../../types/epic';
import { formatDate } from '../../../utils/formatDate';
import { getInitials } from '../../../utils/stringHelpers';
import { getEpicById } from '../../../api/epicApi';
import Modal, { ModalHeader, ModalContent } from '../../ui/Modal';
import Button from '../../ui/button';
import EpicDetailsSkeleton from './EpicDetailsSkeleton';
import EpicsIcon from '../../../assets/icons/epic.svg?react';
import EventIcon from '../../../assets/icons/event.svg?react';
import PersonIcon from '../../../assets/icons/person.svg?react';
import TasksListIcon from '../../../assets/icons/tasksList.svg?react';

interface EpicDetailsModalProps {
  epic: Epic;
  projectId: string;
  onClose: () => void;
}

export default function EpicDetailsModal({
  epic,
  projectId,
  onClose,
}: EpicDetailsModalProps) {
  const [epicDetails, setEpicDetails] = useState<Epic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch epic details when modal opens
  useEffect(() => {
    const fetchEpicDetails = async () => {
      try {
        setIsLoading(true);
        const details = await getEpicById(projectId, epic.id);
        setEpicDetails(details);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to load epic details'
        );
        onClose(); // Close modal on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpicDetails();
  }, [epic.id, projectId, onClose]);

  const displayEpic = epicDetails || epic;
  const assigneeInitials = displayEpic.assignee
    ? getInitials(displayEpic.assignee.name)
    : '';
  const creatorInitials = getInitials(displayEpic.created_by.name);

  return (
    <Modal isOpen={true} onClose={onClose} maxWidth="2xl">
      <ModalHeader onClose={onClose}>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-label-sm text-primary">
            <EpicsIcon className="w-5 h-5" />
            {epic.epic_id}
          </span>
          <h3 className="text-2xl font-bold text-slate-dark capitalize">
            {epic.title}
          </h3>
        </div>
      </ModalHeader>

      <ModalContent className="space-y-6">
        {isLoading ? (
          <EpicDetailsSkeleton />
        ) : (
          <>
            {/* Description */}
            <section>
              <p className="text-body-md text-slate-medium leading-relaxed">
                {epic.description || 'No description provided.'}
              </p>
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
                      {epic.created_by.name}
                    </h5>
                  </div>
                </div>
              </div>

              {/* Assignee */}
              <div className="space-y-3">
                <p className="text-label-sm text-slate-light uppercase">
                  Assignee
                </p>
                <div className="flex items-center gap-3">
                  {epic.assignee ? (
                    <>
                      <div className="w-9 h-9 rounded-lg bg-success/20 text-success-dark flex items-center justify-center font-bold text-sm">
                        {assigneeInitials}
                      </div>
                      <div>
                        <h5 className="text-slate-dark text-body-md ">
                          {epic.assignee.name}
                        </h5>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-full bg-slate-light/20 text-slate-muted flex items-center justify-center">
                        <PersonIcon className="w-4 h-4 opacity-40" />
                      </div>
                      <div>
                        <h5 className="text-slate-muted text-body-md font-medium">
                          Unassigned
                        </h5>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-3">
                <p className="text-label-sm text-slate-light uppercase">
                  Deadline
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center">
                    <EventIcon className="w-4 h-4 text-slate-light" />
                  </div>
                  <span className="text-body-md font-medium">
                    {epic.deadline
                      ? formatDate(epic.deadline)
                      : 'No deadline set'}
                  </span>
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
                    {formatDate(epic.created_at)}
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
