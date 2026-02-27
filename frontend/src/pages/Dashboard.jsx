import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, Bus, CheckCircle, Clock, Bell, HelpCircle, User } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_students: 0,
        total_routes: 0,
        total_payments: 0,
        outstanding_balance: 0
    });
    const [recentPayments, setRecentPayments] = useState([]);

    useEffect(() => {
        api.get('/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));

        api.get('/payment/report')
            .then(res => setRecentPayments(res.data.slice(0, 5)))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <div className="content-header">
                <div className="title-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="/bus-icon.png" alt="Bus" style={{ width: '45px', height: '45px' }} />
                        <h1>Classic Academy School</h1>
                    </div>
                    <p>Transportation Fees Management System</p>
                </div>
                <div className="header-tools">
                    <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                        <Bell size={20} color="#64748b" />
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                        <HelpCircle size={20} color="#64748b" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '10px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e3a8a' }}>John Doe</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Admin Account</div>
                        </div>
                        {/* Example icon of profile - exactly as requested */}
                        <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            border: '2px solid #3b82f6',
                            background: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <User size={24} color="#3b82f6" fill="#3b82f6" fillOpacity="0.2" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card blue">
                    <div className="stat-label">
                        <img src="/bus-icon.png" alt="Bus" style={{ width: '24px', height: '24px' }} />
                        <span>Total Students Using Bus</span>
                    </div>
                    <div className="stat-value">{stats.total_students}</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-label">
                        <img src="/bus-icon-green.png" alt="Green Bus" style={{ width: '24px', height: '24px' }} />
                        <span>Total Bus Routes</span>
                    </div>
                    <div className="stat-value">{stats.total_routes}</div>
                </div>

                <div className="stat-card cyan">
                    <div className="stat-label">
                        <CheckCircle size={20} color="#06b6d4" />
                        <span>Paid This Month</span>
                    </div>
                    <div className="stat-value">
                        {stats.total_payments.toLocaleString()}
                        <span className="stat-currency">RWF</span>
                    </div>
                </div>

                <div className="stat-card red">
                    <div className="stat-label">
                        <Clock size={20} color="#ef4444" />
                        <span>Pending Payments</span>
                    </div>
                    <div className="stat-value" style={{ color: '#ef4444' }}>
                        {stats.outstanding_balance.toLocaleString()}
                        <span className="stat-currency">RWF</span>
                    </div>
                </div>
            </div>

            <div className="table-container" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="table-title">Recent Payments</div>
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Parent</th>
                            <th>Month</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentPayments.length > 0 ? recentPayments.map((p, idx) => (
                            <tr key={idx}>
                                <td>{p.student_name}</td>
                                <td>{p.parent_name}</td>
                                <td>January</td>
                                <td>{p.amount_paid.toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>RWF</span></td>
                                <td>
                                    <span className={`badge badge-${p.status === 'Paid' ? 'paid' : 'pending'}`}>
                                        {p.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', opacity: 0.5 }}>No recent payments recorded</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <a href="/payments" className="btn-view-all">View All Payments</a>
            </div>
        </div>
    );
};

export default Dashboard;
