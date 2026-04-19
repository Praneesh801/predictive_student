import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../services/api';

const STATUS_LABELS = {
  placed: 'Placed', not_placed: 'Not Placed', applied: 'Applied',
  not_applied: 'Not Applied', ai_needed: 'AI Needed'
};

const STATUS_CLASS = {
  placed: 'status-placed', not_placed: 'status-not-placed',
  applied: 'status-applied', ai_needed: 'status-ai-needed', not_applied: ''
};

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = () => {
    setLoading(true);
    getStudents({ search, status: statusFilter, page, limit: 10 })
      .then(r => {
        setStudents(r.data.students);
        setTotalPages(r.data.pages);
      })
      .catch(() => {
        // Show demo data if backend unavailable
        setStudents([
          { _id: '1', name: 'Amit Kumar',    cgpa: 8.0, skills: ['React','Python'], internships: 1, placementStatus: 'placed',     companyPlaced: 'TCS' },
          { _id: '2', name: 'Rahul Verma',   cgpa: 5.0, skills: ['React','Python'], internships: 2, placementStatus: 'placed',     companyPlaced: 'Infosys' },
          { _id: '3', name: 'Anjali Pandey', cgpa: 5.0, skills: ['React','Python'], internships: 0, placementStatus: 'not_placed', companyPlaced: '' },
          { _id: '4', name: 'Sanjay Gupta',  cgpa: 6.0, skills: ['React','Python'], internships: 1, placementStatus: 'ai_needed',  companyPlaced: '' },
          { _id: '5', name: 'Priya Sharma',  cgpa: 7.5, skills: ['Django','SQL'],   internships: 2, placementStatus: 'placed',     companyPlaced: 'Wipro' }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, [search, statusFilter, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch { alert('Delete failed'); }
  };

  return (
    <div className="fade-in">
      <div className="topbar">
        <div className="topbar-title">👥 Student Data List</div>
        <div className="topbar-right">
          <div className="search-box">
            <span>🔍</span>
            <input placeholder="Search name..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="avatar">AD</div>
        </div>
      </div>

      <div className="card">
        <div className="filters-bar">
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Filter:</span>
          <select className="filter-select" value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="placed">Placed</option>
            <option value="not_placed">Not Placed</option>
            <option value="applied">Applied</option>
            <option value="ai_needed">AI Needed</option>
          </select>
          <select className="filter-select">
            <option>Skill Search ▼</option>
            <option>React</option>
            <option>Python</option>
            <option>Java</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="spinner" style={{ borderTopColor: '#2e3daa', borderColor: 'rgba(46,61,170,0.2)', width: 32, height: 32, margin: '0 auto' }}></div>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👥</div><div className="empty-text">No students found</div></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>CGPA</th><th>Skills</th><th>Internships</th><th>Status</th><th>Company</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.cgpa}</td>
                    <td>
                      <div className="skill-tags">
                        {s.skills?.slice(0, 3).map(sk => (
                          <span key={sk} className={`skill-tag ${sk === 'React' ? 'react' : sk === 'Python' ? 'python' : sk === 'Java' ? 'java' : sk === 'JavaScript' ? 'js' : ''}`}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{s.internships || 'None'}</td>
                    <td>
                      <span className={STATUS_CLASS[s.placementStatus] || 'badge badge-blue'}>
                        {STATUS_LABELS[s.placementStatus] || s.placementStatus}
                      </span>
                    </td>
                    <td>{s.companyPlaced || '—'}</td>
                    <td>
                      <button onClick={() => handleDelete(s._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', fontSize: 16 }}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <span>Page {page} of {totalPages}</span>
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Previous</button>
          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
        </div>
      </div>
    </div>
  );
}
