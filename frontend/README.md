# Predictive Student Placement Analysis System - Frontend

This is the frontend application for the Predictive Student Placement Analysis System built with React and Vite.

## Features

- **Authentication**: Secure login and registration
- **Role-Based UI**: Different views for students, staff, and admins
- **Student Dashboard**: View placement predictions and recommendations
- **Admin Dashboard**: Analytics and reporting tools
- **Student Management**: Manage student records (staff/admin)
- **Notifications**: Real-time notifications panel
- **Analytics**: View placement trends and statistics
- **Responsive Design**: Works on all devices

## Tech Stack

- **Framework**: React 18.2
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Icons**: React Icons
- **Charts**: Chart.js & react-chartjs-2
- **CSS**: CSS3 with CSS Variables

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Navbar.jsx            # Navigation component
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication context
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── StudentManagement.jsx
│   ├── services/
│   │   ├── apiClient.js          # Axios configuration
│   │   └── api.js                # API service functions
│   ├── styles/
│   │   ├── index.css             # Global styles
│   │   ├── Auth.css              # Auth page styles
│   │   ├── Dashboard.css         # Dashboard styles
│   │   ├── Navbar.css            # Navigation styles
│   │   └── Management.css        # Management page styles
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── App.css                   # App styles
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── package.json
└── README.md
```

## Installation

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Backend URL**
   - Update API endpoint in `src/services/apiClient.js` if different from `http://localhost:5000`

## Running the Frontend

### Development Mode
```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment Variables

If needed, create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Pages & Features

### Authentication Pages
- **Login**: User login with email and password
- **Register**: New user registration with role selection

### Student Dashboard
- View placement prediction and probability
- See skill improvement suggestions
- Check placement status
- View upcoming placement drives

### Admin Dashboard
- Comprehensive analytics and statistics
- Placement rate overview
- Student statistics
- Prediction accuracy metrics

### Student Management
- Add new student records
- View all student information
- Update student data
- Filter eligible students

## Components

### Navbar
- Displays user information
- Logout button
- Role indication

### Authentication Context Provider
- Manages authentication state
- Login/Register/Logout functions
- Token storage in localStorage

### Protected Routes
- Authentication check
- Role-based access control
- Automatic redirection

## Services

### API Client
- Axios instance with base configuration
- Automatic token injection in headers
- Token refresh mechanism

### API Service Functions

#### authService
- `register()` - User registration
- `login()` - User login
- `logout()` - User logout
- `getProfile()` - Get user profile

#### studentService
- `createStudent()` - Create student record
- `getStudentData()` - Get student details
- `updateStudentData()` - Update student info
- `getAllStudents()` - List all students
- `getEligibleStudents()` - Get eligible students

#### placementService
- `createPlacementRecord()` - Create placement record
- `getPlacementRecord()` - Get specific record
- `updatePlacementStatus()` - Update placement status
- `getStudentPlacements()` - Get placements for student
- `getAllPlacementRecords()` - List all placements

#### notificationService
- `getNotifications()` - Get user notifications
- `markAsRead()` - Mark notification as read
- `getUnreadNotifications()` - Get unread only

#### analyticsService
- `getPlacementStats()` - Placement statistics
- `getStudentStats()` - Student statistics
- `getPredictionAccuracy()` - Prediction accuracy
- `getTrendAnalysis()` - Placement trends

## Styling

The application uses:
- **CSS Variables**: Defined in `:root` for consistent theming
- **Responsive Design**: Mobile-first approach with media queries
- **Modern Layout**: CSS Grid and Flexbox
- **Smooth Transitions**: CSS transitions for interactions

### Color Scheme
- Primary: `#2c3e50` (Dark blue-gray)
- Secondary: `#3498db` (Light blue)
- Success: `#27ae60` (Green)
- Danger: `#e74c3c` (Red)
- Warning: `#f39c12` (Orange)

## Local Storage

The application stores:
- `token`: JWT authentication token
- `user`: User information (JSON)

## Authentication Flow

1. User enters credentials
2. Submit login request
3. Receive JWT token and user data
4. Store in localStorage
5. Token added to all subsequent requests
6. Protected routes check authentication

## Error Handling

- API errors are caught and displayed to users
- Form validation before submission
- Loading states during API calls
- Error messages shown in UI

## Responsive Design

- Mobile: Single column layouts
- Tablet: Two column layouts
- Desktop: Multi-column layouts
- All elements scale appropriately

## Future Enhancements

- Real-time notifications with WebSockets
- File upload for documents
- Email notifications
- Advanced analytics charts
- Mobile application
- Dark mode theme
- Internationalization (i18n)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with Vite
- Lazy loading of components
- Optimized images
- Efficient API calls
- Local caching strategies

## License

MIT

## Contact

For questions or support, contact the development team.
