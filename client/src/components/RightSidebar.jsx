import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import api from '../utils/api';

const RightSidebar = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [following, setFollowing] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t] = await Promise.all([
          api.get('/users/suggestions'),
          api.get('/posts/trending-tags'),
        ]);
        setSuggestions(s.data);
        setTrending(t.data);
      } catch {}
    };
    load();
  }, []);

  const handleFollow = async (userId) => {
    try {
      await api.put(`/users/${userId}/follow`);
      setFollowing(prev => ({ ...prev, [userId]: !prev[userId] }));
    } catch {}
  };

  return (
    <aside style={{
      width: 'var(--rightbar-w)', padding: '24px 16px',
      height: '100vh', position: 'sticky', top: 0,
      overflowY: 'auto', borderLeft: '1px solid var(--border)',
    }}>
      {/* Trending tags */}
      {trending.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            // trending
          </h3>
          {trending.slice(0, 6).map(({ tag, count }) => (
            <div key={tag} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginBottom: 2,
              cursor: 'pointer', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 13, color: 'var(--accent-2)', fontFamily: 'var(--font-mono)' }}>#{tag}</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{count}</span>
            </div>
          ))}
        </section>
      )}

      {/* Who to follow */}
      {suggestions.length > 0 && (
        <section>
          <h3 style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            // who_to_follow
          </h3>
          {suggestions.map(u => (
            <div key={u._id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0', borderBottom: '1px solid var(--border)',
            }}>
              <Link to={`/u/${u.username}`}>
                <Avatar user={u} size={34} />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/u/${u.username}`}>
                  <div style={{ fontSize: 13, fontWeight: 600 }} className="truncate">{u.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>@{u.username}</div>
                </Link>
              </div>
              <button
                onClick={() => handleFollow(u._id)}
                style={{
                  padding: '5px 10px', borderRadius: 100, fontSize: 11,
                  fontFamily: 'var(--font-mono)', fontWeight: 600,
                  background: following[u._id] ? 'var(--bg-4)' : 'var(--accent)',
                  color: following[u._id] ? 'var(--text-2)' : '#fff',
                  border: following[u._id] ? '1px solid var(--border-2)' : 'none',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >
                {following[u._id] ? 'following' : 'follow'}
              </button>
            </div>
          ))}
        </section>
      )}
    </aside>
  );
};

export default RightSidebar;
