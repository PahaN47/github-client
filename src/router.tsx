import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootStoreProvider from 'store/RootStore';
import App from './App';

const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <RootStoreProvider>
        <App />
      </RootStoreProvider>
    ),
  },
]);

export default router;
