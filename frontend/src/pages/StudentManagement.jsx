import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Users, Search, CheckCircle, XCircle } from 'lucide-react';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [parents, setParents] = useState([]);
    const [formData, setFormData] = useState({ fullname: '', class_name: '', parent_id: '', uses_transport: true });

    useEffect(() => {
        fetchStudents();
        fetchParents();
    }, []);

    const fetchStudents = () => api.get('/students').then(res => setStudents(res.data));
    const fetchParents = () => api.get('/parents').then(res => setParents(res.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/students', formData).then(() => {
            fetchStudents();
            setFormData({ fullname: '', class_name: '', parent_id: '', uses_transport: true });
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Remove student record?')) {
            api.delete(`/students/${id}`).then(fetchStudents);
        }
    };

    return (
        <div>
            <div className="content-header">
                <div className="title-group">
                    <h1>Student Records</h1>
                    <p>Manage school bus users and parent links</p>
                </div>
                <div className="header-tools">
                    <div className="search-bar">
                        <Search size={18} color="#94a3b8" />
                        <input type="text" placeholder="Search students..." />
                    </div>
                </div>
            </div>

            <div className="form-container">
                <div className="form-title">
                    <Users size={20} />
                    <span>Register New Student</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-grid" style={{ gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr' }}>
                        <div className="input-group">
                            <label>Student Full Name</label>
                            <input
                                className="input-field"
                                placeholder="e.g. Alice Twizeyimana"
                                value={formData.fullname}
                                onChange={e => setFormData({ ...formData, fullname: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Academic Class</label>
                            <input
                                className="input-field"
                                placeholder="e.g. P5, S2"
                                value={formData.class_name}
                                onChange={e => setFormData({ ...formData, class_name: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Assign Parent/Guardian</label>
                            <select
                                value={formData.parent_id}
                                onChange={e => setFormData({ ...formData, parent_id: e.target.value })}
                                required
                            >
                                <option value="">Select a registered parent</option>
                                {parents.map(p => (
                                    <option key={p.parent_id} value={p.parent_id}>{p.full_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Transport Access</label>
                            <div className="status-row" style={{ marginTop: '10px' }}>
                                <input
                                    type="checkbox"
                                    style={{ width: '20px', height: '20px' }}
                                    checked={formData.uses_transport}
                                    onChange={e => setFormData({ ...formData, uses_transport: e.target.checked })}
                                />
                                <span>Uses Bus</span>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit">
                        <Plus size={18} /> Register Student
                    </button>
                </form>
            </div>

            <div className="table-container">
                <div className="table-title">Full Student List</div>
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Parent/Guardian</th>
                            <th>Bus Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(s => (
                            <tr key={s.id}>
                                <td style={{ fontWeight: '600' }}>{s.fullname}</td>
                                <td>{s.class}</td>
                                <td>{s.parent_name}</td>
                                <td>
                                    {s.uses_transport ?
                                        <span className="badge badge-paid" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                            <CheckCircle size={14} /> Active
                                        </span> :
                                        <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#f1f5f9', color: '#64748b' }}>
                                            <XCircle size={14} /> Inactive
                                        </span>
                                    }
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentManagement;
