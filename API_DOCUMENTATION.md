# Placement Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Headers
All endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## Skills Management

### Create/Update Skills
```
POST /skills/students/{studentId}/skills
```
**Request Body:**
```json
{
  "technicalSkills": ["Java", "Python", "React"],
  "communicationLevel": "Good",
  "aptitudeLevel": "Excellent",
  "codingLevel": "Good",
  "certificationDetails": ["AWS", "CCNAssociate"],
  "internshipDetails": [
    {
      "company": "TCS",
      "duration": "3 months",
      "role": "Developer",
      "description": "Backend development"
    }
  ]
}
```

### Get Skills
```
GET /skills/students/{studentId}/skills
```

### Delete Skills
```
DELETE /skills/students/{studentId}/skills
```

---

## Academic Records

### Create/Update Academic Record
```
POST /academic-records/students/{studentId}/academic-record
```
**Request Body:**
```json
{
  "tenthPercentage": 85.5,
  "twelfthPercentage": 87.2,
  "currentSemester": 7,
  "projectDetails": [
    {
      "title": "E-commerce Platform",
      "description": "Full stack web application",
      "technologies": ["React", "Node.js", "MongoDB"],
      "link": "https://github.com/user/project"
    }
  ]
}
```

### Get Academic Record
```
GET /academic-records/students/{studentId}/academic-record
```

### Delete Academic Record
```
DELETE /academic-records/students/{studentId}/academic-record
```

---

## Predictions

### Create Prediction
```
POST /predictions/students/{studentId}/predictions
```
**Request Body:**
```json
{
  "placementProbability": 82.5,
  "readinessCategory": "High",
  "skillGapAnalysis": {
    "academicGap": "CGPA is strong at 8.2",
    "technicalGap": "Need to improve DSA",
    "softSkillsGap": "Good communication skills",
    "recommendations": [
      "Practice coding problems daily",
      "Improve mock interview scores"
    ]
  }
}
```

### Get All Predictions for Student
```
GET /predictions/students/{studentId}/predictions
```

### Get Latest Prediction
```
GET /predictions/students/{studentId}/predictions/latest
```

### Update Prediction
```
PUT /predictions/{predictionId}
```

### Delete Prediction
```
DELETE /predictions/{predictionId}
```

---

## Placement Drives

### Create Placement Drive (Admin/Staff)
```
POST /placement-drives/placement-drives
```
**Request Body:**
```json
{
  "companyName": "TCS",
  "driveDate": "2026-03-15T10:00:00Z",
  "registrationDeadline": "2026-03-10T23:59:59Z",
  "eligibilityCriteria": {
    "minCGPA": 7.0,
    "maxArrears": 1,
    "allowedDepartments": ["CSE", "IT"],
    "allowedYears": ["3rd Year", "4th Year"]
  },
  "location": "Bangalore",
  "venue": "Campus Location",
  "jobRole": "Software Developer",
  "packageOffered": 12.5,
  "numberOfPositions": 50,
  "description": "TCS recruitment drive for 2026",
  "status": "upcoming"
}
```

### Get All Placement Drives
```
GET /placement-drives/placement-drives
```

### Get Upcoming Drives
```
GET /placement-drives/placement-drives/upcoming
```

### Get Drive by ID
```
GET /placement-drives/placement-drives/{driveId}
```

### Update Drive (Admin/Staff)
```
PUT /placement-drives/placement-drives/{driveId}
```

### Delete Drive (Admin)
```
DELETE /placement-drives/placement-drives/{driveId}
```

---

## Applications

### Submit Application (Student)
```
POST /applications/applications
```
**Request Body:**
```json
{
  "studentId": "objectId",
  "driveId": "objectId"
}
```

### Get Applications by Student
```
GET /applications/students/{studentId}/applications
```

### Get Applications for a Drive (Admin/Staff)
```
GET /applications/placement-drives/{driveId}/applications
```

### Get Application by ID
```
GET /applications/applications/{applicationId}
```

### Update Application Status (Admin/Staff)
```
PUT /applications/applications/{applicationId}/status
```
**Request Body:**
```json
{
  "applicationStatus": "shortlisted",
  "finalResult": "pending"
}
```

### Add Interview Round (Admin/Staff)
```
POST /applications/applications/{applicationId}/interview-rounds
```
**Request Body:**
```json
{
  "roundNumber": 1,
  "roundType": "technical",
  "date": "2026-03-20T14:00:00Z",
  "result": "pass",
  "feedback": "Good problem-solving skills"
}
```

### Delete Application
```
DELETE /applications/applications/{applicationId}
```

### Get Application Statistics (Admin)
```
GET /applications/applications/stats
```

---

## Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { /* entity data */ }
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Endpoints

### Register
```
POST /auth/register
```
**Request Body:**
```json
{
  "username": "student_name",
  "email": "student@email.com",
  "password": "secure_password",
  "role": "student"
}
```

### Login
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "student@email.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "userId",
    "email": "student@email.com",
    "role": "student"
  }
}
```

---

## Example Workflow

### 1. Student Registration
```
POST /auth/register
```

### 2. Student Updates Profile
```
POST /academic-records/students/{studentId}/academic-record
POST /skills/students/{studentId}/skills
```

### 3. System Creates Prediction
```
POST /predictions/students/{studentId}/predictions
```

### 4. View Placement Drives
```
GET /placement-drives/placement-drives/upcoming
```

### 5. Submit Application
```
POST /applications/applications
```

### 6. Track Application Status
```
GET /applications/students/{studentId}/applications
```

---

## Role-Based Access Control

| Endpoint | Student | Staff | Admin |
|----------|---------|-------|-------|
| Create Company | ❌ | ✅ | ✅ |
| View Companies | ✅ | ✅ | ✅ |
| Create Drive | ❌ | ✅ | ✅ |
| View Drives | ✅ | ✅ | ✅ |
| Apply for Drive | ✅ | ❌ | ❌ |
| Manage Application | ❌ | ✅ | ✅ |
| Get Stats | ❌ | ❌ | ✅ |
| Delete Company | ❌ | ❌ | ✅ |

---

## Notes
- All timestamps are in ISO 8601 format
- LPA is in numerical format (e.g., 12.5 for 12.5 LPA)
- Student ID must be a valid MongoDB ObjectId
- Authentication token expires in 7 days
- Multiple predictions can be made for tracking changes over time

---
*Last Updated: February 2026*
