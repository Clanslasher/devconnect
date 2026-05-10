import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import api from '../utils/api';

const CreatePost = ({ onPost }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const langs = ['javascript', 'typescript', 'python', 'rust', 'go', 'java', 'cpp', 'css', 'html', 'sql', 'bash'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        content: content.trim(),
        tags: tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
        codeSnippet: showCode && code ? { code, language } : undefined,
      };
      const { data } = await api.post('/posts', payload);
      onPost?.(data);
      setContent('');
      setCode('');
      setTags('');
      setShowCode(false);
    } catch {}
    setSubmitting(false);
  };

  const charCount = content.length;
  const maxChars = 2000;

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--bg-2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16,
    }}>
      <div className="flex gap-3 items-start">
        <Avatar user={user} size={38} />
        <div style={{ flex: 1 }}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What are you building? Share an update, question, or idea..."
            rows={3}
            style={{
              width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '12px', fontSize: 14,
              color: 'var(--text)', resize: 'vertical', outline: 'none', lineHeight: 1.6,
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />

          {showCode && (
            <div style={{ marginTop: 10, background: 'var(--bg-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>language:</span>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 4, padding: '2px 6px', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                >
                  {langs.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <button type="button" onClick={() => { setShowCode(false); setCode(''); }}
                  style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-3)' }}>✕ remove</button>
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="// paste your code snippet here"
                rows={6}
                style={{
                  width: '100%', background: 'transparent', border: 'none',
                  padding: '12px 14px', fontSize: 13, fontFamily: 'var(--font-mono)',
                  color: 'var(--text)', resize: 'vertical', outline: 'none', lineHeight: 1.6,
                }}
              />
            </div>
          )}

          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="#react, #nodejs, #opensource"
            style={{
              width: '100%', marginTop: 10, background: 'var(--bg-3)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              padding: '8px 12px', fontSize: 13, color: 'var(--text)', outline: 'none',
              fontFamily: 'var(--font-mono)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />

          <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCode(v => !v)}
                style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                  background: showCode ? 'var(--accent-glow)' : 'var(--bg-3)',
                  border: `1px solid ${showCode ? 'var(--accent)' : 'var(--border)'}`,
                  color: showCode ? 'var(--accent-2)' : 'var(--text-2)',
                  fontFamily: 'var(--font-mono)', fontWeight: 500, transition: 'all 0.2s',
                }}
              >{'</>'} code</button>
            </div>

            <div className="flex items-center gap-3">
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: charCount > maxChars * 0.9 ? 'var(--amber)' : 'var(--text-3)' }}>
                {charCount}/{maxChars}
              </span>
              <button
                type="submit"
                disabled={!content.trim() || submitting || charCount > maxChars}
                style={{
                  padding: '8px 20px', borderRadius: 'var(--radius-sm)', fontSize: 13,
                  fontWeight: 700, background: 'var(--accent)', color: '#fff',
                  opacity: !content.trim() || submitting || charCount > maxChars ? 0.5 : 1,
                  transition: 'opacity 0.2s', fontFamily: 'var(--font-mono)',
                }}
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePost;
