import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const EditModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    github: user.github || '',
    skills: user.skills?.join(', ') || '',
    avatar: user.avatar || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      onSave(data);
      onClose();
    } catch {}
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: 13,
    color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-sans)',
  };

  const fields = [
    { key: 'name', label: 'name', placeholder: 'Your full name' },
    { key: 'bio', label: 'bio', placeholder: 'Tell the world about yourself...', multiline: true },
    { key: 'location', label: 'location', placeholder: 'San Francisco, CA' },
    { key: 'website', label: 'website', placeholder: 'https://yoursite.dev' },
    { key: 'github', label: 'github', placeholder: 'yourusername' },
    { key: 'skills', label: 'skills (comma-separated)', placeholder: 'React, Node.js, Rust' },
    { key: 'avatar', label: 'avatar url', placeholder: 'https://...' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 28, width: '100%', maxWidth: 480,
        maxHeight: '85vh', overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Edit profile</h2>
          <button onClick={onClose} style={{ color: 'var(--text-3)', fontSize: 20 }}>×</button>
        </div>

        {fields.map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', marginBottom: 5 }}>{f.label}</label>
            {f.multiline ? (
              <textarea
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            ) : (
              <input
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            )}
          </div>
        ))}

        <div className="flex gap-3" style={{ marginTop: 20 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: 'var(--radius-sm)', fontSize: 13,
            color: 'var(--text-2)', border: '1px solid var(--border)', background: 'transparent',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: '11px', borderRadius: 'var(--radius-sm)', fontSize: 13,
            fontWeight: 700, background: 'var(--accent)', color: '#fff',
            opacity: saving ? 0.7 : 1,
          }}>{saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const isOwn = currentUser?.username === username;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/users/${username}`);
        setProfile(data.user);
        setPosts(data.posts);
        setIsFollowing(data.user.followers?.some(f => f._id === currentUser?._id || f === currentUser?._id));
      } catch {}
      setLoading(false);
    };
    load();
  }, [username, currentUser?._id]);

  const handleFollow = async () => {
    try {
      await api.put(`/users/${profile._id}/follow`);
      setIsFollowing(v => !v);
      setProfile(prev => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter(f => (f._id || f) !== currentUser._id)
          : [...prev.followers, currentUser],
      }));
    } catch {}
  };

  const handleSave = (updated) => {
    setProfile(updated);
    updateUser(updated);
  };

  const handleDeletePost = (id) => setPosts(prev => prev.filter(p => p._id !== id));
  const handleUpdatePost = (up) => setPosts(prev => prev.map(p => p._id === up._id ? up : p));

  if (loading) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        loading profile...
      </div>
    </Layout>
  );

  if (!profile) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <p style={{ fontSize: 15, color: 'var(--text-2)' }}>User not found</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {showEdit && <EditModal user={profile} onClose={() => setShowEdit(false)} onSave={handleSave} />}

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px' }}>
        {/* Profile header */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', marginBottom: 16 }}>
          <div className="flex items-start justify-between gap-4">
            <Avatar user={profile} size={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{profile.name}</h1>
              <div style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>@{profile.username}</div>
              {profile.bio && <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 12 }}>{profile.bio}</p>}

              <div className="flex gap-4 flex-wrap" style={{ marginBottom: 12 }}>
                {profile.location && (
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>📍 {profile.location}</span>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--accent-2)' }}>
                    🔗 {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {profile.github && (
                  <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    ⌥ github/{profile.github}
                  </a>
                )}
              </div>

              {profile.skills?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {profile.skills.map(s => (
                    <span key={s} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, background: 'var(--bg-4)', border: '1px solid var(--border-2)', color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isOwn ? (
              <button onClick={() => setShowEdit(true)} style={{
                padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                fontFamily: 'var(--font-mono)', border: '1px solid var(--border-2)',
                color: 'var(--text-2)', background: 'var(--bg-3)', transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}>edit profile</button>
            ) : (
              <button onClick={handleFollow} style={{
                padding: '8px 18px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                fontFamily: 'var(--font-mono)', fontWeight: 700,
                background: isFollowing ? 'var(--bg-4)' : 'var(--accent)',
                color: isFollowing ? 'var(--text-2)' : '#fff',
                border: isFollowing ? '1px solid var(--border-2)' : 'none',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}>
                {isFollowing ? 'following' : 'follow'}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            {[
              { label: 'posts', value: posts.length },
              { label: 'followers', value: profile.followers?.length || 0 },
              { label: 'following', value: profile.following?.length || 0 },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Posts */}
        <h2 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', marginBottom: 14 }}>// posts</h2>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)', fontSize: 13 }}>
            No posts yet.
          </div>
        ) : (
          <div className="flex-col gap-3">
            {posts.map(p => (
              <PostCard key={p._id} post={p} onDelete={handleDeletePost} onUpdate={handleUpdatePost} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
