import { useState, useEffect } from 'react';
import Layout from './Layout';

interface UploadItem {
  id: number;
  title: string;
  department: string;
  courseCode: string;
  fileType: string;
  downloads?: number;
  timeAgo: string;
  rejection_reason?: string; 
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

function StatCard({ label, value, sub, icon }: {
  label: string; value: string | number; sub: string; icon: string;
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: '10px', padding: '18px 20px',
      flex: 1, border: '1px solid #dce8f0', minWidth: '130px',
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

  const hasReason = badge === 'rejected' && item.rejection_reason;

  return (
    <div style={{ marginBottom: '10px' }}>
      {/* Main row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '14px 16px', background: '#f5f9fc',
        borderRadius: hasReason ? '8px 8px 0 0' : '8px',
        border: '1px solid #e4eef5',
        borderBottom: hasReason ? 'none' : '1px solid #e4eef5',
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: '34px', height: '38px', flexShrink: 0,
          background: '#edf5fa', border: '1px solid #c8dce8',
          borderRadius: '6px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '1rem',
        }}>📄</div>

        <div style={{ flex: 1, minWidth: '120px' }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a3a50' }}>
            {item.title}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7a9db5' }}>
            {item.department} • {item.courseCode}
          </div>
          <div style={{ display: 'flex', gap: '14px', marginTop: '4px', flexWrap: 'wrap' }}>
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

      {/* Rejection reason banner — only shows for rejected items with a reason */}
      {hasReason && (
        <div style={{
          padding: '10px 16px',
          background: '#fff5f5',
          border: '1px solid #fecaca',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          fontSize: '0.78rem',
          color: '#dc2626',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
        }}>
          <span style={{ flexShrink: 0 }}>💬</span>
          <span><strong>Admin feedback:</strong> {item.rejection_reason}</span>
        </div>
      )}
    </div>
  );
}

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

  const handleDelete = (id: number) => {
    setStats(prev => {
      if (!prev) return prev;
      const deleted =
        prev.allApproved.find(r => r.id === id) ||
        prev.pendingUploads.find(r => r.id === id) ||
        prev.rejectedUploads.find(r => r.id === id);
      return {
        ...prev,
        allApproved:     prev.allApproved.filter(r => r.id !== id),
        recentUploads:   prev.recentUploads.filter(r => r.id !== id),
        pendingUploads:  prev.pendingUploads.filter(r => r.id !== id),
        rejectedUploads: prev.rejectedUploads.filter(r => r.id !== id),
        totalUploads:    prev.totalUploads - 1,
        totalDownloads:  prev.totalDownloads - (deleted?.downloads ?? 0),
      };
    });
  };

  if (loading) {
    return (
      <Layout active="Profile">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div style={{ color: '#7a9db5', fontSize: '0.9rem' }}>Loading profile...</div>
        </div>
      </Layout>
    );
  }

  if (error || !stats) {
    return (
      <Layout active="Profile">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div style={{ color: '#e07a7a', fontSize: '0.9rem' }}>⚠️ {error || 'Could not load profile.'}</div>
        </div>
      </Layout>
    );
  }

  const displayedApproved = showAllApproved ? stats.allApproved : stats.recentUploads;

  return (
    <Layout active="Profile" userName={stats.user.name} userEmail={stats.user.email}>
      <style>{`
        .profile-stats-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .profile-stats-row > * { flex: 1; min-width: 130px; }
      `}</style>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.6rem', color: '#1a3a50', margin: 0 }}>
          Welcome back, {stats.user.name} 👋
        </h1>
        <p style={{ color: '#7a9db5', fontSize: '0.85rem', margin: '4px 0 0' }}>
          Here is an overview of your academic contribution
        </p>
      </div>

      <div className="profile-stats-row" style={{ marginBottom: '28px' }}>
        <StatCard label="Total Contribution Points" value={stats.totalPoints} sub="Keep sharing to earn more!" icon="🏅" />
        <StatCard label="Resources Uploaded" value={stats.totalUploads} sub="Total files shared" icon="📄" />
        <StatCard label="Total Downloads" value={stats.totalDownloads} sub="Your impact on peers" icon="⬇️" />
      </div>

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
            <UploadRow key={item.id} item={item} onDelete={handleDelete} />
          ))
        )}
      </SectionCard>

      <SectionCard title={`Pending Approval (${stats.pendingUploads.length})`}>
        {stats.pendingUploads.length === 0 ? (
          <EmptyState message="No pending uploads." />
        ) : (
          stats.pendingUploads.map(item => (
            <UploadRow key={item.id} item={item} badge="pending" onDelete={handleDelete} />
          ))
        )}
      </SectionCard>

      <SectionCard title={`Rejected (${stats.rejectedUploads.length})`}>
        {stats.rejectedUploads.length === 0 ? (
          <EmptyState message="No rejected uploads." />
        ) : (
          stats.rejectedUploads.map(item => (
            <UploadRow key={item.id} item={item} badge="rejected" onDelete={handleDelete} />
          ))
        )}
      </SectionCard>
    </Layout>
  );
}