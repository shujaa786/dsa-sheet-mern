import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Navbar(){
  return (
    <nav className="topbar">
      <div className="brand">Dashboard</div>
      <div className="navlinks">
        <NavLink to="/profile" className={({isActive})=>isActive?'active':''}>Profile</NavLink>
        <NavLink to="/topics" className={({isActive})=>isActive?'active':''}>Topics</NavLink>
        <NavLink to="/progress" className={({isActive})=>isActive?'active':''}>Progress</NavLink>
      </div>
    </nav>
  );
}
