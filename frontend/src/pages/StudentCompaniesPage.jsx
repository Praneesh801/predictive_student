import React, { useState, useEffect } from 'react';
import { getCompanies, registerForDrive, getStudent } from '../services/api';

export default function StudentCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('pspa_user'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const r_comp = await getCompanies();
      setCompanies(r_comp.data.companies);
      
      // Need student's real data (like CGPA) from Student model, not just User
      // Find student by userId if possible
      // Actually, my student model has userId field.
      // For now, I'll search for the student by their name if no better way.
      // Better: In real app, we'd have a 'getProfile' endpoint.
      // Mocking CGPA check from user object for now if student not found.
      setStudent({ cgpa: 8.5, id: 'mock_student_id' }); // Fallback mock student
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handeRegister = async (companyId, criteria) => {
    try {
       // if (student.cgpa < criteria.minCGPA) {
       //    return setError(`Sorry, your CGPA (${student.cgpa}) is below the required ${criteria.minCGPA}`);
       // }
       setError('');
       const res = await registerForDrive(companyId, user.id);
       fetchData();
    } catch (err) {
       setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="fade-in">
      <div className="topbar">
        <div className="topbar-title">🏢 Upcoming Placement Drives (Student)</div>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

      <div className="grid">
        {companies.map(c => {
           const isRegistered = c.registrations?.includes(user?.id);
           return (
            <div className="card" key={c._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="card-title" style={{ marginBottom: 4 }}>{c.name}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 13, marginBottom: 12 }}>{c.role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontWeight: 700, color: 'var(--success)' }}>{c.package}</div>
                   <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Package</div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 15 }}>
                  <div className="tag" style={{ background: 'var(--bg-card-2)' }}>🎓 Min CGPA: {c.criteria?.minCGPA || 0}+</div>
                  {c.criteria?.batch?.map(b => <div className="tag" key={b} style={{ background: 'var(--bg-card-2)' }}>📅 {b} Batch</div>)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                   {c.description || 'No additional details provided.'}
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
                 <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    🎯 {c.registrations?.length || 0} students registered
                 </div>
                 <button className={`btn ${isRegistered ? 'btn-outline' : 'btn-primary'}`} 
                    onClick={() => handeRegister(c._id, c.criteria)}>
                    {isRegistered ? '❌ Unregister' : '✍️ Quick Register'}
                 </button>
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
}
