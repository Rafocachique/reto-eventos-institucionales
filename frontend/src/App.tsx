import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserPortal from './pages/UserPortal/UserPortal';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserPortal />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
