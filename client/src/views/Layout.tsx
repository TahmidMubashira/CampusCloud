import { useState } from 'react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home',         to: '/',          icon: '🏠' },
  { label: 'Resources',    to: '/resources', icon: '📄' },
  { label: 'Upload',       to: '/upload',    icon: '⬆️' },
  { label: 'Rewards',      to: '/rewards',   icon: '🏅' },
  { label: 'Profile',      to: '/profile',   icon: '👤' },
  { label: 'AI Assistant', to: '/assistant', icon: '🤖' },
];

interface LayoutProps {
  active: string;
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export default function Layout({ active, children, userName, userEmail }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SU';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Lora:wght@400;600;700&display=swap');

        .cc-sidebar {
          width: 220px;
          min-height: 100vh;
          background: #d7e3ec;
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          flex-shrink: 0;
        }

        .cc-mobile-header { display: none; }
        .cc-overlay { display: none; }
        .cc-close-btn { display: none; }

        @media (max-width: 768px) {
          .cc-sidebar {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            width: 240px;
            overflow-y: auto;
          }
          .cc-sidebar.open { transform: translateX(0); }
          .cc-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 999;
          }
          .cc-mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #d7e3ec;
            padding: 14px 20px;
            border-bottom: 1px solid #b8cdd9;
            position: sticky;
            top: 0;
            z-index: 100;
            width: 100%;
          }
          .cc-close-btn { display: block !important; }
          .cc-main { padding: 20px 16px !important; }
        }
      `}</style>

      {/* Mobile Header */}
      <div className="cc-mobile-header">
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a3a50' }}>CampusCloud</div>
          <div style={{ fontSize: '0.65rem', color: '#6a8fa8' }}>Resource Sharing</div>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            background: 'none', border: '1.5px solid #b8cdd9',
            borderRadius: '6px', padding: '6px 10px',
            cursor: 'pointer', color: '#1a3a50', fontSize: '1rem',
          }}
        >☰</button>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="cc-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Sidebar */}
      <aside className={`cc-sidebar ${menuOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a3a50' }}>CampusCloud</div>
            <div style={{ fontSize: '0.7rem', color: '#6a8fa8' }}>Resource Sharing</div>
          </div>
          <button
            className="cc-close-btn"
            onClick={() => setMenuOpen(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#4a6a80', fontSize: '1.2rem', lineHeight: 1, display: 'none',
            }}
          >✕</button>
        </div>

        <div style={{ borderTop: '1px solid #b8cdd9', marginBottom: '16px' }} />

        <nav style={{ flex: 1, padding: '0 12px' }}>
          {NAV_ITEMS.map(item => {
            const isActive = active === item.label;
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
                  textDecoration: 'none', fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#1a3a50' : '#4a6a80',
                  background: isActive ? '#b8cdd9' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ fontSize: '0.95rem' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{
          margin: '0 12px', borderTop: '1px solid #b8cdd9',
          paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', background: '#8aafc5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
          }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1a3a50', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userName || 'Student User'}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#6a8fa8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userEmail || 'student@uni.edu'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="cc-main" style={{ flex: 1, padding: '36px 40px', overflowY: 'auto', overflowX: 'hidden', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}