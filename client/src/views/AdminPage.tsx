import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Home", to: "/", icon: "🏠" },
  { label: "Resources", to: "/resources", icon: "📄" },
  { label: "Dashboard", to: "/admin", icon: "⚙️" },
];

interface PendingResource {
  id: number;
  title: string;
  department: string;
  courseCode: string;
  fileType: string;
  uploadedBy: string;
  timeAgo: string;
}

interface Stats {
  totalDownloads: number;
  pendingCount: number;
  approvedCount: number;
}

function AdminSidebar({ active, admin }: { active: string; admin: any }) {
  return (
    <aside style={{
      width: "220px",
      minHeight: "100vh",
      background: "#d7e3ec",
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      flexShrink: 0,
    }}>
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1a3a50" }}>CampusCloud</div>
        <div style={{ fontSize: "0.7rem", color: "#6a8fa8" }}>Admin Panel</div>
      </div>

      <div style={{ borderTop: "1px solid #b8cdd9", marginBottom: "16px" }} />

      <nav style={{ flex: 1, padding: "0 12px" }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.label;
          return (
            <Link
              key={item.label}
              to={item.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "4px",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#1a3a50" : "#4a6a80",
                background: isActive ? "#b8cdd9" : "transparent",
                transition: "background 0.15s",
              }}
            >
              <span style={{ fontSize: "0.95rem" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{
        margin: "0 12px",
        borderTop: "1px solid #b8cdd9",
        paddingTop: "16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "#6a8fa8",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 700, fontSize: "0.85rem",
        }}>
          {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "#1a3a50" }}>
            {admin?.name || 'Admin User'}
          </div>
          <div style={{ fontSize: "0.68rem", color: "#6a8fa8" }}>
            {admin?.email || 'admin@uni.edu'}
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ label, value, sub, icon }: {
  label: string;
  value: string | number;
  sub: string;
  icon: string;
}) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "10px",
      padding: "18px 20px",
      flex: 1,
      border: "1px solid #dce8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    }}>
      <div>
        <div style={{ fontSize: "0.72rem", color: "#7a9db5", marginBottom: "6px" }}>{label}</div>
        <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1a3a50", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "0.68rem", color: "#e8704a", marginTop: "4px", fontWeight: 500 }}>{sub}</div>
      </div>
      <span style={{ fontSize: "1.3rem" }}>{icon}</span>
    </div>
  );
}

