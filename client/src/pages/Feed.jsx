import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import api from '../utils/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = useCallback(async (pageNum = 1) => {
    try {
      const { data } = await api.get(`/posts/feed?page=${pageNum}&limit=20`);
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      setHasMore(pageNum < data.pages);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(1); }, [loadPosts]);

  const handlePost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  const handleUpdate = (updatedPost) => {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadPosts(next);
  };

  return (
    <Layout>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>
            // your_feed
          </h1>
        </div>

        <CreatePost onPost={handlePost} />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⌘</div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Your feed is empty</p>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Follow developers to see their posts here, or explore to discover people.</p>
          </div>
        ) : (
          <div className="flex-col gap-3">
            {posts.map(post => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))}

            {hasMore && (
              <button
                onClick={loadMore}
                style={{
                  width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)',
                  fontSize: 13, color: 'var(--text-2)', border: '1px solid var(--border)',
                  background: 'var(--bg-2)', fontFamily: 'var(--font-mono)', transition: 'all 0.2s', marginTop: 8,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}
              >
                load_more()
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Feed;
