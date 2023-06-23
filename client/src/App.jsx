import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import router from './routes';

const App = () => {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  );
};

export default App;
