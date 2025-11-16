import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Dashboard from './pages/dashboard.jsx';
import API from './api';

function ProtectedRoute({ children }) {
  // very small client-side guard: if no user in localStorage redirect to login
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  // optional: fetch /auth/me at app load to hydrate user state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await API.get('/auth/me');
        if (data?.user) localStorage.setItem('user', JSON.stringify(data.user));
      } catch (err) {
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
