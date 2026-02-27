import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserSquare, MapPin, CreditCard, FileText, Settings, Bus } from 'lucide-react';

const Navbar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/bus-icon.png" alt="Bus Logo" style={{ width: '40px', height: '40px' }} />
                    <span className="brand">Classic Academy</span>
                </div>
                <span className="sub-brand">Transportation Management</span>
            </div>

            <div className="nav-links">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                    <LayoutDashboard size={20} /> Dashboard
                </NavLink>
                <NavLink to="/students" className={({ isActive }) => isActive ? 'active' : ''}>
                    <Users size={20} /> Students
                </NavLink>
                <NavLink to="/parents" className={({ isActive }) => isActive ? 'active' : ''}>
                    <UserSquare size={20} /> Parents
                </NavLink>
                <NavLink to="/routes" className={({ isActive }) => isActive ? 'active' : ''}>
                    <MapPin size={20} /> Bus Routes
                </NavLink>
                <NavLink to="/payments" className={({ isActive }) => isActive ? 'active' : ''}>
                    <CreditCard size={20} /> Payments
                </NavLink>
                <NavLink to="/enrollments" className={({ isActive }) => isActive ? 'active' : ''}>
                    <FileText size={20} /> Enrollments
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                    <Settings size={20} /> Settings
                </NavLink>
            </div>

            <div className="sidebar-footer">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} />
                        <span>Rulindo District</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
                        <span>Ntarabana Sector</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
