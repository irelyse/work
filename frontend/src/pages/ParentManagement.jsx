import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, UserSquare, Search, Filter } from 'lucide-react';

const ParentManagement = () => {
    const [parents, setParents] = useState([]);
    const [formData, setFormData] = useState({ full_name: '', phone: '', email: '', address: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchParents();
    }, []);

    const fetchParents = () => {
        api.get('/parents').then(res => setParents(res.data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            api.put(`/parents/${editingId}`, formData).then(() => {
                fetchParents();
                setFormData({ full_name: '', phone: '', email: '', address: '' });
                setEditingId(null);
            });
        } else {
            api.post('/parents', formData).then(() => {
                fetchParents();
                setFormData({ full_name: '', phone: '', email: '', address: '' });
            });
        }
    };

    const handleEdit = (parent) => {
        setEditingId(parent.parent_id);
        setFormData({
            full_name: parent.full_name,
            phone: parent.phone || '',
            email: parent.email || '',
            address: parent.address || ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ full_name: '', phone: '', email: '', address: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this parent record?')) {
            api.delete(`/parents/${id}`).then(fetchParents);
        }
    };

    return (
        <div>
            <div className="content-header">
                <div className="title-group">
                    <h1>Parent Management</h1>
                    <p>Register and manage parent contact information</p>
                </div>
                <div className="header-tools">
                    <div className="search-bar">
                        <Search size={18} color="#94a3b8" />
                        <input type="text" placeholder="Search parents..." />
                    </div>
                </div>
            </div>

            <div className="form-container">
                <div className="form-title">
                    <UserSquare size={20} />
                    <span>{editingId ? 'Edit Parent Record' : 'Add New Parent'}</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-grid">
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                className="input-field"
                                placeholder="e.g. Jean Mugabo"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Phone Number</label>
                            <input
                                className="input-field"
                                placeholder="+250 788 000 000"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                className="input-field"
                                placeholder="name@example.com"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Residential Address</label>
                            <input
                                className="input-field"
                                placeholder="Street/District"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-primary" type="submit">
                            {editingId ? 'Update Parent Record' : 'Save Parent Record'}
                        </button>
                        {editingId && (
                            <button className="btn" type="button" onClick={cancelEdit} style={{ background: '#f1f5f9', color: '#475569' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="table-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div className="table-title">Registered Parents</div>
                    <button className="btn" style={{ background: '#f1f5f9', color: '#475569' }}>
                        <Filter size={16} /> Filter
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Parent Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parents.map(p => (
                            <tr key={p.parent_id}>
                                <td style={{ fontWeight: '600' }}>{p.full_name}</td>
                                <td>{p.phone}</td>
                                <td>{p.email}</td>
                                <td>{p.address}</td>
                                <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button className="btn" onClick={() => handleEdit(p)} style={{ background: '#f1f5f9', color: '#475569', padding: '8px' }}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(p.parent_id)} style={{ padding: '8px' }}>
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

export default ParentManagement;
