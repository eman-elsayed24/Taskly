import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        containerStyle={{}}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            padding: '16px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            border: '1px solid #bbf7d0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            fontWeight: '500',
            minWidth: '300px',
          },
          success: {
            icon: null, // Remove checkmark icon
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
            },
          },
          error: {
            icon: null, // Remove error icon
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
          },
        }}
      />
    </>
  );
}

export default App;
