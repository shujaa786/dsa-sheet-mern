import React, { useEffect, useRef, useContext } from 'react';
import useDashboardData from '../hooks/useDashboardData';
import ProgressReport from '../components/ProgressReport.jsx';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Progress(){
  const { user, loadingAuth } = useContext(AuthContext);
  const nav = useNavigate();
  const { grouped, progressSet, loading, fetchAll } = useDashboardData();
  const didFetch = useRef(false);

  useEffect(()=>{
    if (loadingAuth) return;
    if (!user) { nav('/login'); return; }
    if (didFetch.current) return;
    didFetch.current = true;
    fetchAll();
  }, [loadingAuth, user, fetchAll, nav]);

  if (loading || loadingAuth) return <div className="center">Loading...</div>;

  const all = Object.values(grouped).flat();
  const totals = { Easy:0, Medium:0, Hard:0 }, done = { Easy:0, Medium:0, Hard:0 };
  all.forEach(p => {
    const lvl = p.level || 'Easy';
    totals[lvl] = (totals[lvl] || 0) + 1;
    const id = p._id || p.id;
    if (id && progressSet.has(id)) done[lvl] = (done[lvl] || 0) + 1;
  });
  const report = {
    Easy: totals.Easy ? Math.round((done.Easy||0)/totals.Easy*100) : 0,
    Medium: totals.Medium ? Math.round((done.Medium||0)/totals.Medium*100) : 0,
    Hard: totals.Hard ? Math.round((done.Hard||0)/totals.Hard*100) : 0
  };

  return <ProgressReport report={report} />;
}
