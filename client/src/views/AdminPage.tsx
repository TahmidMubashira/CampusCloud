import { Link } from "react-router-dom";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", to: "/", icon: "🏠" },
  { label: "Resources", to: "/resources", icon: "📄" },
  { label: "Profile", to: "/admin", icon: "👤" },
];

const INITIAL_PENDING = [
  { id: 1, title: "Introduction To Data Structures", subject: "Computer Science", uploader: "Sarah Johnson", timeAgo: "2 hours ago", fileType: "PDF" },
  { id: 2, title: "Organic Chemistry", subject: "Chemistry", uploader: "Mike Smith", timeAgo: "4 hours ago", fileType: "PDF" },
  { id: 3, title: "Calculus Solution", subject: "Mathematics", uploader: "Emily Davis", timeAgo: "30 minutes ago", fileType: "PDF" },
];

function AdminSidebar({ active }: { active: string }) {
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
        <div style={{ fontSize: "0.7rem", color: "#6a8fa8" }}>Resource Sharing</div>
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
        }}>AU</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "#1a3a50" }}>Admin User</div>
          <div style={{ fontSize: "0.68rem", color: "#6a8fa8" }}>admin@uni.edu</div>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub: string; icon: string }) {
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
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleApprove = (id: number, title: string) => {
    setPending(p => p.filter(r => r.id !== id));
    showToast(`✅ "${title}" approved`);
  };

  const handleReject = (id: number, title: string) => {
    setPending(p => p.filter(r => r.id !== id));
    showToast(`❌ "${title}" rejected`);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>
      <AdminSidebar active="Profile" />

      <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto", position: "relative" }}>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", top: "24px", right: "24px", zIndex: 9999,
            background: "#1a3a50", color: "#fff",
            padding: "12px 20px", borderRadius: "8px",
            fontSize: "0.85rem", fontWeight: 500,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}>{toast}</div>
        )}

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontWeight: 700, fontSize: "1.6rem", color: "#1a3a50", margin: 0 }}>
            Welcome back, Admin
          </h1>
          <p style={{ color: "#7a9db5", fontSize: "0.85rem", margin: "4px 0 0" }}>
            Here is an overview of platform moderation
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <StatCard
            label="Pending Approvals"
            value={pending.length}
            sub="Requires Attention"
            icon="🕐"
          />
          <StatCard
            label="Total Downloads"
            value={688}
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
            <span style={{ fontSize: "0.78rem", color: "#4a90b8", fontWeight: 500 }}>
              View All
            </span>
          </div>

          {pending.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "40px",
              color: "#7a9db5", fontSize: "0.875rem",
            }}>
              🎉 All caught up! No pending approvals.
            </div>
          ) : (
            pending.map(item => (
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
                <div style={{
                  width: "34px", height: "38px", flexShrink: 0,
                  background: "#edf5fa",
                  border: "1px solid #c8dce8",
                  borderRadius: "6px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem",
                }}>📄</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a3a50" }}>{item.title}</div>
                  <div style={{ fontSize: "0.72rem", color: "#7a9db5" }}>
                    {item.subject} • {item.uploader} • {item.timeAgo}
                  </div>
                </div>

                <span style={{
                  background: "#e8f0fb", color: "#3a6ab5",
                  borderRadius: "4px", padding: "2px 8px",
                  fontSize: "0.68rem", fontWeight: 700, marginRight: "8px",
                }}>{item.fileType}</span>

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
                >✓ Accept</button>

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
                >✕ Reject</button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}