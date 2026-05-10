import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const navItems = [
  { to: '/feed', label: 'Feed', icon: '⌂' },
  { to: '/explore', label: 'Explore', icon: '◎' },
  { to: '/notifications', label: 'Notifications', icon: '◌' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: 'var(--sidebar-w)', height: '100vh', position: 'sticky', top: 0,
      background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '24px 16px',
    }}>
      {/* Logo */}
      <Link to="/feed" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, padding: '0 4px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)',
        }}>D</div>
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>DevConnect</span>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 'var(--radius-sm)',
                marginBottom: 4, fontSize: 14, fontWeight: active ? 600 : 400,
                color: active ? 'var(--text)' : 'var(--text-2)',
                background: active ? 'var(--bg-4)' : 'transparent',
                border: active ? '1px solid var(--border-2)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-3)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {user && (
          <Link
            to={`/u/${user.username}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 'var(--radius-sm)',
              marginBottom: 4, fontSize: 14, fontWeight: 400,
              color: location.pathname === `/u/${user.username}` ? 'var(--text)' : 'var(--text-2)',
              background: location.pathname === `/u/${user.username}` ? 'var(--bg-4)' : 'transparent',
              border: location.pathname === `/u/${user.username}` ? '1px solid var(--border-2)' : '1px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>◈</span>
            Profile
          </Link>
        )}
      </nav>

      {/* User footer */}
      {user && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <Link to={`/u/${user.username}`} className="flex items-center gap-3" style={{ marginBottom: 12 }}>
            <Avatar user={user} size={36} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }} className="truncate">{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }} className="truncate">@{user.username}</div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)',
              fontSize: 12, color: 'var(--text-3)', border: '1px solid var(--border)',
              background: 'transparent', fontFamily: 'var(--font-mono)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            sign_out()
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
