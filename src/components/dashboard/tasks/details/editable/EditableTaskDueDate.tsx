import { getTodayDateString } from '../../../../../utils/formatDate';

interface EditableTaskDueDateProps {
  dueDate: string | null | undefined;
  isSaving: boolean;
  onUpdate: (date: string | null) => void;
}

export default function EditableTaskDueDate({
  dueDate,
  isSaving,
  onUpdate,
}: EditableTaskDueDateProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value || null;

    const currentDate = dueDate ? dueDate.split('T')[0] : null;

    if (newDate !== currentDate) {
      onUpdate(newDate);
    }
  };

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
        Due Date
      </p>
      <div className="rounded-xl bg-white p-4">
        <input
          type="date"
          value={dueDate ? dueDate.split('T')[0] : ''}
          onChange={handleChange}
          min={getTodayDateString()}
          className="w-full text-sm font-medium text-slate-dark border-0 bg-transparent focus:outline-none cursor-pointer"
          disabled={isSaving}
          placeholder="Select date"
        />
      </div>
    </div>
  );
}
