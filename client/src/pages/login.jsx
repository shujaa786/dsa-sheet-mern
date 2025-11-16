import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const { setUser } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        nav('/profile');
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth:420, margin:'40px auto', padding:20 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}}/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}}/>
        <button style={{width:'100%',padding:10}} type="submit">Login</button>
      </form>
    </div>
  );
}