export default function AdminPage() {
  const [pending, setPending] = useState<PendingResource[]>([]);
  const [stats, setStats] = useState<Stats>({ totalDownloads: 0, pendingCount: 0, approvedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [admin, setAdmin] = useState<any>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Show toast notification
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Fetch admin data
  useEffect(() => {
    // Get admin info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role !== 'admin') {
        navigate('/');
        return;
      }
      setAdmin(user);
    } else {
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/admin/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData);
      }

      // Fetch pending resources
      const pendingRes = await fetch(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/admin/pending`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      const pendingData = await pendingRes.json();
      if (pendingData.success) {
        setPending(pendingData.resources);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      showToast('⚠️ Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Approve resource
  const handleApprove = async (id: number, title: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/admin/approve/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      const data = await res.json();
      if (data.success) {
        setPending(p => p.filter(r => r.id !== id));
        setStats(s => ({ ...s, pendingCount: s.pendingCount - 1, approvedCount: s.approvedCount + 1 }));
        showToast(`✅ "${title}" approved`);
      } else {
        showToast('⚠️ Failed to approve resource');
      }
    } catch {
      showToast('⚠️ Network error');
    }
  };

  // Reject resource
  const handleReject = async (id: number, title: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/admin/reject/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      const data = await res.json();
      if (data.success) {
        setPending(p => p.filter(r => r.id !== id));
        setStats(s => ({ ...s, pendingCount: s.pendingCount - 1 }));
        showToast(`❌ "${title}" rejected`);
      } else {
        showToast('⚠️ Failed to reject resource');
      }
    } catch {
      showToast('⚠️ Network error');
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/admin/logout`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
    } catch {
      console.error('Logout error');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/login');
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>
      <AdminSidebar active="Dashboard" admin={admin} />

      <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto", position: "relative" }}>

        {/* Toast notification */}
        {toast && (
          <div style={{
            position: "fixed", top: "24px", right: "24px", zIndex: 9999,
            background: "#1a3a50", color: "#fff",
            padding: "12px 20px", borderRadius: "8px",
            fontSize: "0.85rem", fontWeight: 500,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            transition: "all 0.3s",
          }}>{toast}</div>
        )}

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: "1.6rem", color: "#1a3a50", margin: 0 }}>
              Welcome back, {admin?.name || 'Admin'}
            </h1>
            <p style={{ color: "#7a9db5", fontSize: "0.85rem", margin: "4px 0 0" }}>
              Here is an overview of platform moderation
            </p>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              background: "#fee2e2",
              border: "1.5px solid #fca5a5",
              color: "#dc2626",
              padding: "8px 20px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <StatCard
            label="Pending Approvals"
            value={loading ? '...' : stats.pendingCount}
            sub="Requires Attention"
            icon="🕐"
          />
          <StatCard
            label="Approved Resources"
            value={loading ? '...' : stats.approvedCount}
            sub="Live on platform"
            icon="✅"
          />
          <StatCard
            label="Total Downloads"
            value={loading ? '...' : stats.totalDownloads}
            sub="Platform Activity"
            icon="⬇️"
          />
        </div>

        {/* Pending Approvals Table */}
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          border: "1px solid #dce8f0",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#1a3a50", margin: 0 }}>
              Pending Resource Approvals
            </h2>
            <button
              onClick={fetchData}
              style={{
                background: "transparent",
                border: "1px solid #dce8f0",
                color: "#4a90b8",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "0.78rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              🔄 Refresh
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#7a9db5" }}>
              Loading pending resources...
            </div>
          )}

          {/* Empty state */}
          {!loading && pending.length === 0 && (
            <div style={{
              textAlign: "center", padding: "40px",
              color: "#7a9db5", fontSize: "0.875rem",
            }}>
              🎉 All caught up! No pending approvals.
            </div>
          )}

          {/* Pending list */}
          {!loading && pending.map(item => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                background: "#f5f9fc",
                borderRadius: "8px",
                marginBottom: "10px",
                border: "1px solid #e4eef5",
              }}
            >
              {/* File icon */}
              <div style={{
                width: "34px", height: "38px", flexShrink: 0,
                background: "#edf5fa",
                border: "1px solid #c8dce8",
                borderRadius: "6px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem",
              }}>📄</div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a3a50" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#7a9db5" }}>
                  {item.department} • {item.courseCode} • {item.uploadedBy} • {item.timeAgo}
                </div>
              </div>

              {/* File type badge */}
              <span style={{
                background: "#e8f0fb", color: "#3a6ab5",
                borderRadius: "4px", padding: "2px 8px",
                fontSize: "0.68rem", fontWeight: 700, marginRight: "8px",
              }}>
                {item.fileType}
              </span>

              {/* Approve button */}
              <button
                onClick={() => handleApprove(item.id, item.title)}
                style={{
                  background: "#e6f5ee", color: "#2a8a5a",
                  border: "1px solid #a8d9be",
                  borderRadius: "6px", padding: "5px 14px",
                  fontSize: "0.75rem", fontWeight: 600,
                  cursor: "pointer", marginRight: "6px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#c6ebd8'}
                onMouseLeave={e => e.currentTarget.style.background = '#e6f5ee'}
              >
                ✓ Accept
              </button>

              {/* Reject button */}
              <button
                onClick={() => handleReject(item.id, item.title)}
                style={{
                  background: "#fdf0ee", color: "#c0442a",
                  border: "1px solid #f0b8ae",
                  borderRadius: "6px", padding: "5px 14px",
                  fontSize: "0.75rem", fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fad8d2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fdf0ee'}
              >
                ✕ Reject
              </button>
            </div>
          ))}
        </div>

        {/* Recently Approved Section */}
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          border: "1px solid #dce8f0",
          marginTop: "24px",
        }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#1a3a50", margin: "0 0 16px" }}>
            Platform Summary
          </h2>
          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ flex: 1, background: "#f5f9fc", borderRadius: "8px", padding: "16px", border: "1px solid #e4eef5" }}>
              <div style={{ fontSize: "0.75rem", color: "#7a9db5", marginBottom: "8px" }}>Approved Resources</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#2a8a5a" }}>{stats.approvedCount}</div>
              <div style={{ fontSize: "0.7rem", color: "#7a9db5", marginTop: "4px" }}>Visible to students</div>
            </div>
            <div style={{ flex: 1, background: "#f5f9fc", borderRadius: "8px", padding: "16px", border: "1px solid #e4eef5" }}>
              <div style={{ fontSize: "0.75rem", color: "#7a9db5", marginBottom: "8px" }}>Pending Review</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#e8704a" }}>{stats.pendingCount}</div>
              <div style={{ fontSize: "0.7rem", color: "#7a9db5", marginTop: "4px" }}>Awaiting approval</div>
            </div>
            <div style={{ flex: 1, background: "#f5f9fc", borderRadius: "8px", padding: "16px", border: "1px solid #e4eef5" }}>
              <div style={{ fontSize: "0.75rem", color: "#7a9db5", marginBottom: "8px" }}>Total Downloads</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#2e7da8" }}>{stats.totalDownloads}</div>
              <div style={{ fontSize: "0.7rem", color: "#7a9db5", marginTop: "4px" }}>All time</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}