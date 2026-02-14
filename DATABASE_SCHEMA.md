# Placement Management System - Normalized Database Schema

## Tables & Models

### 1. **User** (Authentication)
```
User_ID (PK)
├── Username (unique)
├── Password (hashed)
├── Role (Student/Staff/Admin)
├── CreatedAt
└── UpdatedAt
```

### 2. **Student** (Basic Information)
```
Student_ID (PK)
├── User_ID (FK) → User
├── Name
├── Register_Number (unique)
├── Department
├── Year (1st/2nd/3rd/4th Year)
├── CGPA
├── Arrear_Count
├── Email
├── Phone
├── Placement_Status (not_placed/placed/rejected/offer_received)
├── Placed_Company
├── Placed_Salary
├── Placed_Date
├── CreatedAt
└── UpdatedAt
```

### 3. **Skills** (Technical & Soft Skills)
```
Skill_ID (PK)
├── Student_ID (FK) → Student (1:1 or 1:M)
├── Technical_Skills (array)
├── Communication_Level (Poor/Average/Good/Excellent)
├── Aptitude_Level (Poor/Average/Good/Excellent)
├── Coding_Level (Poor/Average/Good/Excellent)
├── Certification_Details (array)
├── Internship_Details (array of objects)
├── CreatedAt
└── UpdatedAt
```

### 4. **Academic_Record** (Academic Performance)
```
Record_ID (PK)
├── Student_ID (FK) → Student (1:1)
├── Tenth_Percentage
├── Twelfth_Percentage
├── Current_Semester
├── Project_Details (array of objects)
├── CreatedAt
└── UpdatedAt
```

### 5. **Prediction** (Placement Readiness Prediction)
```
Prediction_ID (PK)
├── Student_ID (FK) → Student (1:M)
├── Placement_Probability (0-100)
├── Readiness_Category (High/Medium/Low)
├── Skill_Gap_Analysis (academic/technical/soft_skills gaps + recommendations)
├── Prediction_Date
├── CreatedAt
└── UpdatedAt
```

### 6. **Placement_Drive** (Recruitment Drives)
```
Drive_ID (PK)
├── Company_Name
├── Drive_Date
├── Registration_Deadline
├── Eligibility_Criteria (minCGPA, maxArrears, allowedDepartments, allowedYears)
├── Location
├── Venue
├── Job_Role
├── Package_Offered (LPA)
├── Number_Of_Positions
├── Description
├── Status (upcoming/ongoing/completed/cancelled)
├── CreatedAt
└── UpdatedAt
```

### 7. **Application** (Student Application for Drives)
```
Application_ID (PK)
├── Student_ID (FK) → Student (M:M with PlacementDrive)
├── Drive_ID (FK) → PlacementDrive (M:M with Student)
├── Application_Date
├── Application_Status (applied/shortlisted/selected/rejected/waitlist)
├── Interview_Rounds (array: roundNumber, roundType, date, result, feedback)
├── Final_Result (selected/rejected/pending)
├── Offer_Letter (URL/document)
├── Salary
├── LPA
├── Joining_Date
├── CreatedAt
└── UpdatedAt
```

## Relationships (ER Diagram)

```
User (1:1) → Student
            ↓ (1:1)
     Academic_Record
            ↓ (1:M)
        Skills
            ↓ (1:M)
      Prediction

Company (1:M) → Placement_Drive
```

## Key Relationships

| From | To | Cardinality | Description |
|------|----|----|---|
| User | Student | 1:1 | One user has one student profile |
| Student | Skills | 1:1 | One student has one skill record |
| Student | Academic_Record | 1:1 | One student has one academic record |
| Student | Prediction | 1:M | One student can have multiple predictions |
| Student | Placement_Drive | M:M | Many students apply for many drives (via Application) |
| Student | Application | 1:M | One student has multiple applications |
| PlacementDrive | Application | 1:M | One drive has multiple applications |

## Features Enabled by This Schema

✅ Normalized data structure  
✅ Reduced data redundancy  
✅ Easy to scale and maintain  
✅ Support for multiple predictions per student  
✅ Detailed placement drive management  
✅ Track all student applications and interview rounds  
✅ Comprehensive skill tracking
✅ Academic history management
✅ Placement analytics  

---
*Last Updated: February 2026*
