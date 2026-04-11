import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Resource {
  id: number;
  title: string;
  description: string;
  department: string;
  courseCode: string;
  courseName: string;
  department_id: number;
  course_id: number;
  fileType: string;
  fileSize?: string;
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
  department_id: number;
}

const NAV_ITEMS = [
  { label: 'Home',         to: '/',          icon: '🏠' },
  { label: 'Resources',    to: '/resources', icon: '📄' },
  { label: 'Upload',       to: '/upload',    icon: '⬆️' },
  { label: 'Rewards',      to: '/rewards',   icon: '🏅' },
  { label: 'Profile',      to: '/profile',   icon: '👤' },
  { label: 'AI Assistant', to: '/assistant', icon: '🤖' }, // 👈 added
];

const FILE_TYPES = ['PDF', 'DOCX', 'XLSX', 'PPTX', 'ZIP', 'MP4', 'JPG'];

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
          width: '40px', height: '40px', borderRadius: '50%',
          background: '#8aafc5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: '0.95rem',
        }}>SU</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a3a50' }}>Student User</div>
          <div style={{ fontSize: '0.75rem', color: '#6a8fa8' }}>student@uni.edu</div>
        </div>
      </div>
    </aside>
  );
}

export default function ResourcesPage() {
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch('/api/resources'),
          fetch('/api/departments'),
        ]);
        const resourcesData = await res1.json();
        const departmentsData = await res2.json();

        setAllResources(Array.isArray(resourcesData) ? resourcesData : []);
        setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
        setAllResources([]);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetch(`/api/courses/${selectedDepartment}`)
        .then(r => r.json())
        .then(data => setCourses(Array.isArray(data) ? data : []))
        .catch(() => toast.error('Failed to load courses'));
    } else {
      setCourses([]);
    }
    setSelectedCourse('');
  }, [selectedDepartment]);

  const filteredResources = allResources.filter(resource => {
    const matchesSearch =
      searchTerm === '' ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === '' ||
      String(resource.department_id) === String(selectedDepartment);

    const matchesCourse =
      selectedCourse === '' ||
      String(resource.course_id) === String(selectedCourse);

    const matchesFileType =
      selectedFileType === '' ||
      resource.fileType === selectedFileType;

    return matchesSearch && matchesDepartment && matchesCourse && matchesFileType;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedCourse('');
    setSelectedFileType('');
  };

  const hasActiveFilters = searchTerm || selectedDepartment || selectedCourse || selectedFileType;

  const handleDownload = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/download/${id}`, {
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8' }}>
      <Sidebar active="Resources" />

      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>

        {/* Header */}
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
                placeholder="Search by title, department or course..."
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
              style={{
                padding: '10px 16px',
                border: '1px solid #dce8f0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                minWidth: '160px',
              }}
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>

            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              disabled={!selectedDepartment}
              style={{
                padding: '10px 16px',
                border: '1px solid #dce8f0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                minWidth: '160px',
                background: !selectedDepartment ? '#f4f8fb' : 'white',
                color: !selectedDepartment ? '#b0c4d4' : '#1a3a50',
                cursor: !selectedDepartment ? 'not-allowed' : 'pointer',
              }}
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
              value={selectedFileType}
              onChange={e => setSelectedFileType(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #dce8f0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                minWidth: '130px',
              }}
            >
              <option value="">All Types</option>
              {FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {hasActiveFilters && (
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
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #dce8f0' }}>
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
                      <th key={h} style={{
                        padding: '12px 24px',
                        textAlign: 'left',
                        color: '#6a8fa8',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}>
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
                          {(resource.description || '').substring(0, 60)}...
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>
                        {resource.department}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>
                        {resource.courseName} ({resource.courseCode})
                      </td>
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
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>
                        {resource.uploadedBy}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>
                        ⬇️ {resource.downloads}
                      </td>
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