import { useState, useEffect } from 'react';

interface EditableTaskTitleProps {
  title: string;
  isSaving: boolean;
  onUpdate: (value: string) => void;
}

export default function EditableTaskTitle({
  title,
  isSaving,
  onUpdate,
}: EditableTaskTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!isEditing) {
      setValue(title);
    }
  }, [title, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setValue(title);
      return;
    }

    if (trimmedValue !== title) {
      onUpdate(trimmedValue);
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
      className="w-full text-2xl md:text-3xl font-bold text-slate-dark bg-transparent border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
      autoFocus
      disabled={isSaving}
    />
  ) : (
    <h1
      onClick={() => setIsEditing(true)}
      className="text-2xl md:text-3xl font-bold leading-tight text-slate-dark cursor-pointer hover:bg-surface-low rounded px-3 py-2 -mx-3"
    >
      {title}
    </h1>
  );
}
