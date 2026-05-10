import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Avatar from './Avatar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localPost, setLocalPost] = useState(post);

  const isLiked = localPost.likes?.includes(user?._id);
  const isOwner = localPost.user?._id === user?._id;

  const handleLike = async () => {
    try {
      const { data } = await api.put(`/posts/${localPost._id}/like`);
      setLocalPost(prev => ({ ...prev, likes: data.likes }));
      onUpdate?.({ ...localPost, likes: data.likes });
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${localPost._id}/comments`, { text: commentText });
      setLocalPost(prev => ({ ...prev, comments: [data, ...prev.comments] }));
      setCommentText('');
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${localPost._id}`);
      onDelete?.(localPost._id);
    } catch {}
  };

  return (
    <article style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <Link to={`/u/${localPost.user?.username}`} className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
          <Avatar user={localPost.user} size={38} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }} className="truncate">{localPost.user?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
              @{localPost.user?.username} · {formatDistanceToNow(new Date(localPost.createdAt), { addSuffix: true })}
            </div>
          </div>
        </Link>
        {isOwner && (
          <button onClick={handleDelete} style={{ color: 'var(--text-3)', fontSize: 18, lineHeight: 1, padding: '2px 6px', borderRadius: 'var(--radius-sm)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
          >×</button>
        )}
      </div>

      {/* Content */}
      <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.65, color: 'var(--text)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {localPost.content}
      </p>

      {/* Code snippet */}
      {localPost.codeSnippet?.code && (
        <div style={{ marginTop: 14, background: 'var(--bg-4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
              {localPost.codeSnippet.language || 'code'}
            </span>
          </div>
          <pre style={{ padding: '14px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text)', overflowX: 'auto', lineHeight: 1.6 }}>
            {localPost.codeSnippet.code}
          </pre>
        </div>
      )}

      {/* Tags */}
      {localPost.tags?.length > 0 && (
        <div className="flex gap-2" style={{ marginTop: 12, flexWrap: 'wrap' }}>
          {localPost.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, padding: '3px 8px', borderRadius: 100,
              background: 'var(--accent-glow)', color: 'var(--accent-2)',
              fontFamily: 'var(--font-mono)', fontWeight: 500,
            }}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 items-center" style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLike}
          className="flex items-center gap-2"
          style={{ fontSize: 13, color: isLiked ? 'var(--red)' : 'var(--text-3)', transition: 'color 0.2s', fontFamily: 'var(--font-mono)' }}
        >
          <span style={{ fontSize: 16 }}>{isLiked ? '♥' : '♡'}</span>
          {localPost.likes?.length || 0}
        </button>

        <button
          onClick={() => setShowComments(v => !v)}
          className="flex items-center gap-2"
          style={{ fontSize: 13, color: showComments ? 'var(--accent-2)' : 'var(--text-3)', transition: 'color 0.2s', fontFamily: 'var(--font-mono)' }}
        >
          <span style={{ fontSize: 15 }}>💬</span>
          {localPost.comments?.length || 0}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div style={{ marginTop: 16 }}>
          <form onSubmit={handleComment} className="flex gap-2 items-center" style={{ marginBottom: 14 }}>
            <Avatar user={user} size={28} />
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{
                flex: 1, background: 'var(--bg-3)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 13,
                color: 'var(--text)', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              style={{
                padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                fontWeight: 600, background: 'var(--accent)', color: '#fff',
                opacity: submitting || !commentText.trim() ? 0.5 : 1, fontFamily: 'var(--font-mono)',
              }}
            >Send</button>
          </form>

          {localPost.comments?.map(c => (
            <div key={c._id} className="flex items-start gap-2" style={{ padding: '10px 0', borderTop: '1px solid var(--border)' }}>
              <Link to={`/u/${c.user?.username}`}>
                <Avatar user={c.user} size={28} />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link to={`/u/${c.user?.username}`} style={{ fontSize: 12, fontWeight: 600 }}>{c.user?.name}</Link>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2, lineHeight: 1.5 }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default PostCard;
