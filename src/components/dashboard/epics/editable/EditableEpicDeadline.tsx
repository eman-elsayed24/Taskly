import EventIcon from '../../../../assets/icons/event.svg?react';
import { getTodayDateString } from '../../../../utils/formatDate';

interface EditableEpicDeadlineProps {
  deadline: string | null | undefined;
  isSaving: boolean;
  onUpdate: (date: string | null) => void;
}

export default function EditableEpicDeadline({
  deadline,
  isSaving,
  onUpdate,
}: EditableEpicDeadlineProps) {
  const handleChange = (date: string | null) => {
    if (date !== (deadline || null)) {
      onUpdate(date);
    }
  };

  const handleClick = () => {
    const input = document.getElementById('deadline-input') as HTMLInputElement;
    input?.showPicker?.();
  };

  return (
    <div className="space-y-3">
      <p className="text-label-sm text-slate-light uppercase">Deadline</p>
      <div className="flex items-center  relative">
        <div
          className="w-9 h-9 flex items-center justify-center cursor-pointer"
          onClick={handleClick}
        >
          <EventIcon className="w-4 h-4 text-slate-light" />
        </div>
        <div className="flex-1 cursor-pointer" onClick={handleClick}>
          <input
            id="deadline-input"
            type="date"
            value={deadline || ''}
            min={getTodayDateString()}
            onChange={e => handleChange(e.target.value || null)}
            className="text-body-md font-medium border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 cursor-pointer w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
