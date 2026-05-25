import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          style: {
            background: '#06D6A0',
            color: '#fff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#EF476F',
            color: '#fff',
          },
        },
      }}
    />
  );
}
