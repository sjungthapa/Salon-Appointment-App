import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI, appointmentsAPI } from '../services/api';

function CreateAppointment() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    serviceId: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (err) {
      setError('Failed to fetch services');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        serviceId: formData.serviceId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        notes: formData.notes.trim()
      };

      await appointmentsAPI.create(data);
      setSuccess('Appointment booked successfully!');
      
      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        serviceId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
      });

      // Redirect to appointments page after 2 seconds
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Book Appointment</h1>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input
              type="text"
              name="customerName"
              className="form-input"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="Enter customer name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Customer Phone *</label>
            <input
              type="tel"
              name="customerPhone"
              className="form-input"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Service *</label>
            <select
              name="serviceId"
              className="form-input"
              value={formData.serviceId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a service --</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} - NPR {service.price} ({service.duration} min)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Appointment Date *</label>
            <input
              type="date"
              name="appointmentDate"
              className="form-input"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Appointment Time *</label>
            <input
              type="time"
              name="appointmentTime"
              className="form-input"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              name="notes"
              className="form-input"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Any special requests or notes..."
            />
          </div>

          <div className="actions">
            <button 
              type="submit" 
              className="btn btn-success" 
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
            <button 
              type="button" 
              className="btn" 
              onClick={() => navigate('/appointments')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAppointment;
