import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Layout from './Layout';

// ── Interfaces ────────────────────────────────────────────────────────────────
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
  commentCount: number;
}

interface Department { department_id: number; department_name: string; }
interface Course { course_id: number; course_name: string; course_code: string; department_id: number; }

interface Reply {
  id: number;
  body: string;
  user: string;
  user_id: number;
  timeAgo: string;
}

interface Comment {
  id: number;
  body: string;
  user: string;
  user_id: number;
  timeAgo: string;
  replyCount: number;
  replies: Reply[];
}

const FILE_TYPES = ['PDF', 'DOCX', 'XLSX', 'PPTX', 'ZIP', 'MP4', 'JPG'];

// ── Comment Section ───────────────────────────────────────────────────────────
function CommentSection({ resourceId }: { resourceId: number }) {
  const [comments, setComments]           = useState<Comment[]>([]);
  const [loading, setLoading]             = useState(true);
  const [newComment, setNewComment]       = useState('');
  const [submitting, setSubmitting]       = useState(false);
  const [replyingTo, setReplyingTo]       = useState<number | null>(null);
  const [replyText, setReplyText]         = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  // Fix: read token + currentUser inside the component so they're always fresh
  const token = localStorage.getItem('token');
  // Fix: parse inside render so currentUser.id is always up-to-date
  const currentUser: { id?: number; name?: string } =
    JSON.parse(localStorage.getItem('user') || '{}');

  // Fix: token added to dependency array; wrapped in useCallback to avoid stale ref
  const fetchComments = useCallback(() => {
    fetch(`/api/resources/${resourceId}/comments`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => { if (data.success) setComments(data.comments); })
      .catch(() => toast.error('Failed to load comments'))
      .finally(() => setLoading(false));
  }, [resourceId, token]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    if (!token) { toast.error('Please login to comment'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/resources/${resourceId}/comments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newComment.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
      } else { toast.error('Failed to post comment'); }
    } catch { toast.error('Network error'); }
    finally { setSubmitting(false); }
  };

  const handlePostReply = async (parentId: number) => {
    if (!replyText.trim()) return;
    if (!token) { toast.error('Please login to reply'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/resources/${resourceId}/comments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyText.trim(), parent_id: parentId }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => prev.map(c =>
          c.id === parentId
            ? { ...c, replies: [...c.replies, data.comment], replyCount: c.replyCount + 1 }
            : c
        ));
        // Auto-expand so the new reply is visible
        setExpandedReplies(prev => new Set([...prev, parentId]));
        setReplyingTo(null);
        setReplyText('');
      } else { toast.error('Failed to post reply'); }
    } catch { toast.error('Network error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (commentId: number, parentId?: number) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        if (parentId !== undefined) {
          setComments(prev => prev.map(c =>
            c.id === parentId
              ? { ...c, replies: c.replies.filter(r => r.id !== commentId), replyCount: c.replyCount - 1 }
              : c
          ));
        } else {
          setComments(prev => prev.filter(c => c.id !== commentId));
        }
      } else { toast.error('Failed to delete'); }
    } catch { toast.error('Network error'); }
  };

  // Fix: no ternary-as-statement — use if/else inside the updater
  const toggleReplies = (commentId: number) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  if (loading) return (
    <div style={{ padding: '16px', color: '#7a9db5', fontSize: '0.82rem', textAlign: 'center' }}>
      Loading comments...
    </div>
  );

  return (
    <div style={{ padding: '16px 24px', borderTop: '1px solid #dce8f0', background: '#fafcfe' }}>

      {/* Post new comment */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%', background: '#8aafc5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: '2px',
          }}>
            {currentUser?.name ? currentUser.name[0].toUpperCase() : '?'}
          </div>
          <div style={{ flex: 1 }}>
            <textarea
              placeholder={token ? 'Ask a question or leave a comment...' : 'Login to comment'}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              disabled={!token}
              rows={2}
              style={{
                width: '100%', padding: '8px 12px', border: '1px solid #dce8f0',
                borderRadius: '8px', fontSize: '0.82rem', resize: 'vertical',
                outline: 'none', fontFamily: 'inherit',
                background: token ? '#fff' : '#f4f8fb', boxSizing: 'border-box',
              }}
            />
            {newComment.trim() && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button onClick={handlePostComment} disabled={submitting}
                  style={{ padding: '5px 14px', borderRadius: '6px', border: 'none', background: '#2e7da8', color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
                <button onClick={() => setNewComment('')}
                  style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #dce8f0', background: 'transparent', color: '#7a9db5', fontSize: '0.78rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#9ab5c5', fontSize: '0.8rem', padding: '12px 0' }}>
          No comments yet. Be the first to ask a question!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {comments.map(comment => (
            <div key={comment.id}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: '#6a9ab5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {comment.user[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ background: '#fff', border: '1px solid #e4eef5', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1a3a50' }}>{comment.user}</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: '#9ab5c5' }}>{comment.timeAgo}</span>
                        {/* Fix: currentUser.id is now a number from parsed JSON; comment.user_id
                            is cast to number by the API — strict equality works correctly */}
                        {currentUser?.id !== undefined && currentUser.id === comment.user_id && (
                          <button onClick={() => handleDelete(comment.id)}
                            style={{ background: 'none', border: 'none', color: '#fca5a5', fontSize: '0.7rem', cursor: 'pointer', padding: '0' }}>
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#2a4a60', lineHeight: 1.5 }}>{comment.body}</p>
                  </div>

                  {/* Action row */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', paddingLeft: '4px' }}>
                    {token && (
                      <button
                        onClick={() => { setReplyingTo(replyingTo === comment.id ? null : comment.id); setReplyText(''); }}
                        style={{ background: 'none', border: 'none', color: '#2e7da8', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500, padding: 0 }}>
                        💬 Reply
                      </button>
                    )}
                    {comment.replyCount > 0 && (
                      <button onClick={() => toggleReplies(comment.id)}
                        style={{ background: 'none', border: 'none', color: '#6a8fa8', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}>
                        {expandedReplies.has(comment.id)
                          ? '▲ Hide'
                          : `▼ ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`}
                      </button>
                    )}
                  </div>

                  {/* Reply input */}
                  {replyingTo === comment.id && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%', background: '#8aafc5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, marginTop: '2px',
                      }}>
                        {currentUser?.name ? currentUser.name[0].toUpperCase() : '?'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <textarea
                          autoFocus
                          placeholder={`Reply to ${comment.user}...`}
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          rows={2}
                          style={{ width: '100%', padding: '7px 10px', border: '1px solid #dce8f0', borderRadius: '8px', fontSize: '0.8rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                        />
                        <div style={{ display: 'flex', gap: '6px', marginTop: '5px' }}>
                          <button
                            onClick={() => handlePostReply(comment.id)}
                            disabled={submitting || !replyText.trim()}
                            style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: replyText.trim() ? '#2e7da8' : '#b8cdd9', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: replyText.trim() ? 'pointer' : 'not-allowed' }}>
                            {submitting ? 'Posting...' : 'Reply'}
                          </button>
                          <button onClick={() => { setReplyingTo(null); setReplyText(''); }}
                            style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #dce8f0', background: 'transparent', color: '#7a9db5', fontSize: '0.75rem', cursor: 'pointer' }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {expandedReplies.has(comment.id) && comment.replies.length > 0 && (
                    <div style={{ marginTop: '8px', paddingLeft: '12px', borderLeft: '2px solid #dce8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {comment.replies.map(reply => (
                        <div key={reply.id} style={{ display: 'flex', gap: '8px' }}>
                          <div style={{
                            width: '24px', height: '24px', borderRadius: '50%', background: '#6a9ab5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                          }}>
                            {reply.user[0].toUpperCase()}
                          </div>
                          <div style={{ flex: 1, background: '#fff', border: '1px solid #e4eef5', borderRadius: '8px', padding: '8px 10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.78rem', color: '#1a3a50' }}>{reply.user}</span>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.68rem', color: '#9ab5c5' }}>{reply.timeAgo}</span>
                                {currentUser?.id !== undefined && currentUser.id === reply.user_id && (
                                  <button onClick={() => handleDelete(reply.id, comment.id)}
                                    style={{ background: 'none', border: 'none', color: '#fca5a5', fontSize: '0.68rem', cursor: 'pointer', padding: 0 }}>
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#2a4a60', lineHeight: 1.5 }}>{reply.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ResourcesPage() {
  const [allResources, setAllResources]   = useState<Resource[]>([]);
  const [departments, setDepartments]     = useState<Department[]>([]);
  const [courses, setCourses]             = useState<Course[]>([]);
  const [loading, setLoading]             = useState(true);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const [searchTerm, setSearchTerm]             = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse]     = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch('/api/resources'),
          fetch('/api/departments'),
        ]);
        const resourcesData   = await res1.json();
        const departmentsData = await res2.json();
        setAllResources(Array.isArray(resourcesData)   ? resourcesData   : []);
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
    const matchesDepartment = selectedDepartment === '' || String(resource.department_id) === String(selectedDepartment);
    const matchesCourse     = selectedCourse     === '' || String(resource.course_id)     === String(selectedCourse);
    const matchesFileType   = selectedFileType   === '' || resource.fileType              === selectedFileType;
    return matchesSearch && matchesDepartment && matchesCourse && matchesFileType;
  });

  const clearFilters = () => {
    setSearchTerm(''); setSelectedDepartment(''); setSelectedCourse(''); setSelectedFileType('');
  };
  const hasActiveFilters = searchTerm || selectedDepartment || selectedCourse || selectedFileType;

  const handleDownload = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/download/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) { toast.error('Download failed. Please try again.'); return; }
    const blob = await response.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = ''; a.click();
    URL.revokeObjectURL(url);
  };

  // Fix: if/else instead of ternary-as-statement
  const toggleComments = (resourceId: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(resourceId)) {
        next.delete(resourceId);
      } else {
        next.add(resourceId);
      }
      return next;
    });
  };

  return (
    <Layout active="Resources">
      <style>{`
        .res-filters { display: flex; gap: 16px; flex-wrap: wrap; }
        .res-filters > select, .res-filters > button { flex-shrink: 0; }
        @media (max-width: 768px) {
          .res-filters > * { width: 100%; min-width: unset !important; }
          .res-search-input { min-width: unset !important; }
          .res-table { display: none !important; }
          .res-cards { display: flex !important; }
        }
        .res-cards { display: none; flex-direction: column; gap: 12px; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a3a50', margin: 0 }}>Resource Library</h1>
        <p style={{ color: '#6a8fa8', marginTop: '8px', marginBottom: 0 }}>
          Browse and download academic resources shared by fellow students
        </p>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div className="res-filters">
          <div className="res-search-input" style={{ flex: 1, minWidth: '250px' }}>
            <input type="text" placeholder="Search by title, department or course..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 16px', border: '1px solid #dce8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}
            style={{ padding: '10px 16px', border: '1px solid #dce8f0', borderRadius: '8px', fontSize: '0.95rem', minWidth: '160px' }}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
          </select>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} disabled={!selectedDepartment}
            style={{ padding: '10px 16px', border: '1px solid #dce8f0', borderRadius: '8px', fontSize: '0.95rem', minWidth: '160px', background: !selectedDepartment ? '#f4f8fb' : 'white', color: !selectedDepartment ? '#b0c4d4' : '#1a3a50', cursor: !selectedDepartment ? 'not-allowed' : 'pointer' }}>
            <option value="">{selectedDepartment ? 'All Courses' : 'Select Dept First'}</option>
            {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_code}</option>)}
          </select>
          <select value={selectedFileType} onChange={e => setSelectedFileType(e.target.value)}
            style={{ padding: '10px 16px', border: '1px solid #dce8f0', borderRadius: '8px', fontSize: '0.95rem', minWidth: '130px' }}>
            <option value="">All Types</option>
            {FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {hasActiveFilters && (
            <button onClick={clearFilters}
              style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #dce8f0', borderRadius: '8px', color: '#2e7da8', cursor: 'pointer', fontSize: '0.95rem' }}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Resources Table */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #dce8f0' }}>
          <h3 style={{ margin: 0, color: '#1a3a50', fontSize: '1.1rem' }}>
            Available Resources ({filteredResources.length})
          </h3>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6a8fa8' }}>Loading resources...</div>
        ) : filteredResources.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
            <h3 style={{ color: '#1a3a50', marginBottom: '8px' }}>No resources found</h3>
            <p style={{ color: '#6a8fa8' }}>Try adjusting your filters or upload a new resource</p>
          </div>
        ) : (
          <>
            {/* Desktop table
                Fix: wrap each resource + its comment row in a single <tr> isn't valid;
                instead render them as sibling <tr>s directly — no fragment wrapper needed
                since they're already siblings inside <tbody> */}
            <div className="res-table" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #dce8f0' }}>
                    {['Resource', 'Department', 'Course', 'Type', 'Uploader', 'Downloads', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 24px', textAlign: 'left', color: '#6a8fa8', fontSize: '0.9rem', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                {/* Fix: use <tbody> per resource group instead of fragment in map.
                    Multiple <tbody> elements are valid HTML and satisfy TypeScript strict mode. */}
                {filteredResources.map(resource => (
                  <tbody key={resource.id}>
                    <tr style={{ borderBottom: expandedComments.has(resource.id) ? 'none' : '1px solid #dce8f0' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 600, color: '#1a3a50', marginBottom: '4px' }}>{resource.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6a8fa8' }}>{(resource.description || '').substring(0, 60)}...</div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>{resource.department}</td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>{resource.courseName} ({resource.courseCode})</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ background: '#e3f0f8', color: '#2e7da8', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>{resource.fileType}</span>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>{resource.uploadedBy}</td>
                      <td style={{ padding: '16px 24px', color: '#4a6a80' }}>⬇️ {resource.downloads}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button onClick={() => handleDownload(resource.id)}
                            style={{ background: 'transparent', border: '1px solid #2e7da8', color: '#2e7da8', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#2e7da8'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2e7da8'; }}>
                            ⬇️ Download
                          </button>
                          <button onClick={() => toggleComments(resource.id)}
                            style={{ background: expandedComments.has(resource.id) ? '#e8f4fb' : 'transparent', border: '1px solid #b8d4e4', color: '#4a7a9a', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}>
                            💬 {expandedComments.has(resource.id) ? 'Hide' : `Comments (${resource.commentCount})`}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedComments.has(resource.id) && (
                      <tr style={{ borderBottom: '1px solid #dce8f0' }}>
                        <td colSpan={7} style={{ padding: 0 }}>
                          <CommentSection resourceId={resource.id} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                ))}
              </table>
            </div>

            {/* Mobile cards */}
            <div className="res-cards" style={{ padding: '12px' }}>
              {filteredResources.map(resource => (
                <div key={resource.id} style={{ background: '#f8fbfe', borderRadius: '10px', border: '1px solid #e4eef5', overflow: 'hidden' }}>
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 700, color: '#1a3a50', fontSize: '0.9rem', flex: 1, marginRight: '8px' }}>{resource.title}</div>
                      <span style={{ background: '#e3f0f8', color: '#2e7da8', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{resource.fileType}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#7a9db5', marginBottom: '4px' }}>{resource.department} • {resource.courseCode}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ab5c5', marginBottom: '10px' }}>{(resource.description || '').substring(0, 70)}...</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ab5c5' }}>By {resource.uploadedBy} · ⬇️ {resource.downloads}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleDownload(resource.id)}
                          style={{ background: '#2e7da8', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                          Download
                        </button>
                        <button onClick={() => toggleComments(resource.id)}
                          style={{ background: expandedComments.has(resource.id) ? '#e8f4fb' : 'transparent', border: '1px solid #b8d4e4', color: '#4a7a9a', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>
                          💬
                        </button>
                      </div>
                    </div>
                  </div>
                  {expandedComments.has(resource.id) && <CommentSection resourceId={resource.id} />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}