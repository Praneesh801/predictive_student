# Predictive Student Placement Analysis System - Backend

This is the backend API for the Predictive Student Placement Analysis System built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Support for students, staff, and admin roles
- **Student Data Management**: Store and update student academic records
- **Placement Prediction**: ML-based placement probability calculation
- **Placement Tracking**: Manage placement drives and outcomes
- **Analytics & Reporting**: Generate insights about placement trends
- **Notifications**: Send alerts to students about placement updates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, Helmet for security headers
- **Validation**: express-validator

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── userController.js     # User management
│   │   ├── studentController.js  # Student data management
│   │   ├── placementController.js# Placement records
│   │   ├── notificationController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   └── auth.js               # JWT & role middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── PlacementRecord.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── placementRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   └── helpers.js            # Utility functions
│   └── server.js                 # Main application file
├── .env.example                  # Environment variables template
├── package.json
└── README.md
```

## Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/placement_system
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. **Ensure MongoDB is Running**
   - Start MongoDB service on your machine
   - Default: `mongodb://localhost:27017`

## Running the Backend

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:userId/role` - Update user role (admin only)
- `DELETE /api/users/:userId` - Delete user (admin only)

### Students
- `POST /api/students` - Create student record
- `GET /api/students` - Get all students
- `GET /api/students/:studentId` - Get student details
- `PUT /api/students/:studentId` - Update student data
- `GET /api/students/eligible/list` - Get eligible students
- `DELETE /api/students/:studentId` - Delete student

### Placements
- `POST /api/placements` - Create placement record
- `GET /api/placements` - Get all placement records
- `GET /api/placements/:recordId` - Get specific record
- `PUT /api/placements/:recordId` - Update placement status
- `GET /api/placements/student/:studentId` - Get student placements
- `DELETE /api/placements/:recordId` - Delete placement record

### Notifications
- `POST /api/notifications` - Create notification
- `GET /api/notifications/user/:userId` - Get user notifications
- `GET /api/notifications/user/:userId/unread` - Get unread notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `DELETE /api/notifications/:notificationId` - Delete notification

### Analytics
- `GET /api/analytics/placement-stats` - Placement statistics
- `GET /api/analytics/student-stats` - Student statistics
- `GET /api/analytics/prediction-accuracy` - Prediction accuracy
- `GET /api/analytics/trend-analysis` - Placement trends

## Models

### User
- name, email, password, role, isActive, timestamps

### Student
- userId, rollNumber, department, cgpa, percentages, skills, certificates
- internships, projects, placementEligible, placementStatus
- predictedPlacementProbability

### PlacementRecord
- studentId, companyName, position, salaryOffered, driveDate
- placementDate, status, predictedOutcome, actualOutcome, accuracy

### Notification
- userId, title, message, type, isRead, notificationMethod, timestamps

## Placement Prediction Algorithm

The system calculates placement probability based on:
- CGPA (30%)
- 12th percentage (15%)
- 10th percentage (10%)
- Skills count (20%)
- Internships count (15%)
- Projects count (10%)

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Role-Based Access Control

- **Student**: Can view their own data
- **Staff**: Can manage student data and placements
- **Admin**: Full access to all resources

## Error Handling

All endpoints return consistent error responses:
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token expiration (7 days)
- CORS enabled
- Helmet security headers
- Input validation with express-validator

## Future Enhancements

- Integration of advanced ML models
- Real-time notifications with WebSockets
- Email notifications
- Rate limiting
- API documentation with Swagger/OpenAPI

## License

MIT

## Contact

For questions or support, contact the development team.
