import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// GET /api/services - Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({})

    res.json(services);
  } catch (error){
    console.error("Error fetching services:", error)

    res.status(500).json({ message: "Server error, failed to retrieve services."})
  }
  
});

// POST /api/services - Create a new service
router.post('/', async (req, res) => {
  try {
    const {name, price, duration } = req.body;

    if (!name || typeof name !== "string" || name.trim() === ''){
      return res.status(400).json({ message: "Name is required"})
    }

    if (price === undefined || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: "Price is required"})
    }

    if (duration === undefined || typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ message: "Duration is required"})
    }

    const newService = new Service({
      name: name.trim(),
      price,
      duration
    });

    const savedService = await newService.save()

    res.status(201).json(savedService)

  } catch(error){
    console.error("Error creating service:", error)
    res.status(500).json({ message: "Server error, failed to create service."})
  }
});

// PUT /api/services/:id - Update a service
router.put('/:id', async (req, res) => {
  try {
    const {name, price, duration } = req.body;

    if (!name || typeof name !== "string" || name.trim() === ''){
      return res.status(400).json({ message: "Name is required"})
    }

    if (price === undefined || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: "Price is required"})
    }

    if (duration === undefined || typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ message: "Duration is required"})
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), price, duration },
      {new: true, runValidators: true}
    );

    if (!updatedService){
      return res.status(404).json({message: "Service not found."});
    }

    res.json(updatedService)

  } catch (error) {
    console.error("Cannot update service:", error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid service ID format."})
    }

    res.status(500).json({message: "Server error"})
  }
});

// DELETE /api/services/:id - Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;

    const deletedService = await Service.findByIdAndDelete(serviceId);

    if(!deletedService){
      return res.status(404).json({ message: "Service not found."});

    }

    res.json({
      message: "Service deleted successfully",
      id: serviceId
    })
  } catch (error){
    console.error("Error deleting service:", error)

    if(error.kind === 'ObjectId'){
      return res.status(400).json({ message: "Invalid service ID format"});

    }
    res.status(500).json({ message: "Server error, failed to delete service."})
  }
});

export default router;
