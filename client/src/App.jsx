// client/src/app.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Dashboard from './pages/dashboard.jsx';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/"
               element={<Dashboard/>} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </BrowserRouter>
  );
}
