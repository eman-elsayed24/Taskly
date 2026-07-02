import { useState, useEffect } from 'react';

interface EditableTaskDescriptionProps {
  description: string | null | undefined;
  isSaving: boolean;
  onUpdate: (value: string | null) => void;
  variant?: 'desktop' | 'mobile';
}

export default function EditableTaskDescription({
  description,
  isSaving,
  onUpdate,
  variant = 'desktop',
}: EditableTaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');

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

  if (variant === 'mobile') {
    return (
      <>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-medium">
          Description
        </h3>
        {isEditing ? (
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full text-sm text-slate-dark leading-relaxed bg-white border border-primary rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
            placeholder="Add a description..."
            autoFocus
            disabled={isSaving}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="rounded-xl bg-white p-4 cursor-pointer hover:bg-surface-low transition-colors"
          >
            {description ? (
              <p className="text-sm leading-relaxed text-slate-dark whitespace-pre-wrap">
                {description}
              </p>
            ) : (
              <p className="text-sm text-slate-medium italic">
                No description provided
              </p>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-medium">
        Description
      </h3>
      {isEditing ? (
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full max-w-3xl text-sm text-slate-dark leading-relaxed bg-transparent border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
          placeholder="Add a description..."
          autoFocus
          disabled={isSaving}
        />
      ) : (
        <p
          onClick={() => setIsEditing(true)}
          className="max-w-3xl text-sm text-slate-dark leading-relaxed whitespace-pre-wrap cursor-pointer hover:bg-surface-low rounded px-3 py-2 -mx-3"
        >
          {description || (
            <span className="text-slate-medium italic">
              No description provided
            </span>
          )}
        </p>
      )}
    </>
  );
}
