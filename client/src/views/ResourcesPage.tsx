import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Types
interface Resource {
  id: number;
  title: string;
  description: string;
  department: string;
  courseCode: string;
  fileType: string;
  fileSize?: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
}

// Navigation items
const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Resources', to: '/resources', icon: '📄' },
  { label: 'Upload', to: '/upload', icon: '⬆️' },
  { label: 'Rewards', to: '/rewards', icon: '🏅' },
  { label: 'Profile', to: '/profile', icon: '👤' },
];

const DEPARTMENTS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
  'Biology', 'English', 'History', 'Economics', 'EEE', 'IPE',
];

const COURSE_CODES = [
  'CSE101', 'CSE201', 'CSE301', 'CSE307',
  'MATH101', 'MATH201',
  'PHY101', 'PHY201',
  'CHM101', 'CHM201',
  'BIO101', 'BIO201',
  'EEE301', 'IPE400',
];

const FILE_TYPES = ['PDF', 'DOCX', 'XLSX', 'PPT', 'ZIP', 'MP4', 'JPG'];

// Mock data
const MOCK_RESOURCES: Resource[] = [
  {
    id: 1,
    title: 'Introduction to Data Structures',
    description: 'Comprehensive notes on DSA including trees, graphs, and sorting',
    department: 'Computer Science',
    courseCode: 'CSE201',
    fileType: 'PDF',
    fileSize: '2.5 MB',
    uploadedBy: 'Tahmid',
    uploadedAt: '2026-03-01',
    downloads: 234,
  },
  {
    id: 2,
    title: 'Introduction to Algorithms',
    description: 'Algorithm design and analysis with complexity proofs',
    department: 'Computer Science',
    courseCode: 'CSE201',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    uploadedBy: 'Shia Johnson',
    uploadedAt: '2026-02-28',
    downloads: 108,
  },
  {
    id: 3,
    title: 'Power Systems Fundamentals',
    description: 'Power generation, transmission and distribution fundamentals',
    department: 'EEE',
    courseCode: 'EEE301',
    fileType: 'DOCX',
    fileSize: '3.2 MB',
    uploadedBy: 'Felix Miller',
    uploadedAt: '2026-02-25',
    downloads: 79,
  },
  {
    id: 4,
    title: 'Quality Management and Control',
    description: 'TQM principles, Six Sigma and quality frameworks',
    department: 'IPE',
    courseCode: 'IPE400',
    fileType: 'PPT',
    fileSize: '4.0 MB',
    uploadedBy: 'Avery Jordan',
    uploadedAt: '2026-02-20',
    downloads: 139,
  },
  {
    id: 5,
    title: 'Microprocessors and Microcontrollers',
    description: 'Architecture, programming and interfacing',
    department: 'Computer Science',
    courseCode: 'CSE307',
    fileType: 'ZIP',
    fileSize: '6.1 MB',
    uploadedBy: 'Skyler Reed',
    uploadedAt: '2026-02-18',
    downloads: 164,
  },
];

// Sidebar Component
function Sidebar({ active }: { active: string }) {
  return (
    <aside style={{
      width: '250px',
      minHeight: '100vh',
      background: '#d7e3ec',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      flexShrink: 0,
    }}>
      <Link to="/" style={{ textDecoration: 'none', padding: '0 20px 24px' }}>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#1a3a50' }}>CampusCloud</div>
        <div style={{ fontSize: '0.8rem', color: '#6a8fa8' }}>Resource Sharing</div>
      </Link>

      <div style={{ borderTop: '1px solid #b8cdd9', marginBottom: '16px' }} />

      <nav style={{ flex: 1, padding: '0 12px' }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.label;
          return (
            <Link
              key={item.label}
              to={item.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '4px',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#1a3a50' : '#4a6a80',
                background: isActive ? '#b8cdd9' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{
        margin: '0 12px',
        borderTop: '1px solid #b8cdd9',
        paddingTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#8aafc5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '0.95rem',
        }}>SU</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a3a50' }}>Student User</div>
          <div style={{ fontSize: '0.75rem', color: '#6a8fa8' }}>student@uni.edu</div>
        </div>
      </div>
    </aside>
  );
}

// Main Resources Page Component
export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');

  // Load resources
  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/resources`);
        if (response.ok) {
          const data = await response.json();
          setResources(data);
        } else {
          setResources(MOCK_RESOURCES);
        }
      } catch {
        setResources(MOCK_RESOURCES);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, []);

  // Handle download
  const handleDownload = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/download/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      toast.error('Download failed. Please try again.');
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

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === '' ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === '' || resource.department === selectedDepartment;
    const matchesCourse = selectedCourse === '' || resource.courseCode === selectedCourse;
    const matchesFileType = selectedFileType === '' || resource.fileType === selectedFileType;
    return matchesSearch && matchesDepartment && matchesCourse && matchesFileType;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedCourse('');
    setSelectedFileType('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8' }}>
      <Sidebar active="Resources" />

      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>

        {/* Header — no Upload button here */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a3a50', margin: 0 }}>
            Resource Library
          </h1>
          <p style={{ color: '#6a8fa8', marginTop: '8px', marginBottom: 0 }}>
            Browse and download academic resources shared by students and faculty
          </p>
        </div>

        {/* Search and Filters */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: '1px solid #dce8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              style={{ padding: '10px 16px', border: '1px solid #dce8f0', borderRadius: '8px', fontSize: '0.95rem', minWidth: '150px' }}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              style={{ padding: '10px 16px', border: '1px solid #dce8f0', borderRadius: '8px', fontSize: '0.95rem', minWidth: '150px' }}
            >
              <option value="">All Courses</option>
              {COURSE_CODES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={selectedFileType}
              onChange={e => setSelectedFileType(e.target.value)}
              style={{ padding: '10px 16px', border: '1px solid #dce8f0', borderRadius: '8px', fontSize: '0.95rem', minWidth: '150px' }}
            >
              <option value="">All Types</option>
              {FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {(searchTerm || selectedDepartment || selectedCourse || selectedFileType) && (
              <button
                onClick={clearFilters}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #dce8f0',
                  borderRadius: '8px',
                  color: '#2e7da8',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Resources Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #dce8f0',
          }}>
            <h3 style={{ margin: 0, color: '#1a3a50', fontSize: '1.1rem' }}>
              Available Resources ({filteredResources.length})
            </h3>
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#6a8fa8' }}>
              Loading resources...
            </div>
          ) : filteredResources.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
              <h3 style={{ color: '#1a3a50', marginBottom: '8px' }}>No resources found</h3>
              <p style={{ color: '#6a8fa8' }}>Try adjusting your filters or upload a new resource</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #dce8f0' }}>
                    {['Resource', 'Department', 'Course', 'Type', 'Uploader', 'Downloads', 'Action'].map(h => (
                      <th key={h} style={{ padding: '12px 24px', textAlign: 'left', color: '#6a8fa8', fontSize: '0.9rem', fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map(resource => (
                    <tr key={resource.id} style={{ borderBottom: '1px solid #dce8f0' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 600, color: '#1a3a50', marginBottom: '4px' }}>
                          {resource.title}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6a8fa8' }}>
                          {resource.description.substring(0, 60)}...
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>{resource.department}</td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>{resource.courseCode}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          background: '#e3f0f8',
                          color: '#2e7da8',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}>
                          {resource.fileType}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>{resource.uploadedBy}</td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>⬇️ {resource.downloads}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <button
                          onClick={() => handleDownload(resource.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #2e7da8',
                            color: '#2e7da8',
                            padding: '6px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#2e7da8';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#2e7da8';
                          }}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}