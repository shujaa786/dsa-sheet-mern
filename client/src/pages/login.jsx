import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      // server set HttpOnly cookie; store only user for UI
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        nav('/');
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding:20, border:'1px solid #eee', borderRadius:8 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom:10 }}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{ width:'100%', padding:8 }} />
        </div>
        <div style={{ marginBottom:10 }}>
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width:'100%', padding:8 }} />
        </div>
        <button style={{ width:'100%', padding:10 }} type="submit">Login</button>
      </form>
      <p style={{ marginTop:10 }}>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
