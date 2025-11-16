import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Profile from './pages/profile.jsx';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const Topics = React.lazy(() => import('./pages/topics.jsx'));
const Progress = React.lazy(() => import('./pages/progress.jsx'));

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="topics" element={
                <Suspense fallback={<div className="center">Loading topics...</div>}>
                  <Topics />
                </Suspense>
              } />
              <Route path="progress" element={
                <Suspense fallback={<div className="center">Loading progress...</div>}>
                  <Progress />
                </Suspense>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}