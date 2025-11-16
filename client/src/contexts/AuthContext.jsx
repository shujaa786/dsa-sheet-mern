import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await API.get('/auth/me');
        if (mounted) setUser(data.user);
      } catch (e) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoadingAuth(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
