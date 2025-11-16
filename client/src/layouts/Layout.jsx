import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/dashboard.css';

export default function Layout(){
  const nav = useNavigate();

  const logout = async () => {
    try { await API.post('/auth/logout'); } catch(e) {}
    localStorage.removeItem('user');
    nav('/login');
  };

  return (
    <div>
      <nav className="topbar">
        <div className="brand">Dashboard</div>
        <div className="navlinks">
          <NavLink to="/profile" className={({isActive})=>isActive?'active':''}>Profile</NavLink>
          <NavLink to="/topics" className={({isActive})=>isActive?'active':''}>Topics</NavLink>
          <NavLink to="/progress" className={({isActive})=>isActive?'active':''}>Progress</NavLink>
          <button onClick={logout} className="logout">Logout</button>
        </div>
      </nav>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}