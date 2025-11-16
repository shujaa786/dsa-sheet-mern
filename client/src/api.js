// import axios from 'axios';

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
//   withCredentials: true // important so HttpOnly cookies are sent when available
// });

// // attach Authorization header when a token is stored (fallback to cookie auth)
// API.interceptors.request.use(cfg => {
//   try {
//     const token = localStorage.getItem('token');
//     if (token) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
//   } catch (e) {}
//   return cfg;
// });

// export default API;

// src/api.js
// export const API = process.env.REACT_APP_API || '';

// async function request(path, { method = 'GET', body, headers = {}, useCredentials = true } = {}) {
//   const opts = {
//     method,
//     headers: {
//       ...(body ? { 'Content-Type': 'application/json' } : {}),
//       ...headers
//     },
//     ...(body ? { body: JSON.stringify(body) } : {}),
//     ...(useCredentials ? { credentials: 'include' } : {})
//   };
//   const res = await fetch(`${API}${path}`, opts);
//   if (!res.ok) {
//     const txt = await res.text().catch(() => '');
//     const err = new Error(`HTTP ${res.status} ${res.statusText} ${txt}`);
//     err.status = res.status;
//     throw err;
//   }
//   return res.json().catch(() => null);
// }

// export const fetchTopics = () => request('/api/problems', { method: 'GET' });
// export const fetchProgress = () => request('/api/progress', { method: 'GET' });
// export const toggleProgress = (problemId) =>
//   request('/api/progress', { method: 'POST', body: { problemId } });
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true // important: sends HttpOnly cookies
});

export default API;
