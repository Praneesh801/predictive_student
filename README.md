# Predictive Student Placement Analysis System

A comprehensive full-stack application designed to analyze student academic data and predict placement outcomes using analytical models. This system helps educational institutions, placement cells, and students make data-driven decisions to improve placement success rates.

## Project Overview

This project is based on the Software Requirements Specification (SRS) for a Predictive Student Placement Analysis System developed by Praneesh K (7376232IT223).

### Key Objectives
- Analyze student academic data, skills, and historical placement records
- Predict placement probability using analytical models
- Provide role-based access and visualization
- Track placement outcomes and generate reports
- Notify stakeholders about relevant updates

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│              (localhost:3000)                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│               Backend (Node.js + Express)                    │
│              (localhost:5000)                                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Routes: Auth, Users, Students, Placements,             │ │
│  │         Notifications, Analytics                        │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ MongoDB Connection
                     │
┌────────────────────▼────────────────────────────────────────┐
│               MongoDB Database                               │
│         (localhost:27017)                                   │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Core Modules

1. **Authentication and Role Management Module**
   - User registration and login
   - Role assignment (Student, Staff, Admin)
   - Secure JWT-based access control

2. **Student Data Management Module**
   - Add and update student academic records
   - Enter placement and skill-related data
   - Track achievements and certifications

3. **Placement Assignment Module**
   - Assign students to eligible companies
   - Map students to placement drives
   - Categorize based on prediction results

4. **Placement Resolution Module**
   - Evaluate placement outcomes
   - Update final placement status
   - Compare predicted vs actual results

5. **Reporting and Analytics Module**
   - Generate placement prediction reports
   - Display graphs and statistical insights
   - Analyze historical placement trends

6. **Notification Module**
   - Notify students about eligibility
   - Alerts for placement drives
   - Email or in-app notifications

### User Roles

- **Students**: View predictions, track placement status, receive notifications
- **Staff (Placement Cell)**: Manage student data, update placements, create drives
- **Admins**: Configure system, manage users, view comprehensive analytics

## Technology Stack

### Frontend
- **React 18.2**: UI library
- **Vite**: Modern build tool
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Chart.js**: Data visualization
- **React Icons**: Icon library
- **CSS3**: Styling with custom properties

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM library
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Helmet**: Security headers

### Database
- **MongoDB**: Document-oriented database
- **Collections**: Users, Students, PlacementRecords, Notifications

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Git

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/placement_system
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Start MongoDB:
   ```bash
   mongod
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open browser: `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout

### User Endpoints
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `GET /users` - Get all users (admin)
- `PUT /users/:userId/role` - Update role (admin)
- `DELETE /users/:userId` - Delete user (admin)

### Student Endpoints
- `POST /students` - Create student record
- `GET /students` - List all students
- `GET /students/:studentId` - Get student details
- `PUT /students/:studentId` - Update student
- `GET /students/eligible/list` - Get eligible students
- `DELETE /students/:studentId` - Delete student

### Placement Endpoints
- `POST /placements` - Create placement record
- `GET /placements` - List all placements
- `GET /placements/:recordId` - Get placement details
- `PUT /placements/:recordId` - Update placement
- `GET /placements/student/:studentId` - Get student placements
- `DELETE /placements/:recordId` - Delete placement

### Analytics Endpoints
- `GET /analytics/placement-stats` - Placement statistics
- `GET /analytics/student-stats` - Student statistics
- `GET /analytics/prediction-accuracy` - Prediction accuracy
- `GET /analytics/trend-analysis` - Trend analysis

## Placement Prediction Algorithm

The system calculates placement probability based on weighted factors:

$$\text{Probability} = 0.30 \times \frac{\text{CGPA}}{10} + 0.15 \times \frac{\text{12th\%}}{100} + 0.10 \times \frac{\text{10th\%}}{100}$$
$$+ 0.20 \times \min\left(\frac{\text{Skills}}{10}, 1\right) + 0.15 \times \min\left(\frac{\text{Internships}}{3}, 1\right) + 0.10 \times \min\left(\frac{\text{Projects}}{5}, 1\right)$$

### Weighted Factors
- CGPA: 30%
- 12th Grade Percentage: 15%
- 10th Grade Percentage: 10%
- Skills Count: 20%
- Internships Count: 15%
- Projects Count: 10%

## File Structure

```
placement-mini project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   ├── .gitignore
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .gitignore
│   └── README.md
│
└── README.md (this file)
```

## Usage Examples

### 1. Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create Student Record
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "userId": "userId",
    "rollNumber": "CS001",
    "department": "Computer Science",
    "cgpa": 8.5,
    "tenthPercentage": 92,
    "twelfthPercentage": 88,
    "skills": ["Python", "Java", "JavaScript"]
  }'
```

## Testing

### Backend Testing
```bash
# Run with nodemon for hot reload
npm run dev

# Check health
curl http://localhost:5000/api/health
```

### Frontend Testing
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Security Considerations

1. **Authentication**: JWT tokens with 7-day expiration
2. **Password Security**: Bcryptjs hashing with salt rounds
3. **Authorization**: Role-based access control
4. **Data Protection**: Input validation and sanitization
5. **HTTPS**: Recommended for production
6. **CORS**: Configured for allowed origins
7. **Helmet**: Security headers enabled

## Performance Optimization

1. **Database Indexing**: Create indexes on frequently queried fields
2. **Caching**: Implement Redis for session/data caching
3. **API Optimization**: Pagination for large datasets
4. **Frontend**: Code splitting and lazy loading
5. **Compression**: Gzip compression enabled

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use environment variables for sensitive data
3. Set up MongoDB Atlas or self-hosted MongoDB
4. Deploy to Heroku, AWS, or similar platform
5. Configure CORS for frontend domain

### Frontend
1. Build production bundle: `npm run build`
2. Deploy to Netlify, Vercel, or similar
3. Configure API endpoint for production backend

## Future Enhancements

1. **Machine Learning Integration**
   - Advanced ML models (Random Forest, XGBoost)
   - Real-time model training
   - Prediction accuracy improvement

2. **Mobile Application**
   - React Native app
   - Native mobile experience
   - Offline capabilities

3. **Advanced Features**
   - Real-time notifications (WebSockets)
   - Email notifications
   - Video interviews integration
   - Resume parsing

4. **Analytics**
   - Advanced dashboards
   - Predictive analytics
   - Industry trend analysis

5. **Integration**
   - Third-party placement portals
   - Email marketing platforms

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database name and credentials

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.js`

### CORS Errors
- Check CORS configuration in backend
- Ensure frontend URL is in allowed origins

### Authentication Issues
- Verify JWT secret in `.env`
- Check token expiration
- Ensure token is sent in Authorization header

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request

## License

MIT License - feel free to use this project for educational and commercial purposes.

## Contact & Support

**Author**: Praneesh K (7376232IT223)

For questions, suggestions, or support:
- Create an issue on GitHub
- Contact via email
- Refer to individual README files in backend and frontend folders

## Acknowledgments

- MongoDB documentation
- Express.js community
- React documentation
- Vite documentation

---

**Last Updated**: February 12, 2026

**Status**: Fully Functional ✅
