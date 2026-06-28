import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--toast-success-bg)',
          color: 'var(--toast-success-text)',
          padding: '16px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          border: '1px solid var(--toast-success-border)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          fontWeight: '500',
          minWidth: '300px',
        },
        success: {
          icon: null,
          style: {
            background: 'var(--toast-success-bg)',
            color: 'var(--toast-success-text)',
            border: '1px solid var(--toast-success-border)',
          },
        },
        error: {
          icon: null,
          style: {
            background: 'var(--toast-error-bg)',
            color: 'var(--toast-error-text)',
            border: '1px solid var(--toast-error-border)',
          },
        },
      }}
    />
  );
};

export default ToastProvider;
