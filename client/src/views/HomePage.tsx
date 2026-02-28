import { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Nav, Navbar, NavDropdown } from 'react-bootstrap';


interface Resource {
  id: number;
  title: string;
  subject: string;
  fileType: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
}


const RESOURCES: Resource[] = [
  { id: 1, title: 'Introduction to Data Structures', subject: 'Computer Science', fileType: 'PDF', category: 'Lecture Notes', uploadedBy: 'Tahmid', uploadedAt: '2026-02-20', downloads: 142 },
  { id: 2, title: 'Algorithm & Complexity notes', subject: 'Computer Science', fileType: 'PDF', category: 'Lecture Notes', uploadedBy: 'Mubashira', uploadedAt: '2026-02-18', downloads: 98 },
  { id: 3, title: 'Database notes', subject: 'Computer Science', fileType: 'PDF', category: 'Lecture Notes', uploadedBy: 'Rafi', uploadedAt: '2026-02-15', downloads: 211 },
  { id: 4, title: 'Introduction to Data Structures', subject: 'Computer Science', fileType: 'PDF', category: 'Past Papers', uploadedBy: 'Nadia', uploadedAt: '2026-02-10', downloads: 87 },
  { id: 5, title: 'Introduction to Data Structures', subject: 'Computer Science', fileType: 'PDF', category: 'Past Papers', uploadedBy: 'Arif', uploadedAt: '2026-02-08', downloads: 63 },
  { id: 6, title: 'Introduction to Data Structures', subject: 'Computer Science', fileType: 'PDF', category: 'Books', uploadedBy: 'Sumaiya', uploadedAt: '2026-01-30', downloads: 311 },
];

const CATEGORIES = ['All', 'Lecture Notes', 'Past Papers', 'Assignments', 'Books', 'Lab Reports'];


function ResourceCard({ resource }: { resource: Resource }) {
  const [hovered, setHovered] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#90b8d0' : '#dce8f0'}`,
        borderRadius: '10px',
        padding: '1rem',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? '0 4px 14px rgba(80,140,180,0.13)' : '0 1px 4px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        
        <div style={{
          width: '36px',
          height: '44px',
          flexShrink: 0,
          background: '#edf5fa',
          borderRadius: '6px',
          border: '1px solid #c8dce8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
            <rect x="1" y="1" width="16" height="20" rx="2" fill="#e0eef6" stroke="#90b8d0" strokeWidth="1.2"/>
            <path d="M4 7h10M4 11h10M4 15h6" stroke="#5a8ea8" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M11 1v4h4" fill="none" stroke="#90b8d0" strokeWidth="1"/>
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <h6 style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: '0.87rem',
            color: '#1e3a50',
            marginBottom: '4px',
            lineHeight: 1.35,
          }}>
            {resource.title}
          </h6>
          <p style={{ color: '#7a9db5', fontSize: '0.74rem', margin: 0, fontWeight: 500 }}>
            {resource.subject}
          </p>
        </div>
      </div>

      
      <div style={{ flex: 1 }} />

      
      <div style={{ marginTop: '0.5rem' }}>
        <span style={{
          display: 'inline-block',
          background: '#edf5fa',
          color: '#3a7a9e',
          border: '1px solid #b8d4e4',
          borderRadius: '5px',
          padding: '2px 9px',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}>
          {resource.fileType}
        </span>
      </div>
    </div>
  );
}

