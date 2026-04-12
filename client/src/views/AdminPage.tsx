import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { label: "Home",         to: "/",          icon: "🏠" },
  { label: "Resources",    to: "/resources", icon: "📄" },
  { label: "Dashboard",    to: "/admin",     icon: "⚙️" },
  { label: "AI Assistant", to: "/admin/ai",  icon: "🤖" },
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

interface Message {
  role: 'user' | 'assistant';
  text: string;
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
  label: string; value: string | number; sub: string; icon: string;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: "10px", padding: "18px 20px",
      flex: 1, border: "1px solid #dce8f0",
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
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

// ── Admin AI Assistant Component ──────────────────────────────────────────────
function AdminAiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: '👋 Hi Admin! I am your CampusCloud AI Assistant powered by Gemini! I can help you with:\n\n• 📊 Platform moderation decisions\n• 🔍 Resource quality evaluation\n• 📈 Engagement analytics insights\n• 💡 Best practices for content approval\n\nWhat would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const chatHistory: { role: string; parts: { text: string }[] }[] = [];
      const userMsgs = messages.filter(m => m.role === 'user');
      const assistantMsgs = messages.filter(m => m.role === 'assistant').slice(1);
      userMsgs.forEach((userMsg, i) => {
        chatHistory.push({ role: 'user', parts: [{ text: userMsg.text }] });
        if (assistantMsgs[i]) chatHistory.push({ role: 'model', parts: [{ text: assistantMsgs[i].text }] });
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: 'You are CampusCloud AI Assistant for university platform administrators. Help with resource quality evaluation, content moderation decisions, engagement analytics, identifying high-quality academic resources, and platform management best practices. Be professional, concise, and data-driven.' }],
              },
              {
                role: 'model',
                parts: [{ text: 'Understood! I am CampusCloud Admin AI Assistant, ready to help with platform moderation and analytics. How can I assist you?' }],
              },
              ...chatHistory,
              { role: 'user', parts: [{ text: userMessage }] },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', text: `❌ API Error: ${data.error.message}` }]);
        return;
      }
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Something went wrong. Please check your connection.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const suggestedQuestions = [
    '📊 What makes a high quality academic resource?',
    '🔍 How to evaluate if a resource should be approved?',
    '📈 How can I improve student engagement on the platform?',
    '💡 What are best practices for content moderation?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <style>{`
        .admin-chat-input:focus { outline: none; border-color: #2e7da8 !important; }
        .admin-send-btn:hover:not(:disabled) { background: #1a3a50 !important; }
        .admin-suggest-btn:hover { background: #dce8f0 !important; }
      `}</style>

      <div style={{ marginBottom: '16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #2e7da8, #1a3a50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', flexShrink: 0,
          }}>🤖</div>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#1a3a50', margin: 0 }}>
              AI Admin Assistant
            </h1>
            <p style={{ color: '#7a9db5', fontSize: '0.75rem', margin: 0 }}>
              Powered by Google Gemini • Platform moderation & analytics support
            </p>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1, background: '#fff', borderRadius: '14px',
        border: '1px solid #dce8f0', display: 'flex',
        flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2e7da8, #1a3a50)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', flexShrink: 0, marginRight: '8px', marginTop: '4px',
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: '75%', padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? '#1a3a50' : '#f0f4f8',
                color: msg.role === 'user' ? '#fff' : '#1a3a50',
                fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2e7da8, #1a3a50)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem',
              }}>🤖</div>
              <div style={{ padding: '10px 14px', borderRadius: '18px 18px 18px 4px', background: '#f0f4f8', color: '#7a9db5', fontSize: '0.85rem' }}>
                ✨ Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div style={{ padding: '0 16px 12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                className="admin-suggest-btn"
                onClick={() => setInput(q.replace(/^[^\s]+ /, ''))}
                style={{
                  padding: '5px 10px', borderRadius: '16px',
                  border: '1px solid #dce8f0', background: '#f8fbfe',
                  color: '#4a6a80', fontSize: '0.72rem',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding: '12px 16px', borderTop: '1px solid #dce8f0', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            className="admin-chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about moderation, resource quality, analytics... (Enter to send)"
            rows={1}
            style={{
              flex: 1, padding: '10px 14px',
              border: '1.5px solid #dce8f0', borderRadius: '10px',
              fontSize: '0.85rem', fontFamily: 'inherit',
              resize: 'none', lineHeight: 1.5,
              color: '#1a3a50', background: '#f8fbfe',
            }}
          />
          <button
            className="admin-send-btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '10px 18px', borderRadius: '10px', border: 'none',
              background: loading || !input.trim() ? '#b8cdd9' : '#2e7da8',
              color: '#fff', fontWeight: 700, fontSize: '0.85rem',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            {loading ? '⏳' : '➤'} Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [pending, setPending] = useState<PendingResource[]>([]);
  const [stats, setStats] = useState<Stats>({ totalDownloads: 0, pendingCount: 0, approvedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'ai'>('dashboard');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role !== 'admin') { navigate('/'); return; }
      setAdmin(user);
    } else {
      navigate('/admin/login'); return;
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (window.location.pathname === '/admin/ai') {
      setCurrentView('ai');
    } else {
      setCurrentView('dashboard');
    }
  }, [window.location.pathname]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }),
        fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/admin/pending`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }),
      ]);
      const statsData = await statsRes.json();
      const pendingData = await pendingRes.json();
      if (statsData.success) setStats(statsData);
      if (pendingData.success) setPending(pendingData.resources);
    } catch {
      showToast('⚠️ Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, title: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/admin/approve/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setPending(p => p.filter(r => r.id !== id));
        setStats(s => ({ ...s, pendingCount: s.pendingCount - 1, approvedCount: s.approvedCount + 1 }));
        showToast(`✅ "${title}" approved`);
      } else { showToast('⚠️ Failed to approve resource'); }
    } catch { showToast('⚠️ Network error'); }
  };

  const handleReject = async (id: number, title: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/admin/reject/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setPending(p => p.filter(r => r.id !== id));
        setStats(s => ({ ...s, pendingCount: s.pendingCount - 1 }));
        showToast(`❌ "${title}" rejected`);
      } else { showToast('⚠️ Failed to reject resource'); }
    } catch { showToast('⚠️ Network error'); }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/admin/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch { console.error('Logout error'); }
    finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/login');
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>
      <AdminSidebar active={currentView === 'ai' ? 'AI Assistant' : 'Dashboard'} admin={admin} />

      <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto", position: "relative" }}>

        {toast && (
          <div style={{
            position: "fixed", top: "24px", right: "24px", zIndex: 9999,
            background: "#1a3a50", color: "#fff",
            padding: "12px 20px", borderRadius: "8px",
            fontSize: "0.85rem", fontWeight: 500,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}>{toast}</div>
        )}

        {currentView === 'ai' ? (
          <AdminAiAssistant />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
              <div>
                <h1 style={{ fontWeight: 700, fontSize: "1.6rem", color: "#1a3a50", margin: 0 }}>
                  Welcome back, {admin?.name || 'Admin'}
                </h1>
                <p style={{ color: "#7a9db5", fontSize: "0.85rem", margin: "4px 0 0" }}>
                  Here is an overview of platform moderation
                </p>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: "#fee2e2", border: "1.5px solid #fca5a5",
                  color: "#dc2626", padding: "8px 20px", borderRadius: "8px",
                  fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
              <StatCard label="Pending Approvals" value={loading ? '...' : stats.pendingCount} sub="Requires Attention" icon="🕐" />
              <StatCard label="Approved Resources" value={loading ? '...' : stats.approvedCount} sub="Live on platform" icon="✅" />
              <StatCard label="Total Downloads" value={loading ? '...' : stats.totalDownloads} sub="Platform Activity" icon="⬇️" />
            </div>

            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #dce8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#1a3a50", margin: 0 }}>
                  Pending Resource Approvals
                </h2>
                <button onClick={fetchData} style={{ background: "transparent", border: "1px solid #dce8f0", color: "#4a90b8", padding: "4px 12px", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", fontWeight: 500 }}>
                  🔄 Refresh
                </button>
              </div>

              {loading && <div style={{ textAlign: "center", padding: "40px", color: "#7a9db5" }}>Loading...</div>}
              {!loading && pending.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: "#7a9db5", fontSize: "0.875rem" }}>
                  🎉 All caught up! No pending approvals.
                </div>
              )}
              {!loading && pending.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", background: "#f5f9fc", borderRadius: "8px", marginBottom: "10px", border: "1px solid #e4eef5" }}>
                  <div style={{ width: "34px", height: "38px", flexShrink: 0, background: "#edf5fa", border: "1px solid #c8dce8", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a3a50" }}>{item.title}</div>
                    <div style={{ fontSize: "0.72rem", color: "#7a9db5" }}>{item.department} • {item.courseCode} • {item.uploadedBy} • {item.timeAgo}</div>
                  </div>
                  <span style={{ background: "#e8f0fb", color: "#3a6ab5", borderRadius: "4px", padding: "2px 8px", fontSize: "0.68rem", fontWeight: 700, marginRight: "8px" }}>{item.fileType}</span>
                  <button onClick={() => handleApprove(item.id, item.title)} style={{ background: "#e6f5ee", color: "#2a8a5a", border: "1px solid #a8d9be", borderRadius: "6px", padding: "5px 14px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", marginRight: "6px" }}
                    onMouseEnter={e => e.currentTarget.style.background = '#c6ebd8'}
                    onMouseLeave={e => e.currentTarget.style.background = '#e6f5ee'}>
                    ✓ Accept
                  </button>
                  <button onClick={() => handleReject(item.id, item.title)} style={{ background: "#fdf0ee", color: "#c0442a", border: "1px solid #f0b8ae", borderRadius: "6px", padding: "5px 14px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fad8d2'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fdf0ee'}>
                    ✕ Reject
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #dce8f0", marginTop: "24px" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#1a3a50", margin: "0 0 16px" }}>Platform Summary</h2>
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
          </>
        )}
      </main>
    </div>
  );
}