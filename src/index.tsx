import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'styles/styles.scss';
import 'config/configureMobX';
import router from './router';

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
