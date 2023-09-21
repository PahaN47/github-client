import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useQueryStoreInit } from 'store/RootStore/QueryStore';
import RepoPage from './pages/RepoPage';
import ReposPage from './pages/ReposPage';

function App() {
  useQueryStoreInit();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/repos/ktsstudio" />} />
      <Route path="/repos" element={<Navigate to="/repos/ktsstudio" />} />
      <Route path="/repos/:owner" element={<ReposPage />} />
      <Route path="/repos/:owner/:name" element={<RepoPage />} />
    </Routes>
  );
}

export default App;
