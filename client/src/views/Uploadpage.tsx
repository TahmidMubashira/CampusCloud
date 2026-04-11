import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from './Layout';

const RESOURCE_TYPES = [
  'Lecture Notes', 'Past Papers', 'Assignments',
  'Books', 'Lab Reports', 'Projects', 'Tutorials',
];

interface Department {
  department_id: number;
  department_name: string;
}

interface Course {
  course_id: number;
  course_name: string;
  course_code: string;
}

function HeroIllustration() {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="68" width="100" height="6" rx="3" fill="#a8c8de" />
      <rect x="30" y="74" width="6" height="20" rx="2" fill="#8ab0c8" />
      <rect x="104" y="74" width="6" height="20" rx="2" fill="#8ab0c8" />
      <rect x="55" y="38" width="44" height="30" rx="4" fill="#c8dde8" />
      <rect x="58" y="41" width="38" height="24" rx="2" fill="#e8f2f8" />
      <rect x="72" y="68" width="10" height="4" rx="1" fill="#a8c8de" />
      <rect x="68" y="72" width="18" height="2" rx="1" fill="#a8c8de" />
      <rect x="62" y="46" width="24" height="2" rx="1" fill="#90b8d0" />
      <rect x="62" y="51" width="18" height="2" rx="1" fill="#b8d4e4" />
      <rect x="62" y="56" width="20" height="2" rx="1" fill="#b8d4e4" />
      <ellipse cx="38" cy="55" rx="10" ry="13" fill="#c8dde8" />
      <circle cx="38" cy="36" r="9" fill="#dce8f0" />
      <ellipse cx="38" cy="29" rx="9" ry="5" fill="#6a8fa8" />
      <path d="M46 58 Q58 62 65 64" stroke="#a8c8de" strokeWidth="4" strokeLinecap="round" />
      <rect x="56" y="63" width="28" height="6" rx="2" fill="#b8cdd9" />
      <circle cx="18" cy="30" r="3" fill="#b8d4e4" opacity="0.6" />
      <circle cx="125" cy="25" r="4" fill="#c8dde8" opacity="0.5" />
      <circle cx="120" cy="50" r="2" fill="#a8c8de" opacity="0.6" />
    </svg>
  );
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1.5px solid #dce8f0',
  borderRadius: '8px',
  fontSize: '0.85rem',
  color: '#4a6a80',
  background: '#fff',
  fontFamily: "'Nunito', sans-serif",
  outline: 'none',
  cursor: 'pointer',
};

const disabledSelectStyle: React.CSSProperties = {
  ...selectStyle,
  background: '#f4f8fb',
  color: '#b0c4d4',
  cursor: 'not-allowed',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1.5px solid #dce8f0',
  borderRadius: '8px',
  fontSize: '0.85rem',
  color: '#1a3a50',
  background: '#fff',
  fontFamily: "'Nunito', sans-serif",
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#4a6a80',
  marginBottom: '6px',
};

