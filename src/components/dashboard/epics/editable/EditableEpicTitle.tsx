import { useState, useEffect } from 'react';

interface EditableEpicTitleProps {
  title: string;
  isSaving: boolean;
  onUpdate: (value: string) => void;
}

export default function EditableEpicTitle({
  title,
  isSaving,
  onUpdate,
}: EditableEpicTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);

  // Sync with prop changes only when not editing
  useEffect(() => {
    if (!isEditing) {
      setValue(title);
    }
  }, [title, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() && value !== title) {
      onUpdate(value.trim());
    } else if (!value.trim()) {
      setValue(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      setValue(title);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="text-2xl font-bold text-slate-dark capitalize bg-transparent border border-primary rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
      autoFocus
      disabled={isSaving}
    />
  ) : (
    <h3
      onClick={() => setIsEditing(true)}
      className="text-2xl font-bold text-slate-dark capitalize cursor-pointer hover:bg-surface-low rounded px-2 py-1 -mx-2"
    >
      {title}
    </h3>
  );
}