// Main HomePage 
export default function HomePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = RESOURCES.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || r.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f2f7fb', fontFamily: "'Nunito', sans-serif" }}>

      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Lora:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        body { background: #f2f7fb !important; margin: 0; }
        .cc-nav-link { color: #4a6a80 !important; font-size: 0.84rem !important; font-weight: 600 !important; font-family: 'Nunito', sans-serif !important; }
        .cc-nav-link:hover { color: #1a3a50 !important; }
        .cc-dropdown-toggle { color: #4a6a80 !important; font-size: 0.84rem !important; font-weight: 600 !important; }
        .cc-dropdown-toggle::after { margin-left: 5px; }
        .dropdown-menu { border: 1px solid #dce8f0 !important; border-radius: 8px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; min-width: 160px !important; }
        .dropdown-item { font-size: 0.82rem !important; color: #4a6a80 !important; padding: 7px 16px !important; }
        .dropdown-item:hover { background: #f0f6fa !important; color: #1a3a50 !important; }
        .search-ctrl::placeholder { color: #9ab8ca !important; }
        .search-ctrl:focus { box-shadow: none !important; border-color: #7ab0cc !important; }
        .cat-pill { cursor: pointer; transition: all 0.2s; border: 1.5px solid #c8dce8; border-radius: 20px; padding: 5px 15px; font-size: 0.78rem; font-weight: 600; font-family: 'Nunito', sans-serif; }
        .cat-pill.active { background: linear-gradient(135deg,#2e7da8,#4a9eca) !important; color: #fff !important; border-color: transparent !important; box-shadow: 0 3px 10px rgba(46,125,168,0.22); }
        .cat-pill:not(.active) { background: #fff; color: #4a6a80; }
        .cat-pill:not(.active):hover { background: #edf5fa !important; color: #1a3a50 !important; }
      `}</style>

      
      <Navbar expand="md" style={{
        background: '#fff',
        borderBottom: '1px solid #dce8f0',
        padding: '0.55rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}>
        <Container>
          <Navbar.Toggle style={{ border: '1px solid #dce8f0', padding: '4px 8px' }} />

          <Navbar.Brand href="/" style={{
            fontFamily: "'Lora', serif",
            fontWeight: 700,
            color: '#1a3a50',
            fontSize: '1.35rem',
            marginLeft: '6px',
          }}>
            CampusCloud
          </Navbar.Brand>

          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center gap-1">
              <NavDropdown title="Resources" id="res-dd" className="cc-dropdown-toggle">
                {['Lecture Notes', 'Past Papers', 'Assignments', 'Books', 'Lab Reports'].map(c => (
                  <NavDropdown.Item key={c} onClick={() => { setActiveCategory(c); }}>{c}</NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => setActiveCategory('All')}>All Resources</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Admin" id="admin-dd" className="cc-dropdown-toggle">
                <NavDropdown.Item href="/admin/login">Admin Login</NavDropdown.Item>
                <NavDropdown.Item href="/admin/dashboard">Dashboard</NavDropdown.Item>
              </NavDropdown>

              <Button variant="outline-secondary" size="sm" style={{
                borderColor: '#a8c4d4',
                color: '#4a6a80',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: '0.82rem',
                borderRadius: '7px',
                padding: '5px 18px',
                marginLeft: '6px',
              }}>
                Login
              </Button>

              <Button size="sm" style={{
                background: 'linear-gradient(135deg, #2e7da8, #4a9eca)',
                border: 'none',
                color: '#fff',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: '0.82rem',
                borderRadius: '7px',
                padding: '5px 18px',
                marginLeft: '4px',
              }}>
                Register
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      
      <div style={{
        background: 'linear-gradient(135deg, #cfe5f2 0%, #dff0f8 40%, #c8dff0 100%)',
        borderBottom: '1px solid #b8d4e4',
        padding: '2.8rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(100,160,200,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '8%', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(80,140,180,0.06)', pointerEvents: 'none' }} />

        <Container>
          <Row className="align-items-center">
            
            <Col md={5}>
              <h1 style={{
                fontFamily: "'Lora', serif",
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                color: '#1a3a50',
                lineHeight: 1.35,
                marginBottom: '1.5rem',
              }}>
                Find and share the best study materials.
              </h1>

              <InputGroup style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 3px 14px rgba(0,0,0,0.1)' }}>
                <InputGroup.Text style={{
                  background: '#fff',
                  border: '1.5px solid #a8c4d4',
                  borderRight: 'none',
                  color: '#8ab4cc',
                  paddingLeft: '13px',
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </InputGroup.Text>
                <Form.Control
                  className="search-ctrl"
                  placeholder="Search for study materials"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    border: '1.5px solid #a8c4d4',
                    borderLeft: 'none',
                    borderRight: 'none',
                    color: '#1e3a50',
                    fontSize: '0.87rem',
                    padding: '10px 10px',
                    background: '#fff',
                    fontFamily: "'Nunito', sans-serif",
                  }}
                />
                <Button style={{
                  background: 'linear-gradient(135deg, #2e7da8, #4a9eca)',
                  border: 'none',
                  color: '#fff',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.87rem',
                  padding: '10px 22px',
                }}>
                  Find
                </Button>
              </InputGroup>
            </Col>

            
            <Col md={7} className="mt-4 mt-md-0" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                background: 'linear-gradient(135deg, #b8d4e4 0%, #cce4f0 100%)',
                borderRadius: '16px',
                border: '1px solid #a0c4d8',
                width: '100%',
                maxWidth: '400px',
                minHeight: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(46,100,140,0.12)',
              }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '3.5rem' }}>💻</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
                    {['📗', '📘', '📙', '📕', '📔'].map((b, i) => (
                      <span key={i} style={{ fontSize: `${1.9 - i * 0.1}rem`, transform: `rotate(${(i - 2) * 4}deg)` }}>{b}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['📄', '📋', '🗒️'].map((n, i) => (
                      <span key={i} style={{ fontSize: '1.25rem' }}>{n}</span>
                    ))}
                  </div>
                </div>

                
                <div style={{
                  position: 'absolute', top: '12px', right: '14px',
                  background: '#fff', borderRadius: '7px', padding: '4px 10px',
                  fontSize: '0.67rem', fontWeight: 700, color: '#2e7da8',
                  border: '1px solid #a8c4d4', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  📚 800+ Resources
                </div>

                
                <div style={{
                  position: 'absolute', bottom: '12px', left: '14px',
                  background: '#fff', borderRadius: '7px', padding: '4px 10px',
                  fontSize: '0.67rem', fontWeight: 700, color: '#3a8a5e',
                  border: '1px solid #b8d8c8', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  ✅ Approved Only
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      
      <Container style={{ padding: '2.5rem 1rem 3.5rem' }}>

        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontFamily: "'Lora', serif",
            fontWeight: 700,
            fontSize: '1.45rem',
            color: '#1a3a50',
            marginBottom: '0.35rem',
          }}>
            Browse new study materials
          </h2>
          <p style={{ color: '#7a9db5', fontSize: '0.83rem', margin: 0 }}>
            Explore our collection to discover the perfect study notes for you
          </p>
        </div>

        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <p style={{ color: '#7a9db5', fontSize: '0.78rem', margin: 0 }}>
            Showing <strong style={{ color: '#2e7da8' }}>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''}
          </p>
          {(search || activeCategory !== 'All') && (
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }}
              style={{ background: 'none', border: 'none', color: '#2e7da8', fontSize: '0.76rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Nunito', sans-serif" }}>
              Clear filters
            </button>
          )}
        </div>

        
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#7a9db5' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontSize: '0.9rem' }}>No resources found.</p>
          </div>
        ) : (
          <Row className="g-3">
            {filtered.map(r => (
              <Col key={r.id} xs={12} sm={6} md={4}>
                <ResourceCard resource={r} />
              </Col>
            ))}
          </Row>
        )}

        
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Button style={{
            background: 'linear-gradient(135deg, #2e7da8, #4a9eca)',
            border: 'none',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: '0.85rem',
            borderRadius: '8px',
            padding: '10px 30px',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(46,125,168,0.28)',
          }}>
            View All Resources →
          </Button>
        </div>
      </Container>

      
      <footer style={{
        background: '#cce0ed',
        borderTop: '1px solid #b0ccdc',
        padding: '1.4rem 0',
        textAlign: 'center',
      }}>
        <p style={{
          color: '#4a6a80',
          fontSize: '0.82rem',
          fontFamily: "'Nunito', sans-serif",
          margin: 0,
          fontWeight: 600,
        }}>
          © 2026 CampusCloud. All rights reserved. For academic use only.
        </p>
      </footer>

    </div>
  );
}