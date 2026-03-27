import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Resources', to: '/resources', icon: '📄' },
  { label: 'Upload', to: '/upload', icon: '⬆️' },
  { label: 'Rewards', to: '/rewards', icon: '🏅' },
  { label: 'Profile', to: '/profile', icon: '👤' },
];

function Sidebar({ active }: { active: string }) {
  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#d7e3ec',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      flexShrink: 0,
    }}>
      <Link to="/" style={{ textDecoration: 'none', padding: '0 20px 24px' }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a3a50' }}>CampusCloud</div>
        <div style={{ fontSize: '0.7rem', color: '#6a8fa8' }}>Resource Sharing</div>
      </Link>

      <div style={{ borderTop: '1px solid #b8cdd9', marginBottom: '16px' }} />

      <nav style={{ flex: 1, padding: '0 12px' }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.label;
          return (
            <Link
              key={item.label}
              to={item.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                marginBottom: '4px',
                textDecoration: 'none',
                fontSize: '0.875rem',
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
        margin: '0 12px',
        borderTop: '1px solid #b8cdd9',
        paddingTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#8aafc5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: '0.85rem',
        }}>SU</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1a3a50' }}>Student User</div>
          <div style={{ fontSize: '0.68rem', color: '#6a8fa8' }}>student@uni.edu</div>
        </div>
      </div>
    </aside>
  );
}

export default function RewardsPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Lora:wght@400;600;700&display=swap');
      `}</style>
      <Sidebar active="Rewards" />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#1a3a50', margin: '0 0 4px' }}>
            Rewards And Points
          </h1>
          <p style={{ color: '#7a9db5', fontSize: '0.83rem', margin: 0 }}>
            Track Your contributions and earn rewards for helping the community
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>

          {/* Total Points Earned */}
          <div style={{
            flex: 1,
            background: '#fff',
            borderRadius: '12px',
            padding: '22px 24px',
            border: '1px solid #dce8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '0.78rem', color: '#7a9db5', fontWeight: 600, marginBottom: '10px' }}>
                Total Points earned
              </div>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a9db5" strokeWidth="1.5">
                <circle cx="12" cy="8" r="6" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
              </svg>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a3a50', lineHeight: 1, marginBottom: '8px' }}>
              133
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#7a9db5' }}>
              <span style={{ color: '#4aaa7a', fontWeight: 700 }}>↑</span>
              <span>13 Points this month</span>
            </div>
          </div>

          {/* Your Rank */}
          <div style={{
            flex: 1,
            background: '#fff',
            borderRadius: '12px',
            padding: '22px 24px',
            border: '1px solid #dce8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '0.78rem', color: '#7a9db5', fontWeight: 600, marginBottom: '10px' }}>
                Your Rank
              </div>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a9db5" strokeWidth="1.5">
                <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M12 8c0-2 2-4 4-2s0 4-4 4" /><path d="M12 8c0-2-2-4-4-2s0 4 4 4" />
              </svg>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a3a50', lineHeight: 1, marginBottom: '8px' }}>
              #33
            </div>
            <div style={{ fontSize: '0.72rem', color: '#7a9db5' }}>
              Out of 1,223 contributions
            </div>
          </div>
        </div>

        {/* How to Earn Points */}
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a3a50', margin: '0 0 16px' }}>
            How to Earn Points
          </h2>

          <div style={{ display: 'flex', gap: '16px' }}>

            {/* Upload a Resource */}
            <div style={{
              flex: 1,
              background: '#fff',
              borderRadius: '12px',
              padding: '20px 22px',
              border: '1px solid #dce8f0',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4a6a80' }}>Upload a Resource</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a6a80" strokeWidth="1.8">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.83rem', color: '#7a9db5' }}>Earn 40 points</div>
                <div style={{
                  fontWeight: 800, fontSize: '1rem', color: '#2e7da8',
                  background: '#edf5fa', borderRadius: '8px', padding: '4px 14px',
                }}>+40</div>
              </div>
            </div>

            {/* Resource gets Downloaded */}
            <div style={{
              flex: 1,
              background: '#fff',
              borderRadius: '12px',
              padding: '20px 22px',
              border: '1px solid #dce8f0',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4a6a80' }}>Resource gets Downloaded</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a6a80" strokeWidth="1.8">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.83rem', color: '#7a9db5' }}>Earns 30 points</div>
                <div style={{
                  fontWeight: 800, fontSize: '1rem', color: '#2e7da8',
                  background: '#edf5fa', borderRadius: '8px', padding: '4px 14px',
                }}>+30</div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}