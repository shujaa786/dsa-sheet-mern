import { useState, useCallback } from 'react';
import API from '../api';

export default function useDashboardData() {
  const [grouped, setGrouped] = useState({});
  const [progressSet, setProgressSet] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const normalizeProblems = (data) => {
    let topicsArray = [];
    if (!data) return [];
    if (Array.isArray(data)) topicsArray = data;
    else if (Array.isArray(data.topics)) topicsArray = data.topics;
    else {
      const keys = Object.keys(data || {});
      topicsArray = keys.map(k => ({ name: k, subTopics: data[k] }));
    }
    return topicsArray;
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [problemsRes, progRes] = await Promise.all([API.get('/problems'), API.get('/progress')]);

      const topicsArray = normalizeProblems(problemsRes.data);
      const groupedObj = {};
      topicsArray.forEach(t => groupedObj[t.name || 'Misc'] = t.subTopics || []);

      setGrouped(groupedObj);

      const progArray = Array.isArray(progRes.data) ? progRes.data : [];
      const s = new Set(progArray.map(p => {
        if (!p) return null;
        if (typeof p.problemId === 'string') return p.problemId;
        if (p.problemId && (p.problemId._id || p.problemId.id)) return p.problemId._id || p.problemId.id;
        return null;
      }).filter(Boolean));
      setProgressSet(s);
    } catch (err) {
      console.error('useDashboardData fetchAll error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = useCallback(async (problemId) => {
    // optimistic update
    const prev = new Set(progressSet);
    const s = new Set(prev);
    if (s.has(problemId)) s.delete(problemId); else s.add(problemId);
    setProgressSet(s);
    try {
      await API.post('/progress', { problemId });
    } catch (err) {
      setProgressSet(prev); // rollback
      throw err;
    }
  }, [progressSet]);

  return { grouped, progressSet, loading, fetchAll, toggle };
}
