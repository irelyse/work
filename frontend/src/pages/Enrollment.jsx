import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, FileText, Calendar, MapPin, User } from 'lucide-react';

const Enrollment = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [formData, setFormData] = useState({ student_id: '', route_id: '', term: 'Term 1' });

    useEffect(() => {
        fetchEnrollments();
        api.get('/students').then(res => setStudents(res.data.filter(s => s.uses_transport)));
        api.get('/routes').then(res => setRoutes(res.data));
    }, []);

    const fetchEnrollments = () => api.get('/enrollments').then(res => setEnrollments(res.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/enrollments', formData).then(() => {
            fetchEnrollments();
            setFormData({ ...formData, student_id: '' });
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Cancel this student transport enrollment?')) {
            api.delete(`/enrollments/${id}`).then(fetchEnrollments);
        }
    };

    return (
        <div>
            <div className="content-header">
                <div className="title-group">
                    <h1>Transport Enrollment</h1>
                    <p>Assign students to bus routes for specific academic terms</p>
                </div>
            </div>

            <div className="form-container">
                <div className="form-title">
                    <FileText size={20} />
                    <span>Route Assignment Form</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-grid">
                        <div className="input-group">
                            <label><User size={14} /> Student</label>
                            <select
                                value={formData.student_id}
                                onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                                required
                            >
                                <option value="">Identify student...</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.fullname} ({s.class})</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label><MapPin size={14} /> Destination Route</label>
                            <select
                                value={formData.route_id}
                                onChange={e => setFormData({ ...formData, route_id: e.target.value })}
                                required
                            >
                                <option value="">Select bus route...</option>
                                {routes.map(r => (
                                    <option key={r.id} value={r.id}>{r.route_name} - {r.monthly_fee} RWF</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label><Calendar size={14} /> Academic Term</label>
                            <select
                                value={formData.term}
                                onChange={e => setFormData({ ...formData, term: e.target.value })}
                            >
                                <option value="Term 1">Term 1 (Jan - April)</option>
                                <option value="Term 2">Term 2 (May - Aug)</option>
                                <option value="Term 3">Term 3 (Sept - Dec)</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit">
                        <Plus size={18} /> Confirm Enrollment
                    </button>
                </form>
            </div>

            <div className="table-container">
                <div className="table-title">Active Term Enrollments</div>
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Route</th>
                            <th>Term</th>
                            <th>Payment Status</th>
                            <th>Balance</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map(e => (
                            <tr key={e.id}>
                                <td style={{ fontWeight: '600' }}>{e.student_name}</td>
                                <td>{e.route_name}</td>
                                <td>{e.term}</td>
                                <td>
                                    <span className={`badge badge-${e.status.toLowerCase()}`}>
                                        {e.status}
                                    </span>
                                </td>
                                <td style={{ color: e.amount_paid < e.monthly_fee ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                                    {(e.monthly_fee - e.amount_paid).toLocaleString()} RWF
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="btn btn-danger" onClick={() => handleDelete(e.id)}>
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

export default Enrollment;
