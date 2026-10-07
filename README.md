# Appointment Booking System

A full-stack salon appointment booking application built with React and Express.

## Features

### Services Management
- View all services
- Add new services
- Edit existing services
- Delete services
- Each service has: name, price (NPR), and duration (minutes)

### Appointment Booking
- Book appointments with customer details
- Select from available services
- Choose date and time
- Add optional notes
- Prevents double booking (conflict detection)

### Appointment Management
- View all appointments in a table
- Filter appointments by status (Pending, Confirmed, Completed, Cancelled)
- Update appointment status
- Delete appointments
- Color-coded status badges

## Tech Stack

### Frontend
- React 18
- React Router (for navigation)
- Axios (for API calls)
- Vite (build tool)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Appointment Booking System"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
MONGODB_URI="mongodb://localhost:27017/appointment_booking"
PORT=5000
NODE_ENV=development
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
```

**For MongoDB Atlas (cloud):**
```env
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/appointment_booking"
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas (cloud) - no local installation needed.

### 5. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## API Endpoints

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create a new service
- `PUT /api/services/:id` - Update a service
- `DELETE /api/services/:id` - Delete a service

### Appointments
- `GET /api/appointments` - Get all appointments (supports status filter)
- `POST /api/appointments` - Create a new appointment
- `PATCH /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Delete an appointment

## Database Models

### Service Model
```javascript
{
  name: String (required),
  price: Number (required, min: 0),
  duration: Number (required, min: 1) // in minutes
}
```

### Appointment Model
```javascript
{
  customerName: String (required),
  customerPhone: String (required),
  serviceId: ObjectId (required, ref: 'Service'),
  appointmentDate: Date (required),
  appointmentTime: String (required),
  notes: String (optional),
  status: String (enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending')
}
```

## Business Rules

### Validation
- All required fields must be filled
- Service price must be positive
- Service duration must be greater than zero
- Appointment must reference an existing service

### Appointment Conflict Detection
- Prevents double booking for the same service at the same date and time
- Cancelled appointments are not counted as conflicts

## Usage

1. **Manage Services**
   - Navigate to Services page (home)
   - Add services like "Haircut", "Facial", "Hair Coloring"
   - Edit or delete existing services

2. **Book Appointment**
   - Click "Book Appointment" in navigation
   - Fill in customer details
   - Select a service
   - Choose date and time
   - Submit the booking

3. **Manage Appointments**
   - View all appointments in Appointments page
   - Filter by status (All, Pending, Confirmed, Completed, Cancelled)
   - Update status using dropdown
   - Delete appointments if needed

## Development

- Backend uses `nodemon` for auto-reload on file changes
- Frontend uses Vite HMR (Hot Module Replacement)
- Both servers restart automatically when you save changes

## Testing

You can test the APIs using:
- Thunder Client (VS Code extension)
- Postman
- Browser (for GET requests)

**Example: Create a Service**
```
POST http://localhost:5000/api/services
Content-Type: application/json

{
  "name": "Haircut",
  "price": 500,
  "duration": 30
}
```

**Example: Create an Appointment**
```
POST http://localhost:5000/api/appointments
Content-Type: application/json

{
  "customerName": "Ram Sharma",
  "customerPhone": "9841234567",
  "serviceId": "SERVICE_ID_HERE",
  "appointmentDate": "2026-10-15",
  "appointmentTime": "10:00 AM",
  "notes": "First time customer"
}
```

## License

MIT
