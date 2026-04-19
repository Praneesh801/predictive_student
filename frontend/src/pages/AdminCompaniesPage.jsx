import React, { useState, useEffect } from 'react';
import { getCompanies, createCompany, deleteCompany } from '../services/api';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
     name: '', role: '', package: '', criteria: { minCGPA: 0, minSkills: [], batch: ['2024'] }, description: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const r = await getCompanies();
      setCompanies(r.data.companies);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createCompany(form);
      setForm({ name: '', role: '', package: '', criteria: { minCGPA: 0, minSkills: [], batch: ['2024'] }, description: '' });
      fetchCompanies();
    } catch (err) { alert('Failed to create company drive'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteCompany(id);
      fetchCompanies();
    } catch (err) { alert('Failed to delete'); }
  };

  return (
    <div className="fade-in">
      <div className="topbar">
          <div className="topbar-title">🏢 Company Registration (Admin)</div>
      </div>

      <div className="grid">
        {/* Form */}
        <div className="card">
          <div className="card-title">🆕 Register Upcoming Placement Company</div>
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input className="form-control" required placeholder="Google, TCS, etc."
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input className="form-control" required placeholder="Software Engineer"
                  value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Package (LPA)</label>
                <input className="form-control" placeholder="6.5 LPA"
                  value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Min CGPA Criteria</label>
                <input className="form-control" type="number" step="0.1" 
                  value={form.criteria.minCGPA} onChange={e => setForm({ ...form, criteria: { ...form.criteria, minCGPA: parseFloat(e.target.value) }})} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Batch (Comma separated)</label>
              <input className="form-control" placeholder="2024, 2025" 
                value={form.criteria.batch?.join(', ')} onChange={e => setForm({ ...form, criteria: { ...form.criteria, batch: e.target.value.split(',').map(s => s.trim()) }})} />
            </div>

            <div className="form-group">
              <label className="form-label">Description / Eligibility Details</label>
              <textarea className="form-control" rows={4} placeholder="About the company and recruitment phases..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              🚀 Post Recruitment Drive
            </button>
          </form>
        </div>

        {/* List */}
        <div className="card">
           <div className="card-title">📋 Upcoming Placement Drives</div>
           <div className="table-container">
             <table className="table">
               <thead>
                 <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Package</th>
                    <th>Criteria (CGPA)</th>
                    <th>Registered</th>
                    <th>Action</th>
                 </tr>
               </thead>
               <tbody>
                  {companies.map(c => (
                    <tr key={c._id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.role}</td>
                      <td>{c.package}</td>
                      <td>{c.criteria.minCGPA || 0}+</td>
                      <td>{c.registrations?.length || 0} Students</td>
                      <td>
                        <button className="btn btn-outline" style={{ color: 'var(--error)', border: '1px solid var(--error)', padding: '4px 8px', fontSize: 11 }}
                          onClick={() => handleDelete(c._id)}>
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
