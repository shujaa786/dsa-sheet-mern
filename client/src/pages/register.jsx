import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        nav('/');
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Register failed');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding:20, border:'1px solid #eee', borderRadius:8 }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom:10 }}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{ width:'100%', padding:8 }} />
        </div>
        <div style={{ marginBottom:10 }}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{ width:'100%', padding:8 }} />
        </div>
        <div style={{ marginBottom:10 }}>
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width:'100%', padding:8 }} />
        </div>
        <button style={{ width:'100%', padding:10 }} type="submit">Register</button>
      </form>
      <p style={{ marginTop:10 }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
