import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import Avatar from '../components/Avatar';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('posts');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/posts/explore?limit=30');
        setPosts(data.posts);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!search.trim()) { setUsers([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get(`/users/search?q=${encodeURIComponent(search)}`);
        setUsers(data);
      } catch {}
      setSearching(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = (id) => setPosts(prev => prev.filter(p => p._id !== id));
  const handleUpdate = (up) => setPosts(prev => prev.map(p => p._id === up._id ? up : p));

  return (
    <Layout>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', marginBottom: 16 }}>
            // explore
          </h1>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search developers..."
              style={{
                width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '11px 14px 11px 38px',
                fontSize: 14, color: 'var(--text)', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: 14 }}>⌕</span>
          </div>

          {/* User search results */}
          {search && (
            <div style={{ marginTop: 8, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              {searching ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>searching...</div>
              ) : users.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>No users found</div>
              ) : users.map(u => (
                <Link key={u._id} to={`/u/${u.username}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Avatar user={u} size={36} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>@{u.username}</div>
                  </div>
                  {u.skills?.length > 0 && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                      {u.skills.slice(0, 2).map(s => (
                        <span key={s} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 100, background: 'var(--accent-glow)', color: 'var(--accent-2)', fontFamily: 'var(--font-mono)' }}>{s}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2" style={{ marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {['posts'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 16px', fontSize: 13, fontFamily: 'var(--font-mono)',
                color: tab === t ? 'var(--text)' : 'var(--text-3)',
                borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                background: 'none', transition: 'all 0.2s',
              }}
            >{t}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            loading...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-3)' }}>
            No posts yet. Be the first to post!
          </div>
        ) : (
          <div className="flex-col gap-3">
            {posts.map(p => (
              <PostCard key={p._id} post={p} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;
