import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'styles/styles.scss';
import 'config/configureMobX';
import router from './router';
import 'regenerator-runtime';

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);

if (module.hot) {
  module.hot.accept();
}
