import React, { useEffect, useState } from 'react';
import API from '../api';
import './dashboard.css'; import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useRef } from 'react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('profile'); // default profile
    const [grouped, setGrouped] = useState({}); // { "Algorithms": [subTopic, ...], ... }
    const [progressSet, setProgressSet] = useState(new Set()); // set of completed problemId strings
    const [expanded, setExpanded] = useState({}); // track expanded accordions
    const [loading, setLoading] = useState(true);
    const { user, loadingAuth } = useContext(AuthContext);
    const didFetch = useRef(false);

    useEffect(() => {
        // wait until AuthContext finished loading
        if (loadingAuth) return;

        // if not authenticated, redirect to login
        if (!user) {
            window.location.href = '/login';
            return;
        }

        // Prevent double-fetch in React 18 StrictMode/dev
        if (didFetch.current) return;
        didFetch.current = true;

        let mounted = true;
        (async () => {
            await fetchData();
            if (mounted) setLoading(false);
        })();

        return () => { mounted = false; };
    }, [loadingAuth, user]); // run when auth finished / user available

    // fetch problems and progress, adapt to your backend shape
    const fetchData = async () => {
        try {
            const [problemsRes, progRes] = await Promise.all([
                API.get('/problems'),
                API.get('/progress')
            ]);

            // problemsRes.data might be { topics: [...] } or already grouped
            let topicsArray = [];
            if (problemsRes.data) {
                if (Array.isArray(problemsRes.data)) {
                    // rare case: API returned flat array
                    topicsArray = problemsRes.data;
                } else if (Array.isArray(problemsRes.data.topics)) {
                    topicsArray = problemsRes.data.topics;
                } else {
                    // if API returned grouped object { Algorithms: [...], ... }
                    // convert to topicsArray form
                    const keys = Object.keys(problemsRes.data);
                    topicsArray = keys.map(k => ({ name: k, subTopics: problemsRes.data[k] }));
                }
            }

            // convert topicsArray -> grouped object by topic.name
            const groupedObj = {};
            topicsArray.forEach(topic => {
                const name = topic.name || topic.chapter || 'Misc';
                groupedObj[name] = Array.isArray(topic.subTopics) ? topic.subTopics : topic.subtopics || [];
            });

            setGrouped(groupedObj);

            // build progress set (problemId's are strings in your sample)
            const progArray = Array.isArray(progRes.data) ? progRes.data : [];
            const set = new Set(progArray.map(p => {
                // p.problemId might be string or object; normalize to string id
                if (!p) return null;
                if (typeof p.problemId === 'string') return p.problemId;
                if (p.problemId && (p.problemId._id || p.problemId.id)) return p.problemId._id || p.problemId.id;
                return null;
            }).filter(Boolean));
            setProgressSet(set);

        } catch (err) {
            console.error('Fetch error', err);
        }
    };

    const toggleExpand = (topicName) => {
        setExpanded(prev => ({ ...prev, [topicName]: !prev[topicName] }));
    };

    const isChapterDone = (topicName) => {
        const subs = grouped[topicName] || [];
        if (!subs.length) return false;
        return subs.every(st => {
            const id = st._id || st.id;
            return id && progressSet.has(id);
        });
    };

    const toggleProblem = async (problemId) => {
        try {
            // problemId must be a string id (your backend expects that)
            await API.post('/progress', { problemId });
            // update local set
            setProgressSet(prev => {
                const s = new Set(prev);
                if (s.has(problemId)) s.delete(problemId);
                else s.add(problemId);
                return s;
            });
        } catch (err) {
            console.error('toggle error', err);
            alert('Unable to update progress');
        }
    };

    const logout = async () => {
        try { await API.post('/auth/logout'); } catch (e) { }
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // prepare progress report by level
    const progressReport = () => {
        const all = Object.values(grouped).flat();
        const totals = { Easy: 0, Medium: 0, Hard: 0 };
        const done = { Easy: 0, Medium: 0, Hard: 0 };
        all.forEach(p => {
            const lvl = p.level || 'Easy';
            if (!totals[lvl]) totals[lvl] = 0;
            totals[lvl]++;
            const id = p._id || p.id;
            if (id && progressSet.has(id)) {
                if (!done[lvl]) done[lvl] = 0;
                done[lvl]++;
            }
        });
        return {
            Easy: totals.Easy ? Math.round((done.Easy || 0) / totals.Easy * 100) : 0,
            Medium: totals.Medium ? Math.round((done.Medium || 0) / totals.Medium * 100) : 0,
            Hard: totals.Hard ? Math.round((done.Hard || 0) / totals.Hard * 100) : 0
        };
    };

    if (loading) return <div className="center">Loading...</div>;

    const report = progressReport();

    return (
        <div>
            <nav className="topbar">
                <div className="brand">Dashboard</div>
                <div className="navlinks">
                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
                    <button className={activeTab === 'topics' ? 'active' : ''} onClick={() => setActiveTab('topics')}>Topics</button>
                    <button className={activeTab === 'progress' ? 'active' : ''} onClick={() => setActiveTab('progress')}>Progress</button>
                    <button onClick={logout} className="logout">Logout</button>
                </div>
            </nav>

            <main className="container">
                {activeTab === 'profile' && (
                    <section className="card">
                        <h2>Welcome{user?.name ? `, ${user.name}` : ''}</h2>
                        <p>{user?.email}</p>
                    </section>
                )}

                {activeTab === 'topics' && (
                    <section>
                        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Topics</h2>
                        <p style={{ textAlign: 'center', color: '#666', marginTop: 0 }}>Explore these exciting topics!</p>

                        <div style={{ marginTop: 20 }}>
                            {Object.keys(grouped).map(topicName => {
                                const subs = grouped[topicName] || [];
                                const pending = !isChapterDone(topicName);
                                return (
                                    <div key={topicName} className="accordion">
                                        <div className="accordion-header" onClick={() => toggleExpand(topicName)}>
                                            <div>{topicName} <span className={`badge ${pending ? 'pending' : 'done'}`}>{pending ? 'Pending' : 'Done'}</span></div>
                                            <div className="chev">{expanded[topicName] ? '▴' : '▾'}</div>
                                        </div>

                                        {expanded[topicName] && (
                                            <div className="accordion-body">
                                                <h3>Sub Topics</h3>
                                                <div className="table-wrap">
                                                    <table className="subtable">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '40%' }}>Name</th>
                                                                <th>LeetCode Link</th>
                                                                <th>YouTube Link</th>
                                                                <th>Article Link</th>
                                                                <th>Level</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {subs.map(st => {
                                                                const id = st._id || st.id;
                                                                const done = id && progressSet.has(id);
                                                                return (
                                                                    <tr key={id || Math.random()}>
                                                                        <td>
                                                                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                                <input type="checkbox" checked={!!done} onChange={() => toggleProblem(id)} />
                                                                                <span>{st.name}</span>
                                                                            </label>
                                                                        </td>
                                                                        <td>{st.leetcode ? <a href={st.leetcode} target="_blank" rel="noreferrer">Practice</a> : '-'}</td>
                                                                        <td>{st.youtube ? <a href={st.youtube} target="_blank" rel="noreferrer">Watch</a> : '-'}</td>
                                                                        <td>{st.article ? <a href={st.article} target="_blank" rel="noreferrer">Read</a> : '-'}</td>
                                                                        <td>{st.level || 'Easy'}</td>
                                                                        <td>{done ? <span className="status done">Done</span> : <span className="status pending">Pending</span>}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {activeTab === 'progress' && (
                    <section className="card">
                        <h2>Progress Reports</h2>
                        <div style={{ lineHeight: 2 }}>
                            <div>Easy: {report.Easy}%</div>
                            <div>Medium: {report.Medium}%</div>
                            <div>Hard: {report.Hard}%</div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
