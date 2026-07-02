import { useState } from 'react';
import type { TaskEpic } from '../../../../../types/task';
import { useProjectEpicsAll } from '../../../../../hooks/queries/useEpics';
import EpicIdIcon from '../../../../../assets/icons/epicId.svg?react';

interface EditableTaskEpicProps {
  epic: TaskEpic | null;
  projectId: string;
  isSaving: boolean;
  onUpdate: (epicId: string | null) => void;
}

export default function EditableTaskEpic({
  epic,
  projectId,
  isSaving,
  onUpdate,
}: EditableTaskEpicProps) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: epics = [],
    isLoading,
    isError,
  } = useProjectEpicsAll(projectId);

  const handleChange = (epicId: string | null) => {
    setIsEditing(false);
    if (epicId !== (epic?.id || null)) {
      onUpdate(epicId);
    }
  };

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
        Epic
      </p>
      {isEditing ? (
        <div className="space-y-2">
          {isLoading ? (
            <div className="rounded-xl bg-white p-4 text-sm text-slate-medium">
              Loading epics...
            </div>
          ) : isError ? (
            <div className="rounded-xl bg-error-background p-4 border border-error/20">
              <p className="text-sm text-error mb-2">Failed to load epics</p>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-primary hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <select
              value={epic?.id || ''}
              onChange={e => handleChange(e.target.value || null)}
              className="w-full px-3 py-2 border border-primary rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              autoFocus
              onBlur={() => setIsEditing(false)}
              disabled={isSaving}
            >
              <option value="">No Epic</option>
              {epics.map(e => (
                <option key={e.id} value={e.id}>
                  {e.epic_id} - {e.title}
                </option>
              ))}
            </select>
          )}
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="rounded-xl bg-white p-4 cursor-pointer hover:bg-surface-low transition-colors flex items-center gap-2"
        >
          {epic?.epic_id ? (
            <>
              <EpicIdIcon className="w-4 h-4 text-slate-medium" />
              <span className="text-sm font-medium text-slate-dark">
                {epic.epic_id}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-slate-medium">
              No epic - Click to assign
            </span>
          )}
        </div>
      )}
    </div>
  );
}
