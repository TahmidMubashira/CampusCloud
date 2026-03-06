import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Home", to: "/", icon: "🏠" },
  { label: "Resources", to: "/resources", icon: "📄" },
  { label: "Upload", to: "/upload", icon: "⬆️" },
  { label: "Rewards", to: "/rewards", icon: "🏅" },
  { label: "Profile", to: "/profile", icon: "👤" },
];

const RECENT_UPLOADS = [
  { id: 1, title: "Introduction to Data Structures", subject: "Computer Science", fileType: "PDF", timeAgo: "5 days ago", downloads: 35 },
  { id: 2, title: "Calculus 2 notes", subject: "Mathematics", fileType: "DOCX", timeAgo: "1 week ago", downloads: 22 },
  { id: 3, title: "Database notes", subject: "Computer Science", fileType: "PDF", timeAgo: "2 weeks ago", downloads: 60 },
];

function Sidebar({ active }: { active: string }) {
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
          background: "#8aafc5",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 700, fontSize: "0.85rem",
        }}>SU</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "#1a3a50" }}>Student User</div>
          <div style={{ fontSize: "0.68rem", color: "#6a8fa8" }}>student@uni.edu</div>
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
        <div style={{ fontSize: "0.68rem", color: "#7a9db5", marginTop: "4px" }}>{sub}</div>
      </div>
      <span style={{ fontSize: "1.3rem" }}>{icon}</span>
    </div>
  );
}

function UploadRow({ item }: { item: typeof RECENT_UPLOADS[0] }) {
  const badgeColor = item.fileType === "PDF" ? "#e8f0fb" : "#e8f5f0";
  const badgeText = item.fileType === "PDF" ? "#3a6ab5" : "#2a8a5a";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "14px 16px",
      background: "#f5f9fc",
      borderRadius: "8px",
      marginBottom: "10px",
      border: "1px solid #e4eef5",
    }}>
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
        <div style={{ fontSize: "0.72rem", color: "#7a9db5" }}>{item.subject}</div>
        <div style={{ display: "flex", gap: "14px", marginTop: "4px" }}>
          <span style={{ fontSize: "0.68rem", color: "#9ab5c5" }}>🕐 {item.timeAgo}</span>
          <span style={{ fontSize: "0.68rem", color: "#9ab5c5" }}>⬇️ {item.downloads} downloads</span>
        </div>
      </div>

      <span style={{
        background: badgeColor,
        color: badgeText,
        borderRadius: "4px",
        padding: "2px 8px",
        fontSize: "0.68rem",
        fontWeight: 700,
      }}>{item.fileType}</span>
    </div>
  );
}

export default function StudentProfile() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>
      <Sidebar active="Profile" />

      <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: "1.6rem", color: "#1a3a50", margin: 0 }}>
              Welcome back, Student
            </h1>
            <p style={{ color: "#7a9db5", fontSize: "0.85rem", margin: "4px 0 0" }}>
              Here is an overview of your academic contribution
            </p>
          </div>

          <Link to="/upload" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#4a90b8", color: "#fff",
            padding: "10px 18px", borderRadius: "8px",
            textDecoration: "none", fontWeight: 600, fontSize: "0.85rem",
            boxShadow: "0 2px 8px rgba(74,144,184,0.25)",
          }}>
            ⬆️ Upload New Resources
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <StatCard label="Total Contribution Points" value={110} sub="Keep sharing to earn more!" icon="🏅" />
          <StatCard label="Resources Uploaded" value={5} sub="Total files shared" icon="📄" />
          <StatCard label="Total Downloads" value={110} sub="Your impact on peers" icon="⬇️" />
        </div>

        {/* Recent Uploads */}
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          border: "1px solid #dce8f0",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#1a3a50", margin: 0 }}>
              Your Recent Uploads
            </h2>
            <Link to="/resources" style={{ fontSize: "0.78rem", color: "#4a90b8", textDecoration: "none", fontWeight: 500 }}>
              View All
            </Link>
          </div>

          {RECENT_UPLOADS.map(item => (
            <UploadRow key={item.id} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}