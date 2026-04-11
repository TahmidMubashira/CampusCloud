import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home',         to: '/',          icon: '🏠' },
  { label: 'Resources',    to: '/resources', icon: '📄' },
  { label: 'Upload',       to: '/upload',    icon: '⬆️' },
  { label: 'Rewards',      to: '/rewards',   icon: '🏅' },
  { label: 'Profile',      to: '/profile',   icon: '👤' },
  { label: 'AI Assistant', to: '/assistant', icon: '🤖' },
];

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

function Sidebar({ active }: { active: string }) {
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
          const isActive = active === item.label;
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
    </aside>
  );
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: '👋 Hi! I am your CampusCloud AI Study Assistant powered by Gemini! I can help you with:\n\n• 📚 Study questions on any subject\n• 🔍 Resource recommendations\n• 📝 Understanding course topics\n• 💡 Personalized study suggestions\n\nWhat would you like to know?',
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

      // Build chat history from actual exchanges only (skip welcome message)
      const chatHistory: { role: string; parts: { text: string }[] }[] = [];
      const userMsgs = messages.filter(m => m.role === 'user');
      const assistantMsgs = messages.filter(m => m.role === 'assistant').slice(1);

      userMsgs.forEach((userMsg, i) => {
        chatHistory.push({ role: 'user', parts: [{ text: userMsg.text }] });
        if (assistantMsgs[i]) {
          chatHistory.push({ role: 'model', parts: [{ text: assistantMsgs[i].text }] });
        }
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
                parts: [{ text: 'From now on you are CampusCloud AI Study Assistant for university students. Help with study questions, resource recommendations, explaining academic concepts, and personalized study suggestions. Be friendly, concise, and use emojis occasionally.' }],
              },
              {
                role: 'model',
                parts: [{ text: 'Understood! I am CampusCloud AI Study Assistant, ready to help university students with their academic journey. 📚 How can I help you today?' }],
              },
              ...chatHistory,
              { role: 'user', parts: [{ text: userMessage }] },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error('Gemini API error:', data.error);
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: `❌ API Error: ${data.error.message}`,
        }]);
        return;
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text
        || 'Sorry, I could not generate a response. Please try again.';

      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error) {
      console.error('Network error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '❌ Sorry, something went wrong. Please check your connection and try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    '📚 Recommend resources for Data Structures',
    '💡 How to study for exams effectively?',
    '🔍 Explain Object Oriented Programming',
    '📝 What are the best study techniques?',
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        .chat-input:focus { outline: none; border-color: #2e7da8 !important; box-shadow: 0 0 0 3px rgba(46,125,168,0.09) !important; }
        .send-btn:hover { background: #1a3a50 !important; }
        .suggest-btn:hover { background: #dce8f0 !important; }
      `}</style>

      <Sidebar active="AI Assistant" />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 40px', maxHeight: '100vh', overflow: 'hidden' }}>

        <div style={{ marginBottom: '20px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #2e7da8, #1a3a50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
            }}>🤖</div>
            <div>
              <h1 style={{ fontWeight: 700, fontSize: '1.4rem', color: '#1a3a50', margin: 0 }}>
                AI Study Assistant
              </h1>
              <p style={{ color: '#7a9db5', fontSize: '0.78rem', margin: 0 }}>
                Powered by Google Gemini • Ask anything about your studies
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

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2e7da8, #1a3a50)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', flexShrink: 0, marginRight: '10px', marginTop: '4px',
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? '#1a3a50' : '#f0f4f8',
                  color: msg.role === 'user' ? '#fff' : '#1a3a50',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2e7da8, #1a3a50)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem',
                }}>🤖</div>
                <div style={{
                  padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
                  background: '#f0f4f8', color: '#7a9db5', fontSize: '0.875rem',
                }}>
                  ✨ Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div style={{ padding: '0 24px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  className="suggest-btn"
                  onClick={() => setInput(q.replace(/^[^\s]+ /, ''))}
                  style={{
                    padding: '6px 12px', borderRadius: '20px',
                    border: '1px solid #dce8f0', background: '#f8fbfe',
                    color: '#4a6a80', fontSize: '0.75rem',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div style={{
            padding: '16px 24px', borderTop: '1px solid #dce8f0',
            display: 'flex', gap: '12px', alignItems: 'flex-end',
          }}>
            <textarea
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your studies... (Press Enter to send)"
              rows={1}
              style={{
                flex: 1, padding: '12px 16px',
                border: '1.5px solid #dce8f0', borderRadius: '12px',
                fontSize: '0.875rem', fontFamily: "'Nunito', sans-serif",
                resize: 'none', lineHeight: 1.5,
                color: '#1a3a50', background: '#f8fbfe',
              }}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: '12px 20px', borderRadius: '12px', border: 'none',
                background: loading || !input.trim() ? '#b8cdd9' : '#2e7da8',
                color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontFamily: "'Nunito', sans-serif",
                transition: 'background 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {loading ? '⏳' : '➤'} Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}