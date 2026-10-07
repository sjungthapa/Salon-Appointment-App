import express from 'express';
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';

const router = express.Router();

// GET /api/appointments - Get all appointments
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter).populate('serviceId');

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error, failed to retrieve appointments"})
  }

});

// POST /api/appointments - Create a new appointment
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, serviceId, appointmentDate, appointmentTime, notes} = req.body;

    if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
      return res.status(400).json({ message: "Customer name is required"})
    }

    if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.trim() === ''){
      return res.status(400).json({ message: "Customer phone is required"})
    }

    if (!serviceId) {
      return res.status(400).json({ message: "Service is required" })
    }
    if (!appointmentDate){
      return res.status(400).json({ message: "Appointment Date is required" })
    }
    if (!appointmentTime){
      return res.status(400).json({ message: "Appointment Time is required"})
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found"})
    }

    const existingAppointment = await Appointment.findOne({
      serviceId: serviceId,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      status: { $ne: 'Cancelled'}
    });

    if (existingAppointment) {
      return res.status(400).json({ message :"This time span is already booked"})
    }

    // create new appointment
    const newAppointment = new Appointment({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      serviceId,
      appointmentDate,
      appointmentTime,
      notes: notes || '',
      status: 'Pending'
    })

    const savedAppointment = await newAppointment.save();

    //populate service details before returning

    const populatedAppointment = await Appointment.findById(savedAppointment._id).populate('serviceId');

    res.status(201).json(populatedAppointment);
  } catch (error){
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error, failed to create appointment."})
  }
});

// PATCH /api/appointments/:id/status - Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be: Pending, Confirmed, Completed, or Cancelled" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true, runValidators: true }
    ).populate('serviceId');

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(updatedAppointment);

  } catch (error) {
    console.error("Error updating appointment status:", error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid appointment ID format" });
    }

    res.status(500).json({ message: "Server error, failed to update appointment status" });
  }
});

// DELETE /api/appointments/:id - Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment deleted successfully",
      id: appointmentId
    });

  } catch (error) {
    console.error("Error deleting appointment:", error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid appointment ID format" });
    }

    res.status(500).json({ message: "Server error, failed to delete appointment" });
  }
});

export default router;
