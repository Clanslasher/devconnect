import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.username, form.email, form.password);
      navigate('/feed');
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? errs[0].msg : err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 14,
    color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-sans)',
  };

  const fields = [
    { key: 'name', label: 'display name', type: 'text', placeholder: 'Ada Lovelace' },
    { key: 'username', label: 'username', type: 'text', placeholder: 'ada_codes' },
    { key: 'email', label: 'email', type: 'email', placeholder: 'ada@example.com' },
    { key: 'password', label: 'password', type: 'password', placeholder: '6+ characters' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(124,106,247,0.05) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(74,222,128,0.03) 0%, transparent 50%)',
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 40, justifyContent: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)',
          }}>D</div>
          <span style={{ fontSize: 22, fontWeight: 800 }}>DevConnect</span>
        </div>

        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Join DevConnect</h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 28 }}>Build in public. Connect with developers.</p>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--red-dim)', border: '1px solid var(--red)', color: 'var(--red)', fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 'var(--radius-sm)',
                fontSize: 14, fontWeight: 700, background: 'var(--accent)', color: '#fff',
                marginTop: 8, opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-2)' }}>
            Already a member?{' '}
            <Link to="/login" style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
