// client/src/components/ProfileCard.jsx
import React from 'react';

export default function ProfileCard({ user }) {
  return (
    <section className="card">
      <h2>Welcome{user?.name ? `, ${user.name}` : ''}</h2>
      <p>{user?.email}</p>
    </section>
  );
}
