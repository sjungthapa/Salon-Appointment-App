import React, { useState, useEffect } from 'react';
import { appointmentsAPI } from '../services/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAll(statusFilter);
      setAppointments(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentsAPI.updateStatus(id, newStatus);
      fetchAppointments(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentsAPI.delete(id);
        fetchAppointments();
      } catch (err) {
        setError('Failed to delete appointment');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'Pending': 'status-pending',
      'Confirmed': 'status-confirmed',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || '';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Appointments</h1>
        
        <div className="filter-controls">
          <label>Filter by Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">No appointments found</td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.customerName}</td>
                  <td>{appointment.customerPhone}</td>
                  <td>{appointment.serviceId?.name || 'N/A'}</td>
                  <td>{formatDate(appointment.appointmentDate)}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDelete(appointment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;
