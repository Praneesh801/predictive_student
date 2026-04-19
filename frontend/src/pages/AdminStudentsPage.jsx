import React, { useState, useEffect } from 'react';
import { getStudents, bulkInsertStudents, deleteStudent } from '../services/api';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkText, setBulkText] = useState('');
  const [batch, setBatch] = useState('2024');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const r = await getStudents({ limit: 100 });
      setStudents(r.data.students);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleBulkInsert = async () => {
    if (!bulkText.trim()) return;
    try {
      setLoading(true);
      
      // 1. Process the raw text into structured data
      // Expected format: Name, RollNumber, Email
      const lines = bulkText.split('\n').filter(l => l.trim());
      const studentData = lines.map(line => {
        const [name, roll, email] = line.split(',').map(s => s?.trim());
        return {
          name,
          rollNumber: roll,
          email,
          batch
        };
      });

      // 2. Run the bulk insertion API call
      await bulkInsertStudents(studentData);
      
      // 3. Update UI state and refresh list
      setMessage({ type: 'success', text: `Successfully inserted ${studentData.length} students` });
      setBulkText('');
      fetchStudents();
    } catch (err) {
      setMessage({ type: 'error', text: 'Bulk insert failed: ' + (err.response?.data?.message || err.message) });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      setMessage({ type: 'success', text: 'Student deleted successfully' });
      fetchStudents();
    } catch (err) {
      setMessage({ type: 'error', text: 'Deletion failed' });
    }
  };

  return (
    <div className="fade-in">
      <div className="topbar">
        <div className="topbar-title">👥 Student Management (Admin)</div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 20 }}>
          {message.text}
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* Left: Bulk Insert */}
        <div className="card">
          <div className="card-title">📥 Bulk Insert Students</div>
          <div className="form-group">
            <label className="form-label">Select Batch</label>
            <select className="form-control" value={batch} onChange={e => setBatch(e.target.value)}>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Paste CSV Data (Name, Roll, Email_ID)</label>
            <textarea className="form-control" rows={10} 
              placeholder="Amit Kumar, CS001, amit@test.com&#10;Sneha Rao, CS002, sneha@test.com"
              value={bulkText} onChange={e => setBulkText(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-full" onClick={handleBulkInsert} disabled={loading}>
            🚀 Bulk Upload
          </button>
        </div>

        {/* Right: Student List */}
        <div className="card">
          <div className="card-title">📋 Student List & Status</div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Email</th>
                  <th>Batch</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.rollNumber}</td>
                    <td>{s.email}</td>
                    <td>{s.batch}</td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: 11, borderColor: '#ef4444', color: '#ef4444' }}
                        onClick={() => handleDelete(s._id)}>
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
