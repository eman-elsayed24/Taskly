import { useState, useEffect } from 'react';

interface EditableEpicDescriptionProps {
  description: string | null | undefined;
  isSaving: boolean;
  onUpdate: (value: string | null) => void;
}

export default function EditableEpicDescription({
  description,
  isSaving,
  onUpdate,
}: EditableEpicDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(description || '');

  // Sync with prop changes only when not editing
  useEffect(() => {
    if (!isEditing) {
      setValue(description || '');
    }
  }, [description, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== (description || '')) {
      onUpdate(value || null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setValue(description || '');
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <textarea
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full text-body-md text-slate-medium leading-relaxed bg-transparent border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
      placeholder="Add a description..."
      autoFocus
      disabled={isSaving}
    />
  ) : (
    <p
      onClick={() => setIsEditing(true)}
      className="text-body-md text-slate-medium leading-relaxed cursor-pointer hover:bg-surface-low rounded px-3 py-2 -mx-3"
    >
      {description || 'No description provided.'}
    </p>
  );
}
