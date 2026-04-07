import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ── Types ─────────────────────────────────────────────────────────────────────
interface UploadItem {
  id: number;
  title: string;
  department: string;
  courseCode: string;
  fileType: string;
  downloads?: number;
  timeAgo: string;
}

interface ProfileStats {
  user: { id: number; name: string; email: string; role: string };
  totalPoints: number;
  totalUploads: number;
  totalDownloads: number;
  recentUploads: UploadItem[];
  allApproved: UploadItem[];
  pendingUploads: UploadItem[];
  rejectedUploads: UploadItem[];
}

const NAV_ITEMS = [
  { label: 'Home',      to: '/',          icon: '🏠' },
  { label: 'Resources', to: '/resources', icon: '📄' },
  { label: 'Upload',    to: '/upload',    icon: '⬆️' },
  { label: 'Rewards',   to: '/rewards',   icon: '🏅' },
  { label: 'Profile',   to: '/profile',   icon: '👤' },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ name, email }: { name: string; email: string }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SU';

  return (
    <aside style={{
      width: '220px', minHeight: '100vh', background: '#d7e3ec',
      display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0,
    }}>
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a3a50' }}>CampusCloud</div>
        <div style={{ fontSize: '0.7rem', color: '#6a8fa8' }}>Resource Sharing</div>
      </div>
      <div style={{ borderTop: '1px solid #b8cdd9', marginBottom: '16px' }} />
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {NAV_ITEMS.map(item => {
          const isActive = item.label === 'Profile';
          return (
            <Link key={item.label} to={item.to} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
              textDecoration: 'none', fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#1a3a50' : '#4a6a80',
              background: isActive ? '#b8cdd9' : 'transparent',
              transition: 'background 0.15s',
            }}>
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
          color: 'white', fontWeight: 700, fontSize: '0.85rem',
        }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1a3a50' }}>{name || 'Student User'}</div>
          <div style={{ fontSize: '0.68rem', color: '#6a8fa8' }}>{email || ''}</div>
        </div>
      </div>
    </aside>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon }: {
  label: string; value: string | number; sub: string; icon: string;
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: '10px', padding: '18px 20px',
      flex: 1, border: '1px solid #dce8f0',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    }}>
      <div>
        <div style={{ fontSize: '0.72rem', color: '#7a9db5', marginBottom: '6px' }}>{label}</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a3a50', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.68rem', color: '#7a9db5', marginTop: '4px' }}>{sub}</div>
      </div>
      <span style={{ fontSize: '1.3rem' }}>{icon}</span>
    </div>
  );
}

