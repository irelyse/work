import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ParentManagement from './pages/ParentManagement';
import StudentManagement from './pages/StudentManagement';
import BusRoutes from './pages/BusRoutes';
import Enrollment from './pages/Enrollment';
import Payments from './pages/Payments';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/parents" element={<ParentManagement />} />
            <Route path="/students" element={<StudentManagement />} />
            <Route path="/routes" element={<BusRoutes />} />
            <Route path="/enrollments" element={<Enrollment />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </main>

        {/* Global Floating Logout at the Bottom Right */}
        <div className="logout-fixed">
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
    </Router>
  );
}

export default App;
