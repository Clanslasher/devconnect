import React from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

const Layout = ({ children, hideRight }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', maxWidth: 1200, margin: '0 auto' }}>
      <Sidebar />
      <main style={{ flex: 1, borderLeft: '1px solid var(--border)', minWidth: 0 }}>
        {children}
      </main>
      {!hideRight && <RightSidebar />}
    </div>
  );
};

export default Layout;
