import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import StoreProvider from 'store/store';
import RepoPage from './pages/RepoPage';
import ReposPage from './pages/ReposPage';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/repos/ktsstudio" />} />
          <Route path="/repos/:owner" element={<ReposPage />} />
          <Route path="/repos/:owner/:name" element={<RepoPage />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
