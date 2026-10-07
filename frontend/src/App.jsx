import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Services from './pages/Services';
import Appointments from './pages/Appointments';
import CreateAppointment from './pages/CreateAppointment';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">Salon Appointment System</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Services</Link>
              <Link to="/appointments" className="nav-link">Appointments</Link>
              <Link to="/book" className="nav-link nav-link-primary">Book Appointment</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Services />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/book" element={<CreateAppointment />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
