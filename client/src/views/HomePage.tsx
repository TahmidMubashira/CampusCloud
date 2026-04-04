import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

interface Resource {
  id: number;
  title: string;
  description: string;
  department: string;
  department_id: number;
  courseCode: string;
  course_id: number;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
}

interface Department {
  department_id: number;
  department_name: string;
}

interface Course {
  course_id: number;
  course_name: string;
  course_code: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const RESOURCE_TYPES = ['All', 'Lecture Notes', 'Past Papers', 'Assignments', 'Books', 'Lab Reports'];
const FILE_TYPES = ['PDF', 'DOCX', 'XLSX', 'PPTX', 'ZIP', 'MP4', 'JPG'];

function ResourceCard({ resource, onDownload }: { resource: Resource; onDownload: (id: number) => void }) {
  const [hovered, setHovered] = useState(false);
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
      {/* File icon + title */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{
          width: '36px', height: '44px', flexShrink: 0,
          background: '#edf5fa', borderRadius: '6px', border: '1px solid #c8dce8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
            <rect x="1" y="1" width="16" height="20" rx="2" fill="#e0eef6" stroke="#90b8d0" strokeWidth="1.2"/>
            <path d="M4 7h10M4 11h10M4 15h6" stroke="#5a8ea8" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M11 1v4h4" fill="none" stroke="#90b8d0" strokeWidth="1"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <h6 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.87rem', color: '#1e3a50', marginBottom: '4px', lineHeight: 1.35 }}>
            {resource.title}
          </h6>
          <p style={{ color: '#7a9db5', fontSize: '0.74rem', margin: 0, fontWeight: 500 }}>
            {resource.department} • {resource.courseCode}
          </p>
          <p style={{ color: '#a0bece', fontSize: '0.7rem', margin: '3px 0 0' }}>
            By {resource.uploadedBy}
          </p>
        </div>
      </div>

      {/* Description */}
      <p style={{
        color: '#7a9db5', fontSize: '0.75rem', margin: '0 0 0.75rem', lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
      }}>
        {resource.description}
      </p>

      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{
            background: '#edf5fa', color: '#3a7a9e',
            border: '1px solid #b8d4e4', borderRadius: '5px', padding: '2px 8px',
            fontSize: '0.68rem', fontWeight: 700,
          }}>
            {resource.fileType}
          </span>
          {resource.fileSize && (
            <span style={{
              background: '#f0f6fa', color: '#7a9db5',
              border: '1px solid #dce8f0', borderRadius: '5px', padding: '2px 8px',
              fontSize: '0.68rem', fontWeight: 600,
            }}>
              {resource.fileSize}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#a0bece', fontSize: '0.7rem' }}>⬇️ {resource.downloads}</span>
          <button
            onClick={e => { e.stopPropagation(); onDownload(resource.id); }}
            style={{
              background: 'transparent', border: '1px solid #2e7da8',
              color: '#2e7da8', borderRadius: '5px', padding: '2px 10px',
              fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif", transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2e7da8'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2e7da8'; }}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourceSkeleton() {
  return (
    <div style={{ background: '#fff', border: '1px solid #dce8f0', borderRadius: '10px', padding: '1rem', height: '160px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
        <div className="skeleton" style={{ width: '36px', height: '44px', borderRadius: '6px', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: '12px', borderRadius: '4px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ height: '10px', borderRadius: '4px', width: '60%' }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: '10px', borderRadius: '4px', marginBottom: '6px' }} />
      <div className="skeleton" style={{ height: '10px', borderRadius: '4px', width: '80%' }} />
    </div>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');

  // All data fetched once — CSR
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch all resources + departments ONCE on mount (CSR)
  useEffect(() => {
    Promise.all([
      fetch('/api/resources').then(r => r.json()),
      fetch('/api/departments').then(r => r.json()),
    ])
      .then(([resourceData, departmentData]) => {
        setAllResources(Array.isArray(resourceData) ? resourceData : []);
        setDepartments(Array.isArray(departmentData) ? departmentData : []);
      })
      .catch(() => setError('Could not connect to server.'))
      .finally(() => setLoading(false));
  }, []);

  // Fetch courses for selected department only
  useEffect(() => {
    if (selectedDepartment) {
      fetch(`/api/courses/${selectedDepartment}`)
        .then(r => r.json())
        .then(data => setCourses(Array.isArray(data) ? data : []));
    } else {
      setCourses([]);
    }
    setSelectedCourse('');
  }, [selectedDepartment]);

  // Logout handler
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch {
      console.error('Logout error');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoggingOut(false);
      navigate('/');
    }
  };

  // Download handler
  const handleDownload = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/download/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      alert('Download failed. Please try again.');
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── CSR filtering — pure in-memory, no API calls on filter change ──────────
  const filteredResources = allResources.filter(resource => {
    const matchesSearch =
      search === '' ||
      resource.title.toLowerCase().includes(search.toLowerCase()) ||
      (resource.description || '').toLowerCase().includes(search.toLowerCase()) ||
      resource.department.toLowerCase().includes(search.toLowerCase()) ||
      resource.courseCode.toLowerCase().includes(search.toLowerCase());

    // Resource type pill filter
    const matchesType =
      activeType === 'All' ||
      resource.fileType === activeType;

    // JOIN on department_id
    const matchesDepartment =
      selectedDepartment === '' ||
      String(resource.department_id) === String(selectedDepartment);

    // JOIN on course_id
    const matchesCourse =
      selectedCourse === '' ||
      String(resource.course_id) === String(selectedCourse);

    // File type dropdown filter
    const matchesFileType =
      selectedFileType === '' ||
      resource.fileType === selectedFileType;

    return matchesSearch && matchesType && matchesDepartment && matchesCourse && matchesFileType;
  });

  const hasActiveFilters = search || activeType !== 'All' || selectedDepartment || selectedCourse || selectedFileType;

  const clearFilters = () => {
    setSearch('');
    setActiveType('All');
    setSelectedDepartment('');
    setSelectedCourse('');
    setSelectedFileType('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f2f7fb', fontFamily: "'Nunito', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Lora:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        body { background: #f2f7fb !important; margin: 0; }
        .cc-dropdown-toggle { color: #4a6a80 !important; font-size: 0.84rem !important; font-weight: 600 !important; }
        .dropdown-menu { border: 1px solid #dce8f0 !important; border-radius: 8px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; }
        .dropdown-item { font-size: 0.82rem !important; color: #4a6a80 !important; padding: 7px 16px !important; }
        .dropdown-item:hover { background: #f0f6fa !important; color: #1a3a50 !important; }
        .search-ctrl::placeholder { color: #9ab8ca !important; }
        .search-ctrl:focus { box-shadow: none !important; border-color: #7ab0cc !important; }
        .cat-pill { cursor: pointer; transition: all 0.2s; border: 1.5px solid #c8dce8; border-radius: 20px; padding: 5px 15px; font-size: 0.78rem; font-weight: 600; font-family: 'Nunito', sans-serif; background: none; }
        .cat-pill.active { background: linear-gradient(135deg,#2e7da8,#4a9eca) !important; color: #fff !important; border-color: transparent !important; box-shadow: 0 3px 10px rgba(46,125,168,0.22); }
        .cat-pill:not(.active) { background: #fff; color: #4a6a80; }
        .cat-pill:not(.active):hover { background: #edf5fa !important; color: #1a3a50 !important; }
        .nav-auth-btn { display: inline-block; font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.82rem; border-radius: 7px; padding: 5px 18px; text-decoration: none; transition: all 0.2s; border: none; cursor: pointer; }
        .nav-auth-btn:hover { opacity: 0.88; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .skeleton { background: linear-gradient(90deg,#f0f6fa 25%,#e0eef6 50%,#f0f6fa 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        .filter-select { padding: 7px 12px; border: 1.5px solid #c8dce8; border-radius: 8px; font-size: 0.8rem; font-family: 'Nunito', sans-serif; color: #4a6a80; background: #fff; outline: none; cursor: pointer; }
        .filter-select:focus { border-color: #7ab0cc; }
        .filter-select:disabled { background: #f4f8fb; color: #b0c4d4; cursor: not-allowed; }
      `}</style>

      {/* ── Navbar ── */}
      <Navbar expand="md" style={{
        background: '#fff', borderBottom: '1px solid #dce8f0',
        padding: '0.55rem 0', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}>
        <Container>
          <Navbar.Toggle style={{ border: '1px solid #dce8f0', padding: '4px 8px' }} />
          <Navbar.Brand as={Link} to="/" style={{
            fontFamily: "'Lora', serif", fontWeight: 700,
            color: '#1a3a50', fontSize: '1.35rem', marginLeft: '6px',
          }}>
            CampusCloud
          </Navbar.Brand>

          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center gap-1">
              <Link to="/resources" className="nav-auth-btn" style={{
                marginLeft: '8px', background: 'transparent',
                border: '1.5px solid #a8c4d4', color: '#4a6a80',
              }}>
                📄 Resources
              </Link>

              <NavDropdown title="Admin" id="admin-dd" className="cc-dropdown-toggle">
                <NavDropdown.Item as={Link} to="/admin/login">Admin Login</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin">Dashboard</NavDropdown.Item>
              </NavDropdown>

              {user ? (
                <>
                  <Link to="/profile" className="nav-auth-btn" style={{
                    marginLeft: '8px', background: '#edf5fa',
                    border: '1.5px solid #a8c4d4', color: '#2e7da8',
                  }}>
                    👤 {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="nav-auth-btn"
                    style={{
                      marginLeft: '4px', background: '#fee2e2',
                      border: '1.5px solid #fca5a5', color: '#dc2626',
                    }}
                  >
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-auth-btn" style={{
                    marginLeft: '8px', background: 'transparent',
                    border: '1.5px solid #a8c4d4', color: '#4a6a80',
                  }}>
                    Login
                  </Link>
                  <Link to="/register" className="nav-auth-btn" style={{
                    marginLeft: '4px',
                    background: 'linear-gradient(135deg, #2e7da8, #4a9eca)',
                    border: 'none', color: '#fff',
                  }}>
                    Register
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #cfe5f2 0%, #dff0f8 40%, #c8dff0 100%)',
        borderBottom: '1px solid #b8d4e4', padding: '2.8rem 0',
      }}>
        <Container>
          <Row className="align-items-center">
            <Col md={5}>
              <h1 style={{
                fontFamily: "'Lora', serif", fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1a3a50',
                lineHeight: 1.35, marginBottom: '1.5rem',
              }}>
                Find and share the best study materials.
              </h1>
              <InputGroup style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 3px 14px rgba(0,0,0,0.1)' }}>
                <InputGroup.Text style={{ background: '#fff', border: '1.5px solid #a8c4d4', borderRight: 'none', color: '#8ab4cc', paddingLeft: '13px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </InputGroup.Text>
                <Form.Control
                  className="search-ctrl"
                  placeholder="Search by title, department, course..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    border: '1.5px solid #a8c4d4', borderLeft: 'none', borderRight: 'none',
                    color: '#1e3a50', fontSize: '0.87rem', padding: '10px',
                    background: '#fff', fontFamily: "'Nunito', sans-serif",
                  }}
                />
                <Button style={{
                  background: 'linear-gradient(135deg, #2e7da8, #4a9eca)', border: 'none',
                  color: '#fff', fontFamily: "'Nunito', sans-serif", fontWeight: 700,
                  fontSize: '0.87rem', padding: '10px 22px',
                }}>
                  Find
                </Button>
              </InputGroup>
            </Col>

            <Col md={7} className="mt-4 mt-md-0" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                background: 'linear-gradient(135deg, #b8d4e4 0%, #cce4f0 100%)',
                borderRadius: '16px', border: '1px solid #a0c4d8', width: '100%',
                maxWidth: '400px', minHeight: '180px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(46,100,140,0.12)',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '3.5rem' }}>💻</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
                    {['📗', '📘', '📙', '📕', '📔'].map((b, i) => (
                      <span key={i} style={{ fontSize: `${1.9 - i * 0.1}rem`, transform: `rotate(${(i - 2) * 4}deg)` }}>{b}</span>
                    ))}
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '12px', right: '14px', background: '#fff', borderRadius: '7px', padding: '4px 10px', fontSize: '0.67rem', fontWeight: 700, color: '#2e7da8', border: '1px solid #a8c4d4', fontFamily: "'Nunito', sans-serif" }}>
                  📚 {allResources.length}+ Resources
                </div>
                <div style={{ position: 'absolute', bottom: '12px', left: '14px', background: '#fff', borderRadius: '7px', padding: '4px 10px', fontSize: '0.67rem', fontWeight: 700, color: '#3a8a5e', border: '1px solid #b8d8c8', fontFamily: "'Nunito', sans-serif" }}>
                  ✅ Free to Download
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ── Browse Section ── */}
      <Container style={{ padding: '2.5rem 1rem 3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '1.45rem', color: '#1a3a50', marginBottom: '0.35rem' }}>
            Browse study materials
          </h2>
          <p style={{ color: '#7a9db5', fontSize: '0.83rem', margin: 0 }}>
            Explore our collection to discover the perfect study notes for you
          </p>
        </div>

        {/* Resource type pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {RESOURCE_TYPES.map(type => (
            <button
              key={type}
              className={`cat-pill ${activeType === type ? 'active' : ''}`}
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Department / Course / File type dropdowns */}
        <div style={{
          display: 'flex', gap: '10px', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '1.5rem',
        }}>
          <select
            className="filter-select"
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            disabled={!selectedDepartment}
          >
            <option value="">
              {selectedDepartment ? 'All Courses' : 'Select Dept First'}
            </option>
            {courses.map(c => (
              <option key={c.course_id} value={c.course_id}>
                {c.course_code}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedFileType}
            onChange={e => setSelectedFileType(e.target.value)}
          >
            <option value="">All File Types</option>
            {FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Results info + clear */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <p style={{ color: '#7a9db5', fontSize: '0.78rem', margin: 0 }}>
            {loading ? 'Loading...' : (
              <>Showing <strong style={{ color: '#2e7da8' }}>{filteredResources.length}</strong> result{filteredResources.length !== 1 ? 's' : ''}</>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{ background: 'none', border: 'none', color: '#2e7da8', fontSize: '0.76rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Nunito', sans-serif" }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#e07a7a', fontSize: '0.85rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <Row className="g-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Col key={i} xs={12} sm={6} md={4}>
                <ResourceSkeleton />
              </Col>
            ))}
          </Row>
        )}

        {/* Empty state */}
        {!loading && !error && filteredResources.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#7a9db5' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontSize: '0.9rem' }}>No resources found. Try a different search or filter.</p>
          </div>
        )}

        {/* Resource grid */}
        {!loading && !error && filteredResources.length > 0 && (
          <Row className="g-3">
            {filteredResources.map(r => (
              <Col key={r.id} xs={12} sm={6} md={4}>
                <ResourceCard resource={r} onDownload={handleDownload} />
              </Col>
            ))}
          </Row>
        )}

        {/* View all button */}
        {!loading && filteredResources.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/resources">
              <Button style={{
                background: 'linear-gradient(135deg, #2e7da8, #4a9eca)', border: 'none',
                fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem',
                borderRadius: '8px', padding: '10px 30px', color: '#fff',
                boxShadow: '0 4px 14px rgba(46,125,168,0.28)',
              }}>
                View All Resources →
              </Button>
            </Link>
          </div>
        )}
      </Container>

      {/* ── Footer ── */}
      <footer style={{ background: '#cce0ed', borderTop: '1px solid #b0ccdc', padding: '1.4rem 0', textAlign: 'center' }}>
        <p style={{ color: '#4a6a80', fontSize: '0.82rem', fontFamily: "'Nunito', sans-serif", margin: 0, fontWeight: 600 }}>
          © 2026 CampusCloud. All rights reserved. For academic use only.
        </p>
      </footer>
    </div>
  );
}