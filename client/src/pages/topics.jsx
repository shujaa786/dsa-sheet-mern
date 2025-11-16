import React, { useEffect, useRef, useContext } from 'react';
import useDashboardData from '../hooks/useDashboardData';
import TopicAccordion from '../components/TopicAccordion.jsx';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topics() {
  const { user, loadingAuth } = useContext(AuthContext);
  const nav = useNavigate();

  const { grouped, progressSet, loading, fetchAll, toggle } = useDashboardData();
  const didFetch = useRef(false);
  const [expandedState, setExpandedState] = React.useState({});

  useEffect(() => {
    if (loadingAuth) return;
    if (!user) { nav('/login'); return; }
    if (didFetch.current) return;
    didFetch.current = true;
    fetchAll();
  }, [loadingAuth, user, nav, fetchAll]);

  const toggleExpand = (name) => setExpandedState(s => ({ ...s, [name]: !s[name] }));

  const isTopicDone = (name) => {
    const subs = grouped[name] || [];
    if (!subs.length) return false;
    return subs.every(st => {
      const id = st._id || st.id;
      return id && progressSet.has(id);
    });
  };

  if (loading || loadingAuth) return <div className="center">Loading...</div>;

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Topics</h2>
      <div style={{ marginTop: 20 }}>
        {Object.keys(grouped).map(name => (
          <TopicAccordion
            key={name}
            name={name}
            subs={grouped[name]}
            expanded={!!expandedState[name]}
            onToggle={toggleExpand}
            onCheck={(id) => toggle(id)}
            done={isTopicDone(name)}
            progressSet={progressSet}
          />
        ))}
      </div>
    </div>
  );
}
