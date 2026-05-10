import React from 'react';

const Avatar = ({ user, size = 40, className = '' }) => {
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const colors = [
    ['#7c6af7', '#2a2060'],
    ['#4ade80', '#0f3320'],
    ['#60a5fa', '#0f2440'],
    ['#f87171', '#3a0f0f'],
    ['#fbbf24', '#3a2a00'],
    ['#a78bfa', '#1e1040'],
  ];

  const idx = user?.name
    ? user.name.charCodeAt(0) % colors.length
    : 0;
  const [fg, bg] = colors[idx];

  const style = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.35,
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    background: bg,
    color: fg,
    border: '1.5px solid rgba(255,255,255,0.08)',
  };

  if (user?.avatar) {
    return (
      <div style={style} className={className}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>
    );
  }

  return (
    <div style={style} className={className}>
      {initials}
    </div>
  );
};

export default Avatar;
