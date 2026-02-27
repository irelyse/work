import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, MapPin, Navigation } from 'lucide-react';

const BusRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [formData, setFormData] = useState({ route_name: '', driver_name: '', monthly_fee: '' });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = () => api.get('/routes').then(res => setRoutes(res.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/routes', formData).then(() => {
            fetchRoutes();
            setFormData({ route_name: '', driver_name: '', monthly_fee: '' });
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Retire this bus route?')) {
            api.delete(`/routes/${id}`).then(fetchRoutes);
        }
    };

    return (
        <div>
            <div className="content-header">
                <div className="title-group">
                    <h1>Transport Routes</h1>
                    <p>Configure bus paths, drivers, and monthly pricing</p>
                </div>
            </div>

            <div className="form-container">
                <div className="form-title">
                    <Navigation size={20} />
                    <span>Create New Transport Route</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-grid">
                        <div className="input-group">
                            <label>Route Designation</label>
                            <input
                                className="input-field"
                                placeholder="e.g. Kigali-Rulindo Center"
                                value={formData.route_name}
                                onChange={e => setFormData({ ...formData, route_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Assigned Driver</label>
                            <input
                                className="input-field"
                                placeholder="e.g. Samuel Kalisa"
                                value={formData.driver_name}
                                onChange={e => setFormData({ ...formData, driver_name: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Monthly Fee (RWF)</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="input-field"
                                    type="number"
                                    placeholder="150,000"
                                    style={{ paddingLeft: '45px' }}
                                    value={formData.monthly_fee}
                                    onChange={e => setFormData({ ...formData, monthly_fee: e.target.value })}
                                    required
                                />
                                <span style={{ position: 'absolute', left: '15px', top: '12px', fontWeight: 'bold', color: '#94a3b8' }}>$</span>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit">
                        <Plus size={18} /> Launch Route
                    </button>
                </form>
            </div>

            <div className="table-container">
                <div className="table-title">Active Fleet Routes</div>
                <table>
                    <thead>
                        <tr>
                            <th>Route Name</th>
                            <th>Bus Driver</th>
                            <th>Cost per Term</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.map(r => (
                            <tr key={r.id}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}>
                                    <MapPin size={18} color="#3b82f6" />
                                    {r.route_name}
                                </td>
                                <td>{r.driver_name}</td>
                                <td style={{ color: '#10b981', fontWeight: '700' }}>
                                    {r.monthly_fee?.toLocaleString()} <span style={{ fontSize: '0.7rem' }}>RWF</span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="btn btn-danger" onClick={() => handleDelete(r.id)}>
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

export default BusRoutes;
