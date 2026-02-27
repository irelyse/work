import React, { useState, useEffect } from 'react';
import api from '../api';
import { CreditCard, Download, Search, DollarSign, Calendar, Wallet } from 'lucide-react';

const Payments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [report, setReport] = useState([]);
    const [formData, setFormData] = useState({
        enrollment_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash'
    });

    useEffect(() => {
        api.get('/enrollments').then(res => setEnrollments(res.data));
        fetchReport();
    }, []);

    const fetchReport = () => api.get('/payment/report').then(res => setReport(res.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/payments', formData).then(() => {
            fetchReport();
            setFormData({ ...formData, amount: '' });
        });
    };

    return (
        <div>
            <div className="content-header">
                <div className="title-group">
                    <h1>Revenue & Payments</h1>
                    <p>Track school bus fee collections and outstanding balances</p>
                </div>
                <div className="header-tools">
                    <button className="btn btn-primary" onClick={() => window.print()} style={{ background: '#10b981' }}>
                        <Download size={18} /> Export Term Report
                    </button>
                </div>
            </div>

            <div className="form-container">
                <div className="form-title">
                    <CreditCard size={20} />
                    <span>Post New Payment</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-grid" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}>
                        <div className="input-group">
                            <label>Active Enrollment</label>
                            <select
                                value={formData.enrollment_id}
                                onChange={e => setFormData({ ...formData, enrollment_id: e.target.value })}
                                required
                            >
                                <option value="">Select student transport record...</option>
                                {enrollments.map(e => (
                                    <option key={e.id} value={e.id}>{e.student_name} - {e.route_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Amount Collected (RWF)</label>
                            <input
                                className="input-field"
                                type="number"
                                placeholder="50,000"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Payment Date</label>
                            <input
                                className="input-field"
                                type="date"
                                value={formData.payment_date}
                                onChange={e => setFormData({ ...formData, payment_date: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Method</label>
                            <select
                                value={formData.payment_method}
                                onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                            >
                                <option value="Cash">Physical Cash</option>
                                <option value="Mobile Money">Mobile Money (MoMo)</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit">
                        <DollarSign size={18} /> Record Transaction
                    </button>
                </form>
            </div>

            <div className="table-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div className="table-title">Term Financial Status</div>
                    <div className="search-bar" style={{ width: '250px' }}>
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Filter report..." />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Parent Contact</th>
                            <th>Route</th>
                            <th>Target Fee</th>
                            <th>Amount Paid</th>
                            <th>Balance</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map(r => (
                            <tr key={r.enrollment_id}>
                                <td style={{ fontWeight: '600' }}>{r.student_name}</td>
                                <td>{r.parent_name}</td>
                                <td>{r.route_name}</td>
                                <td>{r.monthly_fee.toLocaleString()} RWF</td>
                                <td style={{ color: '#10b981', fontWeight: 'bold' }}>{r.amount_paid.toLocaleString()} RWF</td>
                                <td style={{ color: r.balance > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                                    {r.balance.toLocaleString()} RWF
                                    {r.balance > 0 && <Wallet size={12} style={{ marginLeft: '5px' }} />}
                                </td>
                                <td>
                                    <span className={`badge badge-${r.status.toLowerCase()}`}>
                                        {r.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payments;
