import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProfileCard from '../components/ProfileCard.jsx';

export default function Profile(){
  const { user, loadingAuth } = useContext(AuthContext);
  if (loadingAuth) return <div className="center">Loading...</div>;
  if (!user) { window.location.href = '/login'; return null; }
  return <ProfileCard user={user} />;
}