// ── Upload Row ────────────────────────────────────────────────────────────────
function UploadRow({ item, badge, onDelete }: {
  item: UploadItem;
  badge?: 'pending' | 'rejected';
  onDelete?: (id: number) => void;
}) {
  const fileColors: Record<string, { bg: string; text: string }> = {
    PDF:  { bg: '#e8f0fb', text: '#3a6ab5' },
    DOCX: { bg: '#e8f5f0', text: '#2a8a5a' },
    PPTX: { bg: '#fff3e8', text: '#b56a1a' },
    ZIP:  { bg: '#f5e8fb', text: '#7a3ab5' },
    XLSX: { bg: '#e8fbe8', text: '#2a8a2a' },
  };
  const color = fileColors[item.fileType] ?? { bg: '#f0f4f8', text: '#4a6a80' };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/resources/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (result.success) {
      onDelete?.(item.id);
    } else {
      alert(result.message || 'Delete failed.');
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 16px', background: '#f5f9fc',
      borderRadius: '8px', marginBottom: '10px', border: '1px solid #e4eef5',
    }}>
      <div style={{
        width: '34px', height: '38px', flexShrink: 0,
        background: '#edf5fa', border: '1px solid #c8dce8',
        borderRadius: '6px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1rem',
      }}>📄</div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a3a50' }}>
          {item.title}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#7a9db5' }}>
          {item.department} • {item.courseCode}
        </div>
        <div style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
          <span style={{ fontSize: '0.68rem', color: '#9ab5c5' }}>🕐 {item.timeAgo}</span>
          {item.downloads !== undefined && (
            <span style={{ fontSize: '0.68rem', color: '#9ab5c5' }}>⬇️ {item.downloads} downloads</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <span style={{
          background: color.bg, color: color.text,
          borderRadius: '4px', padding: '2px 8px',
          fontSize: '0.68rem', fontWeight: 700,
        }}>{item.fileType}</span>

        {badge === 'pending' && (
          <span style={{
            background: '#fff8e1', color: '#b8860b',
            borderRadius: '4px', padding: '2px 8px',
            fontSize: '0.65rem', fontWeight: 700,
          }}>⏳ Pending</span>
        )}
        {badge === 'rejected' && (
          <span style={{
            background: '#fee2e2', color: '#dc2626',
            borderRadius: '4px', padding: '2px 8px',
            fontSize: '0.65rem', fontWeight: 700,
          }}>❌ Rejected</span>
        )}

        {onDelete && (
          <button
            onClick={handleDelete}
            style={{
              background: '#fee2e2', color: '#dc2626',
              border: 'none', borderRadius: '4px',
              padding: '2px 8px', fontSize: '0.65rem',
              fontWeight: 700, cursor: 'pointer',
              marginTop: '2px',
            }}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ title, action, children }: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: '12px',
      padding: '24px', border: '1px solid #dce8f0', marginBottom: '20px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '16px',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a3a50', margin: 0 }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      textAlign: 'center', padding: '24px',
      color: '#7a9db5', fontSize: '0.82rem',
    }}>
      {message}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentProfile() {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllApproved, setShowAllApproved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in.');
      setLoading(false);
      return;
    }

    fetch('/api/profile/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStats(data);
        } else {
          setError('Failed to load profile.');
        }
      })
      .catch(() => setError('Network error.'))
      .finally(() => setLoading(false));
  }, []);

  // Remove deleted resource from all lists instantly
  const handleDelete = (id: number) => {
    setStats(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        allApproved:     prev.allApproved.filter(r => r.id !== id),
        recentUploads:   prev.recentUploads.filter(r => r.id !== id),
        pendingUploads:  prev.pendingUploads.filter(r => r.id !== id),
        rejectedUploads: prev.rejectedUploads.filter(r => r.id !== id),
        totalUploads:    prev.totalUploads - 1,
      };
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8' }}>
        <Sidebar name="" email="" />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#7a9db5', fontSize: '0.9rem' }}>Loading profile...</div>
        </main>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8' }}>
        <Sidebar name="" email="" />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#e07a7a', fontSize: '0.9rem' }}>⚠️ {error || 'Could not load profile.'}</div>
        </main>
      </div>
    );
  }

  const displayedApproved = showAllApproved ? stats.allApproved : stats.recentUploads;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8' }}>
      <Sidebar name={stats.user.name} email={stats.user.email} />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontWeight: 700, fontSize: '1.6rem', color: '#1a3a50', margin: 0 }}>
            Welcome back, {stats.user.name} 👋
          </h1>
          <p style={{ color: '#7a9db5', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Here is an overview of your academic contribution
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
          <StatCard
            label="Total Contribution Points"
            value={stats.totalPoints}
            sub="Keep sharing to earn more!"
            icon="🏅"
          />
          <StatCard
            label="Resources Uploaded"
            value={stats.totalUploads}
            sub="Total files shared"
            icon="📄"
          />
          <StatCard
            label="Total Downloads"
            value={stats.totalDownloads}
            sub="Your impact on peers"
            icon="⬇️"
          />
        </div>

        {/* Approved Uploads */}
        <SectionCard
          title="Your Uploads"
          action={
            stats.allApproved.length > 3 ? (
              <button
                onClick={() => setShowAllApproved(prev => !prev)}
                style={{
                  fontSize: '0.78rem', color: '#4a90b8',
                  background: 'none', border: 'none',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >
                {showAllApproved ? 'Show Less' : `View All (${stats.allApproved.length})`}
              </button>
            ) : undefined
          }
        >
          {displayedApproved.length === 0 ? (
            <EmptyState message="No approved uploads yet. Upload a resource and wait for admin approval!" />
          ) : (
            displayedApproved.map(item => (
              <UploadRow
                key={item.id}
                item={item}
                onDelete={handleDelete}
              />
            ))
          )}
        </SectionCard>

        {/* Pending Uploads */}
        <SectionCard title={`Pending Approval (${stats.pendingUploads.length})`}>
          {stats.pendingUploads.length === 0 ? (
            <EmptyState message="No pending uploads." />
          ) : (
            stats.pendingUploads.map(item => (
              <UploadRow
                key={item.id}
                item={item}
                badge="pending"
                onDelete={handleDelete}
              />
            ))
          )}
        </SectionCard>

        {/* Rejected Uploads */}
        <SectionCard title={`Rejected (${stats.rejectedUploads.length})`}>
          {stats.rejectedUploads.length === 0 ? (
            <EmptyState message="No rejected uploads." />
          ) : (
            stats.rejectedUploads.map(item => (
              <UploadRow
                key={item.id}
                item={item}
                badge="rejected"
                onDelete={handleDelete}
              />
            ))
          )}
        </SectionCard>

      </main>
    </div>
  );
}