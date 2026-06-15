import AppRouter from './router/AppRouter';
import ToastProvider from './providers/ToastProvider';

function App() {
  return (
    <>
      <AppRouter />
      <ToastProvider />
    </>
  );
}

export default App;
