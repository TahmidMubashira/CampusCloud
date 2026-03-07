import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';




const inputStyle = {
  background: '#f8fafc',
  border: '1.5px solid #dce8f0',
  borderRadius: '8px',
  color: '#1a3a50',
  fontSize: '0.88rem',
  padding: '10px 14px',
  fontFamily: "'Nunito', sans-serif",
  transition: 'border-color 0.2s',
};

const labelStyle = {
  color: '#4a6a80',
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  marginBottom: '6px',
};

// Login Page 
export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      // Step 1: Get CSRF cookie first
      await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });

      // Step 2: Then login
      const res = await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => { window.location.href = '/'; }, 1500);
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f2f7fb', fontFamily: "'Nunito', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Lora:wght@400;600;700&display=swap');
        .auth-input:focus { border-color: #2e7da8 !important; box-shadow: 0 0 0 3px rgba(46,125,168,0.1) !important; outline: none !important; background: #fff !important; }
        .auth-input::placeholder { color: #a0bece !important; }
        .auth-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .auth-link { color: #2e7da8; font-weight: 700; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #dce8f0', padding: '0.6rem 0', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <Container>
          <a href="/" style={{ fontFamily: "'Lora', serif", fontWeight: 700, color: '#1a3a50', fontSize: '1.35rem', textDecoration: 'none' }}>
            CampusCloud
          </a>
        </Container>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Card */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #dce8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '2.5rem 2rem' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #cfe5f2, #a8d0e8)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>
                🎓
              </div>
              <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 700, color: '#1a3a50', fontSize: '1.5rem', marginBottom: '6px' }}>
                Welcome back
              </h2>
              <p style={{ color: '#7a9db5', fontSize: '0.84rem', margin: 0 }}>
                Sign in to your CampusCloud account
              </p>
            </div>

            {/* Alerts */}
            {error && <Alert variant="danger" style={{ fontSize: '0.82rem', borderRadius: '8px', padding: '10px 14px' }}>{error}</Alert>}
            {success && <Alert variant="success" style={{ fontSize: '0.82rem', borderRadius: '8px', padding: '10px 14px' }}>{success}</Alert>}

            {/* Form */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Email Address</Form.Label>
                <Form.Control
                  className="auth-input"
                  type="email"
                  name="email"
                  placeholder="you@university.edu"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <Form.Label style={{ ...labelStyle, margin: 0 }}>Password</Form.Label>
                  <a href="/forgot-password" className="auth-link" style={{ fontSize: '0.76rem' }}>Forgot password?</a>
                </div>
                <Form.Control
                  className="auth-input"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </Form.Group>

              <Button
                type="submit"
                className="auth-btn"
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2e7da8, #4a9eca)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#fff',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </Button>
            </Form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#dce8f0' }} />
              <span style={{ color: '#a0bece', fontSize: '0.75rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#dce8f0' }} />
            </div>

            {/* Register link */}
            <p style={{ textAlign: 'center', color: '#7a9db5', fontSize: '0.84rem', margin: 0 }}>
              Don't have an account?{' '}
              <a href="/register" className="auth-link">Create one free</a>
            </p>
          </div>

          {/* Footer note */}
          <p style={{ textAlign: 'center', color: '#a0bece', fontSize: '0.74rem', marginTop: '1.25rem' }}>
            For academic use only · CampusCloud © 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// Register Page 
export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.password_confirmation) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      // Step 1: Get CSRF cookie first
      await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });

      // Step 2: Then register
      const res = await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Account created! Redirecting...');
        setTimeout(() => { window.location.href = '/'; }, 1500);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f2f7fb', fontFamily: "'Nunito', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Lora:wght@400;600;700&display=swap');
        .auth-input:focus { border-color: #2e7da8 !important; box-shadow: 0 0 0 3px rgba(46,125,168,0.1) !important; outline: none !important; background: #fff !important; }
        .auth-input::placeholder { color: #a0bece !important; }
        .auth-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .auth-link { color: #2e7da8; font-weight: 700; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }
        .role-card { cursor: pointer; border: 2px solid #dce8f0; border-radius: 10px; padding: 12px; transition: all 0.2s; text-align: center; }
        .role-card:hover { border-color: #2e7da8; background: #f0f8ff; }
        .role-card.selected { border-color: #2e7da8; background: linear-gradient(135deg, #e8f4fb, #d8ecf8); }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #dce8f0', padding: '0.6rem 0', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <Container>
          <a href="/" style={{ fontFamily: "'Lora', serif", fontWeight: 700, color: '#1a3a50', fontSize: '1.35rem', textDecoration: 'none' }}>
            CampusCloud
          </a>
        </Container>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>

          {/* Card */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #dce8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '2.5rem 2rem' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #cfe5f2, #a8d0e8)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>
                📚
              </div>
              <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 700, color: '#1a3a50', fontSize: '1.5rem', marginBottom: '6px' }}>
                Create account
              </h2>
              <p style={{ color: '#7a9db5', fontSize: '0.84rem', margin: 0 }}>
                Join CampusCloud and start sharing resources
              </p>
            </div>

            {/* Alerts */}
            {error && <Alert variant="danger" style={{ fontSize: '0.82rem', borderRadius: '8px', padding: '10px 14px' }}>{error}</Alert>}
            {success && <Alert variant="success" style={{ fontSize: '0.82rem', borderRadius: '8px', padding: '10px 14px' }}>{success}</Alert>}

            {/* Role selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ ...labelStyle, marginBottom: '10px' }}>I am a</p>
              <Row className="g-2">
                {[
                  { value: 'student', label: 'Student', icon: '🎓' },
                  { value: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
                ].map(r => (
                  <Col xs={6} key={r.value}>
                    <div
                      className={`role-card ${form.role === r.value ? 'selected' : ''}`}
                      onClick={() => setForm({ ...form, role: r.value })}
                    >
                      <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{r.icon}</div>
                      <div style={{ color: form.role === r.value ? '#2e7da8' : '#4a6a80', fontWeight: 700, fontSize: '0.84rem' }}>{r.label}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Form */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Full Name</Form.Label>
                <Form.Control
                  className="auth-input"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Email Address</Form.Label>
                <Form.Control
                  className="auth-input"
                  type="email"
                  name="email"
                  placeholder="you@university.edu"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </Form.Group>

              <Row className="g-2 mb-4">
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Password</Form.Label>
                    <Form.Control
                      className="auth-input"
                      type="password"
                      name="password"
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Confirm</Form.Label>
                    <Form.Control
                      className="auth-input"
                      type="password"
                      name="password_confirmation"
                      placeholder="Repeat password"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                className="auth-btn"
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2e7da8, #4a9eca)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#fff',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? 'Creating account...' : 'Create Account →'}
              </Button>
            </Form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#dce8f0' }} />
              <span style={{ color: '#a0bece', fontSize: '0.75rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#dce8f0' }} />
            </div>

            {/* Login link */}
            <p style={{ textAlign: 'center', color: '#7a9db5', fontSize: '0.84rem', margin: 0 }}>
              Already have an account?{' '}
              <a href="/login" className="auth-link">Sign in</a>
            </p>
          </div>

          {/* Footer note */}
          <p style={{ textAlign: 'center', color: '#a0bece', fontSize: '0.74rem', marginTop: '1.25rem' }}>
            For academic use only · CampusCloud © 2026
          </p>
        </div>
      </div>
    </div>
  );
}