export default function UploadPage() {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department_id: '',
    course_id: '',
    resourceType: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetch('/api/departments')
      .then(r => {
        console.log('status:', r.status);
        console.log('ok:', r.ok);
        return r.json();
      })
      .then(data => {
        console.log('departments raw response:', data);
        setDepartments(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('fetch error:', err);
        toast.error('Failed to load departments');
      });
  }, []);

  useEffect(() => {
    if (formData.department_id) {
      fetch(`/api/courses/${formData.department_id}`)
        .then(r => r.json())
        .then(data => setCourses(Array.isArray(data) ? data : []))
        .catch(() => toast.error('Failed to load courses'));
    } else {
      setCourses([]);
    }
    setFormData(p => ({ ...p, course_id: '' }));
  }, [formData.department_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFile = (file: File | null) => {
    if (file) setFormData(p => ({ ...p, file }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, department_id, course_id, resourceType, file } = formData;
    if (!title || !description || !department_id || !course_id || !resourceType || !file) {
      toast.error('Please fill in all fields and attach a file.');
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('department_id', department_id);
    data.append('course_id', course_id);
    data.append('resourceType', resourceType);
    data.append('file', file);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/resources/upload', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Resource uploaded successfully!');
        navigate('/profile');
      } else {
        toast.error(result.message || 'Upload failed.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout active="Upload">
      <style>{`
        .up-input:focus { border-color: #2e7da8 !important; box-shadow: 0 0 0 3px rgba(46,125,168,0.09) !important; }
        .up-input::placeholder { color: #a0bece !important; }
        .up-select:focus { border-color: #2e7da8 !important; outline: none !important; }
        .upload-dropdowns-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 20px; }
        @media (max-width: 768px) { .upload-dropdowns-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #d4e8f4 0%, #e2f0f8 50%, #cce0ee 100%)',
        borderRadius: '14px',
        padding: '28px 36px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '28px',
        border: '1px solid #b8d4e4',
        flexWrap: 'wrap',
      }}>
        <div style={{ flexShrink: 0 }}>
          <HeroIllustration />
        </div>
        <div>
          <h1 style={{
            fontWeight: 700, fontSize: '1.5rem', color: '#1a3a50',
            margin: '0 0 6px', fontFamily: "'Lora', serif",
          }}>
            Upload Resource
          </h1>
          <p style={{ color: '#5a8aa8', fontSize: '0.85rem', margin: 0 }}>
            Share your academic materials with fellow students and earn contribution points
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        background: '#fff',
        borderRadius: '14px',
        padding: '28px 32px',
        border: '1px solid #dce8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>

        {/* Upload Guidelines */}
        <div style={{
          background: '#f0f7fc',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '24px',
          border: '1px solid #d4e8f4',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>📋</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a3a50', marginBottom: '6px' }}>
              Upload Guidelines
            </div>
            {[
              'Ensure your resource is accurate and helpful to other students',
              'Only upload materials you have right to share',
              'Use clear, descriptive titles and provide helpful descriptions',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', fontSize: '0.78rem', color: '#4a6a80', marginBottom: '3px' }}>
                <span>•</span><span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Resource Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a6a80" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Resource Title <span style={{ color: '#e05a3a' }}>*</span>
            </label>
            <input
              className="up-input"
              name="title"
              type="text"
              placeholder="e.g. Data Structure class notes"
              value={formData.title}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a6a80" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Description
            </label>
            <textarea
              className="up-input"
              name="description"
              rows={3}
              placeholder="Provide a brief description to help students understand what's included in this resource"
              value={formData.description}
              onChange={handleChange}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '75px' }}
            />
          </div>

          {/* Department + Course Code + Resource Type */}
          <div className="upload-dropdowns-grid">
            <div>
              <label style={labelStyle}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a6a80" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Department <span style={{ color: '#e05a3a' }}>*</span>
              </label>
              <select className="up-select" name="department_id" value={formData.department_id} onChange={handleChange} style={selectStyle}>
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a6a80" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                </svg>
                Course Code <span style={{ color: '#e05a3a' }}>*</span>
              </label>
              <select
                className="up-select"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                disabled={!formData.department_id}
                style={!formData.department_id ? disabledSelectStyle : selectStyle}
              >
                <option value="">
                  {formData.department_id ? 'Select Course Code' : 'Select Department first'}
                </option>
                {courses.map(c => (
                  <option key={c.course_id} value={c.course_id}>{c.course_code}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a6a80" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Resource Type <span style={{ color: '#e05a3a' }}>*</span>
              </label>
              <select className="up-select" name="resourceType" value={formData.resourceType} onChange={handleChange} style={selectStyle}>
                <option value="">Select Resource Type</option>
                {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Upload File */}
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a6a80" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload File <span style={{ color: '#e05a3a' }}>*</span>
            </label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#2e7da8' : formData.file ? '#4aaa7a' : '#b8d4e4'}`,
                borderRadius: '10px',
                padding: '32px 20px',
                textAlign: 'center',
                background: dragOver ? '#edf5fa' : formData.file ? '#edf7f2' : '#f8fbfe',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <input
                id="fileInput"
                type="file"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files?.[0] ?? null)}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.xlsx"
              />
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: '#d4e8f4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '4px',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e7da8" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </div>
              {formData.file ? (
                <>
                  <div style={{ fontWeight: 700, color: '#2a8a5a', fontSize: '0.88rem' }}>{formData.file.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#7a9db5' }}>
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB · Click to change file
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 600, color: '#4a6a80', fontSize: '0.88rem' }}>
                    Drop your file here or click to browse
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#9ab5c5' }}>Maximum file size: 50 MB</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ab5c5' }}>
                    Supported formats: PDF, DOC, DOCX, PPT, PPTX, ZIP
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Link
              to="/resources"
              style={{
                padding: '10px 28px',
                borderRadius: '8px',
                border: '1.5px solid #dce8f0',
                background: '#fff',
                color: '#4a6a80',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 28px',
                borderRadius: '8px',
                border: 'none',
                background: loading ? '#7ab0cc' : '#1a3a50',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Nunito', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {loading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}