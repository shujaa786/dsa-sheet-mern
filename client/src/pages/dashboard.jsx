import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [grouped, setGrouped] = useState({});
    const [completedSet, setCompletedSet] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [problemsRes, progressRes] = await Promise.all([
                API.get('/problems'),
                API.get('/progress')
            ]);
            setGrouped(problemsRes.data || {});
            // progressRes.data is array of { problemId: {...}, completedAt }
            const set = new Set((progressRes.data || []).map(p => (p.problemId && p.problemId._id) || p.problemId));
            setCompletedSet(set);
        } catch (err) {
            // token might be invalid — redirect to login
            localStorage.removeItem('user');
            nav('/login');
        } finally {
            setLoading(false);
        }
    };

    const toggle = async (problemId) => {
        try {
            await API.post('/progress', { problemId });
            // optimistically update local set
            const newSet = new Set(completedSet);
            if (newSet.has(problemId)) newSet.delete(problemId); else newSet.add(problemId);
            setCompletedSet(newSet);
        } catch (err) {
            alert('Action failed');
        }
    };

    const logout = async () => {
        try {
            await API.post('/auth/logout');
        } catch (e) { }
        localStorage.removeItem('user');
        nav('/login');
    };

    if (loading) return <div>Loading...</div>;

    const total = Object.values(grouped).flat().length;
    const done = completedSet.size;
    const percent = total ? Math.round((done / total) * 100) : 0;

    return (
        <div style={{ padding: 20, maxWidth: 900, margin: '20px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1>DSA Sheet</h1>
                <div>
                    <button onClick={fetchAll} style={{ marginRight: 8 }}>Refresh</button>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>

            {Object.keys(grouped).length === 0 && <p>No problems yet</p>}

            {Object.keys(grouped).map(chapter => (
                <section key={chapter} style={{ marginBottom: 20, border: '1px solid #eee', padding: 12, borderRadius: 6 }}>
                    <h2>{chapter}</h2>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {grouped[chapter].map(prob => {
                            const id = prob._id || prob.id;
                            const done = completedSet.has(id);
                            return (
                                <li key={id} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <input type="checkbox" checked={done} onChange={() => toggle(id)} />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{prob.title} <small style={{ marginLeft: 8, color: '#666' }}>({prob.level})</small></div>
                                            <div style={{ fontSize: 13, color: '#333' }}>
                                                {prob.subtopic ? <span>{prob.subtopic} • </span> : null}
                                                {prob.youtube && <a href={prob.youtube} target="_blank" rel="noreferrer">YouTube</a>}
                                                {prob.leetcode && <> | <a href={prob.leetcode} target="_blank" rel="noreferrer">LeetCode</a></>}
                                                {prob.article && <> | <a href={prob.article} target="_blank" rel="noreferrer">Article</a></>}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ minWidth: 120, textAlign: 'right' }}>
                                        <small>{prob.order ? `#${prob.order}` : null}</small>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}
        </div>
    );
}
