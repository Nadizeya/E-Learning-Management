
# 🎓 E-Learning Management System (LMS)

**Course**: Software Engineering (1305217) , Database Systems (1501208) & Web Application Development ( 1305215)

**Institution**: Mae Fah Luang University
---

## 📖 Overview

The E-Learning Management System is a comprehensive, database-driven web application designed to centralize educational resources, streamline course management, and enhance student engagement. It addresses the challenges of decentralized learning materials and manual administrative tasks by providing a unified platform for Instructors, Students, and Administrators.

This project features a robust backend built with Spring Boot, a responsive frontend using React.js, and a relational MySQL database for data persistence.

---

## ✨ Key Features

### 👨‍🎓 For Students

- **Unified Learning Hub**: Browse course catalogs and enroll in courses efficiently.
- **Interactive Content**: Access video lectures, reading materials (PDFs), and take quizzes.
- **Progress Tracking**: Real-time visibility of course completion percentages and module progress.
- **Gamification**: Earn Badges for milestones and receive Certificates (with unique verification codes) upon course completion.
- **Instant Feedback**: Receive immediate scoring and feedback on quiz submissions.

### 👨‍🏫 For Instructors

- **Course Creation**: Intuitive tools to create, edit, and publish courses with Draft/Published statuses.
- **Content Management**: Organize curriculum into Modules and upload varied content types (Videos, PDFs, Quizzes).
- **Assessment Tools**: Create multiple-choice quizzes with automatic grading logic.
- **Analytics**: View student enrollment data and track performance metrics.

### 🛡️ For Administrators

- **System Oversight**: Comprehensive dashboard to view system-wide statistics (Total Users, Active Courses).
- **User Management**: Manage Student and Instructor accounts.

---

## 👥 Group Members

| Name           | Role              | Student ID   |
| :------------- | :---------------- | :----------- |
| Nadi Zeya      | Project Manager   | 6731503070   |
| Kyaw Hmue San  | Lead Developer    | 6731503062   |
| Hein Htut Aung | Data Analyst      | 6731503054   |
| Nang Shwe Sin  | Frontend Developer| 6731503072   |
| Min Thein Kyaw | Backend Developer | 6731503067   |
| Aung Kyaw Soe  | QA Team Leader    | 6731503045   |

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot (Java 17)
- **Security**: Spring Security, JWT (JSON Web Tokens), BCrypt Password Hashing
- **Build Tool**: Maven/Gradle

### Frontend
- **Library**: React.js
- **Styling**: CSS / Styled Components
- **HTTP Client**: Axios / Fetch API

### Database & Infrastructure
- **Database**: MySQL 8.0 (Relational Model)
- **Containerization**: Docker (for Database deployment)
- **Storage**: Local file storage for course content (Videos/PDFs)

---

## 💾 Database Schema

The system utilizes a relational database with 15 normalized tables including:

- **User Management**: `ADMINS`, `INSTRUCTORS`, `STUDENTS`
- **Course Structure**: `CATEGORIES`, `COURSES`, `COURSE_MODULES`, `COURSE_CONTENT`
- **Engagement**: `ENROLLMENTS`, `STUDENT_PROGRESS`
- **Assessments & Rewards**: `QUIZZES`, `QUIZ_QUESTIONS`, `QUIZ_ATTEMPTS`, `BADGES`, `USER_BADGES`, `CERTIFICATES`

Detailed SQL scripts and ER Diagrams can be found in the `docs/database` folder.

---

## 🚀 Getting Started

### Prerequisites
- Java Development Kit (JDK) 17
- Node.js & npm
- MySQL Server
- Docker (Optional, for containerized DB)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/e-learning-management-system.git
cd e-learning-management-system
git checkout asher
```

#### 2. Database Setup
- Create a MySQL database named `lms_elearn_db`.
- Execute the initialization script found in `database/init_script.sql` to create tables and seed initial data.
- Update `application.properties` in the backend folder with your DB credentials.

#### 3. Backend Setup (Spring Boot)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend server will start at `http://localhost:8080`.

#### 4. Frontend Setup (React)
```bash
cd frontend
npm i
npm run dev 
```
The frontend client will start at `http://localhost:5173`.

---

## 🧪 Testing

The project adheres to strict quality assurance standards as outlined in our Test Case Document.

- **Functional Testing**: Covers User Auth, Course CRUD, Enrollment flows, and Quiz logic.
- **Performance Testing**: API response time validation (<1000ms for 95% of requests).
- **Security Testing**: Verification of JWT enforcement and BCrypt hashing.

To run backend unit tests:
```bash
cd backend
./mvnw test
```

---

## 📝 License

This project is developed for educational purposes at LearnHub.