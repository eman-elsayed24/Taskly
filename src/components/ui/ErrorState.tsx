import Button from './button';
import ConnectionErrorIcon from '../../assets/icons/connectionError.svg?react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryButtonText?: string;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = "We're having trouble retrieving your projects right now. Please try again in a moment.",
  onRetry,
  retryButtonText = 'Retry Connection',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-error-low flex items-center justify-center mb-6">
        <ConnectionErrorIcon className="w-7 h-7" />
      </div>
      <h3 className="text-2xl font-semibold text-slate-dark mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-base text-slate-medium text-center max-w-md mb-8 leading-6">
        {message}
      </p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          {retryButtonText}
        </Button>
      )}
    </div>
  );
}
