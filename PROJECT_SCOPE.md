# E-Learning Management System (LMS) - Project Scope

## 1.1 Background and Problem Definition

### Real-World Problem
Currently, educational institutions and organizations face significant challenges in managing and delivering educational content effectively. The problems include:

- **Decentralized Learning Resources**: Educational materials are scattered across multiple platforms, making it difficult for students to access and track learning materials in one unified location. Without a centralized system, students struggle to find relevant courses, track their progress, and manage their learning journey efficiently.

- **Inefficient Course Management**: Instructors spend considerable time managing course materials, tracking student progress, and grading assessments manually, leading to administrative overhead and inconsistent record-keeping. The lack of automated systems results in time-consuming tasks that could be streamlined.

- **Limited Progress Tracking**: Without a centralized database system, it is difficult to monitor student progress, identify struggling students, and provide timely interventions. Manual tracking methods are error-prone and do not provide real-time insights into learning outcomes.

- **Lack of Engagement Metrics**: Institutions cannot effectively measure learning outcomes, engagement levels, or the effectiveness of their teaching strategies. Without proper data collection and analytics, it becomes challenging to improve course quality and student success rates.

- **Scalability Issues**: Traditional classroom-based learning cannot easily scale to accommodate large numbers of students or support remote/hybrid learning models. Physical infrastructure limitations restrict access to quality education.

### Industry Context
The global e-learning market has expanded significantly due to:
- Post-pandemic shift to hybrid and remote learning models
- Rise of online universities and professional development programs
- Increased demand for upskilling and workforce development
- Platforms like Coursera, Udemy, and LinkedIn Learning setting industry standards for online education

### Why This Problem is Important
1. **Educational Accessibility**: Enables learning opportunities for geographically dispersed populations who cannot access traditional classroom settings
2. **Cost Efficiency**: Reduces infrastructure costs and administrative burden compared to physical learning environments
3. **Data-Driven Insights**: Provides institutions with analytics to improve learning outcomes and teaching effectiveness
4. **Student Engagement**: Gamification and progress tracking features increase motivation and completion rates
5. **Competitive Advantage**: Organizations offering online learning gain access to wider talent pools and can scale their educational offerings

### Challenges Without a Database Solution
Without a proper database management system:
- Student records, course information, and progress data would be stored in spreadsheets or paper files, making retrieval and updates inefficient
- No automated way to track student enrollments, course completions, or generate certificates
- Manual quiz grading and progress tracking would be time-consuming and error-prone
- Lack of data integrity and security measures could lead to data loss or unauthorized access
- Inability to generate meaningful reports and analytics for decision-making

---

## 1.2 Objective

### Primary Goals
The objective of the E-Learning Management System (LMS) is to design and implement a comprehensive web application and a relational database that helps track courses, students, instructors, learning progress, and achievements efficiently.

The project aims to achieve the following:

1. **Centralize Learning Resources**: Design and implement a unified platform where instructors can create, publish, and manage courses, modules, and learning content (videos, readings, quizzes) through a structured database schema.

2. **Enable Efficient Learning**: Develop a system that facilitates student enrollment in courses, tracks learning progress in real-time through database records, and provides a seamless learning experience through an intuitive web interface.

3. **Implement Assessment Mechanisms**: Create a database-driven assessment system that enables instructors to create and administer quizzes, automatically grade student performance, and store results for analytics and reporting.

4. **Support Administrative Functions**: Build administrative tools with database-backed user management, course oversight, and system monitoring capabilities to ensure efficient platform operations.

5. **Enhance Engagement**: Implement gamification elements (badges, certificates) stored in the database to increase student motivation and measure learning outcomes through automated achievement tracking.

6. **Generate Insights**: Provide analytics and reporting features that leverage database queries to help institutions understand learning patterns, enrollment trends, and make data-driven decisions.

### What the System Aims to Achieve with the Database System
- **Efficient Data Management**: Store and retrieve course information, student records, progress data, and assessments efficiently using a relational database (MySQL)
- **Data Integrity**: Ensure data consistency and accuracy through proper database design, foreign key constraints, and transaction management
- **Scalability**: Support hundreds of courses and thousands of students through optimized database schema and indexing
- **Security**: Implement authentication and authorization at both application and database levels to protect user data and educational content
- **Automation**: Enable automated certificate generation, progress tracking, and badge awarding through database triggers and application logic
- **Reporting**: Generate comprehensive reports on student progress, course performance, and system usage through database views and queries

---

## 1.3 Expected Results

### Operational Outcomes

#### For Students
- ✅ **Convenient Access**: Access courses anytime, anywhere with a consistent web interface, eliminating the need for physical attendance
- ✅ **Progress Visibility**: View personal learning progress, completed modules, and quiz scores in real-time through database-driven dashboards
- ✅ **Achievement Recognition**: Earn certificates automatically upon course completion and collect badges for milestones, all tracked in the database
- ✅ **Structured Learning Path**: Follow organized course modules and lessons stored in the database to achieve learning objectives systematically

#### For Instructors
- ✅ **Content Management**: Create, edit, and publish course materials efficiently through a database-backed content management system
- ✅ **Student Analytics**: Access comprehensive reports on student progress, quiz performance, and engagement metrics generated from database queries
- ✅ **Assessment Administration**: Design and manage quizzes with automatic grading, with all attempts and scores stored in the database
- ✅ **Feedback Mechanism**: Monitor student interactions and progress through database records to provide targeted feedback

#### For Administrators
- ✅ **System Management**: Manage user accounts, courses, and platform settings through database operations with proper access controls
- ✅ **Report Generation**: Generate reports on system usage, student enrollment, and course performance using database views and queries
- ✅ **Quality Assurance**: Monitor system health, verify content quality, and manage platform maintenance through database monitoring tools

### System Performance Improvements
1. **Efficiency**: Reduce administrative time by 70% through automation of grading, progress tracking, and certificate generation using database-driven workflows
2. **Accuracy**: Eliminate manual record-keeping errors with automated progress tracking and data validation at the database level
3. **Accessibility**: Enable 24/7 learning accessibility compared to limited classroom hours, with all data accessible through the web application
4. **Scalability**: Support simultaneous learning for hundreds of students without performance degradation through optimized database design and indexing
5. **Data Security**: Implement encryption (BCrypt for passwords) and JWT authentication to protect student data and educational content stored in the database
6. **Automation**: Auto-generate certificates, track progress, and award badges without manual intervention through database triggers and application logic

### Measurable Metrics
- **Course Completion Rate**: Target 75%+ for published courses, tracked through enrollment and progress database records
- **System Uptime**: Target 99.5% availability with reliable database connectivity
- **Average Page Load Time**: < 2 seconds with optimized database queries
- **Support Response Time**: < 24 hours for user issues, with all user data accessible through the database
- **Certificate Issuance Automation**: 100% automated upon course completion, triggered by database progress records
- **Data Retrieval Speed**: Database queries execute in < 100ms for common operations
- **User Satisfaction**: 80%+ user satisfaction score based on system usability and performance

---

## 1.4 Scope

### 1.4.1 What is Covered (In-Scope)

The following features are implemented and covered within the project scope:

#### Core Features
1. **User Management**
   - User registration and authentication (signup/login) for Students, Instructors, and Admins
   - Password reset functionality with email verification
   - Role-based access control (Admin, Instructor, Student) with JWT tokens
   - User profile management and settings

2. **Course Management**
   - Create, edit, and publish courses with status management (Draft/Published)
   - Organize courses into categories stored in the database
   - Assign instructors to courses through foreign key relationships
   - Define course metadata (title, description, level, duration, thumbnail)

3. **Content Management**
   - Create course modules within courses with ordering
   - Manage course content types: Videos, Reading materials (PDFs), and Quizzes
   - File upload and storage for content (videos up to 500MB, PDFs)
   - Content sequencing and ordering within modules

4. **Enrollment System**
   - Student enrollment in published courses
   - Enrollment status tracking (In Progress, Completed) in database
   - Prevent duplicate enrollments through unique constraints
   - Track enrollment dates and completion status

5. **Learning Progress Tracking**
   - Track student progress through course content with database records
   - Mark lessons as completed and store timestamps
   - Calculate completion percentages based on content completed
   - Generate progress reports through database queries

6. **Assessment System**
   - Create multiple-choice quizzes with questions and options
   - Define quiz questions with correct answers stored in database
   - Track quiz attempts and scores automatically
   - Calculate quiz performance metrics and display results

7. **Certificate System**
   - Automatic certificate generation upon course completion
   - Unique certificate codes for verification stored in database
   - Certificate viewing and verification through web interface
   - Certificate download functionality

8. **Gamification Features**
   - Badge system for achievements (First Course, Quiz Master, Early Bird)
   - Award badges to students for milestones automatically
   - Display earned badges on student profiles and accomplishments page
   - Track badge earning dates in database

9. **Dashboard and Analytics**
   - Admin dashboard with system statistics (users, courses, enrollments)
   - Instructor dashboard with course performance metrics and student progress
   - Student dashboard with personal progress, achievements, and enrolled courses
   - Database views for efficient reporting

10. **Security and Authorization**
    - JWT-based authentication for all user roles
    - Spring Security implementation with role-based access
    - Role-based authorization for all API endpoints
    - Password encryption using BCrypt hashing
    - CORS configuration for frontend-backend communication

11. **Database Management**
    - MySQL 8.0 relational database with 15 tables
    - Proper database schema with foreign keys and constraints
    - Database views for common queries (course overview, student dashboard, instructor stats)
    - Docker containerization for database deployment

### 1.4.2 What is NOT Covered (Out-of-Scope)

The following features are explicitly excluded from the current project scope:

1. **Payment Integration**: Stripe, PayPal, or other payment gateways for course monetization or subscription management
2. **Video Streaming Optimization**: Advanced adaptive bitrate streaming, video transcoding, or CDN integration (videos are stored locally and served directly)
3. **Real-time Chat**: Live instructor-student chat, discussion forums, or messaging system
4. **Mobile Application**: Native iOS or Android mobile applications (only web-responsive design is included)
5. **Advanced Analytics**: Machine learning-based course recommendations, predictive analytics, or AI-powered insights
6. **Third-party Integrations**: Integration with external LMS platforms (Moodle, Canvas), educational tools, or APIs
7. **Synchronous Learning**: Virtual classrooms, live video conferencing, webinars, or real-time collaboration tools
8. **Advanced Accessibility Features**: Advanced speech-to-text, screen reader optimization beyond basic HTML semantics, or multi-language localization
9. **Offline Access**: Ability to download and access course content offline or sync progress when offline
10. **Social Features**: Peer-to-peer interactions, user followers, social sharing, or community features
11. **Assignment Submissions**: File-based assignment submissions and grading (only quiz-based assessments are included)
12. **Email Notifications**: Automated email notifications for course updates, deadlines, or announcements (email infrastructure exists but notifications are not automated)
13. **Advanced Search**: Full-text search, advanced filtering, or recommendation algorithms
14. **Video Player Features**: Advanced video player controls, playback speed, annotations, or interactive video elements

### 1.4.3 System Limitations and Constraints

#### Technical Limitations
- **Simultaneous Users**: Current architecture supports up to 500 concurrent users without performance degradation
- **File Storage**: Maximum file size for course content is 500 MB per upload (configured in application.properties)
- **Database Size**: Suitable for up to 50,000 users and 1,000 courses in initial deployment without requiring database optimization
- **Video Quality**: Videos are served from local file storage (`./uploads/course-content`) without CDN optimization or adaptive streaming
- **Database Tables**: 15 tables in MySQL database (not extensible to additional entity types without schema changes)
- **API Response Time**: Target < 500ms for most operations, may be slower for large file uploads

#### Operational Limitations
- **Internal Use**: System is designed for institutional use within an organization, not as a public marketplace or commercial platform
- **User Roles**: Limited to three predefined roles (Admin, Instructor, Student) - no custom roles or role hierarchy
- **Course Categories**: Categories are managed through database but require admin access to create new ones
- **Support**: Community-based support through GitHub issues or direct contact - no dedicated support team
- **Backup and Recovery**: Manual database backup procedures - no automated backup system included
- **Monitoring**: Basic application logging - no advanced monitoring or alerting system

#### Geographic and Compliance
- **Language**: English language only in initial version - no internationalization (i18n) support
- **Data Residency**: Database hosted on local server or single cloud region - no multi-region deployment
- **Compliance**: GDPR compliance, data export, or privacy regulations not fully implemented in current version
- **Accessibility**: Basic HTML semantic structure - not fully WCAG 2.1 AA compliant
- **Browser Support**: Modern browsers (Chrome, Firefox, Edge, Safari) - no support for legacy browsers (IE11)

---

## 1.4.4 User Types and Roles

### Types of Users in the System

The E-Learning Management System supports three distinct user types, each with specific roles and capabilities:

#### 1. Admin (Administrator)
**Role Description**: System administrators who manage the entire platform, oversee all users, and maintain system integrity.

**What Admins Can Do:**
- Manage users (only delete accounts for Students, Instructors, and other Admins)
- View all courses in the system
- View system-wide analytics and reports (total users, enrollments, course statistics)
- View all student progress across all courses

**Example Actions:**
- Delete inappropriate course content
- View total number of active students

---

#### 2. Instructor
**Role Description**: Educators who create, manage, and deliver course content to students.

**What Instructors Can Do:**
- Create courses (define title, description, level, duration, category)
- Create and organize course modules within their courses
- Upload course content (videos, reading materials/PDFs)
- Create quizzes with multiple-choice questions
- Publish or save courses as drafts
- View student enrollments in their courses
- View student progress and completion rates for their courses
- View quiz scores and performance metrics for their courses
- Edit and update their own course content
- Delete their own courses
- Update their personal profile (bio, expertise)

**Example Actions:**
- Create a new course "Introduction to Web Development"
- Upload a video lecture on HTML basics
- Create a 10-question quiz on JavaScript
- View that 50 students are enrolled in their course
- Check which students have completed Module 1

---

#### 3. Student
**Role Description**: Learners who enroll in courses, complete learning materials, and track their progress.

**What Students Can Do:**
- Browse available published courses
- Enroll in courses
- View enrolled courses and course content
- Watch video lectures
- Read course materials (PDFs)
- Take quizzes and submit answers
- View quiz scores and results immediately
- Mark lessons as completed
- Track personal learning progress (completion percentage)
- View earned badges and achievements
- Download certificates upon course completion
- Verify certificate authenticity using unique codes
- Update personal profile information
- View personal dashboard with progress and accomplishments

**Example Actions:**
- Search for "Python Programming" courses
- Enroll in "Python Basics for Beginners"
- Watch video lesson on Python syntax
- Complete a quiz and receive instant score
- View that they are 75% complete with the course
- Download certificate after completing all modules
- Check earned badges 

---

### Summary Table

| User Type | Primary Function | Key Capabilities |
|-----------|-----------------|------------------|
| **Admin** | System Management | Manage users, categories, view all courses, system analytics |
| **Instructor** | Content Creation | Create courses, upload content, create quizzes, view student progress |
| **Student** | Learning | Enroll in courses, access content, take quizzes, track progress, earn certificates |

---

## 1.4.5 Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    E-Learning Management System                      │
└─────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   System    │
                              └─────────────┘
                                     △
                    ┌────────────────┼────────────────┐
                    │                │                │
              ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
              │   Admin     │  │ Instructor   │  │   Student    │
              └─────────────┘  └──────────────┘  └──────────────┘
                    │                │                │
                    │                │                │
     ┌──────────────┴──────────┐     │     ┌─────────┴─────────┐
     │                         │     │     │                   │
     ▼                         ▼     ▼     ▼                   ▼
┌─────────────┐    ┌────────────────────────┐    ┌─────────────────────┐
│  Manage     │    │ Create & Manage        │    │ Enroll in Course    │
│  Users      │    │ Courses & Content      │    │                     │
└─────────────┘    └────────────────────────┘    └─────────────────────┘
     │                         │                         │
     ├─────────────────────────┼─────────────────────────┤
     │                         │                         │
     ▼                         ▼                         ▼
┌─────────────┐    ┌────────────────────────┐    ┌─────────────────────┐
│  Monitor    │    │ Create & Grade         │    │ View Course         │
│  System     │    │ Quizzes                │    │ Content             │
└─────────────┘    └────────────────────────┘    └─────────────────────┘
     │                         │                         │
     │                         │                         ▼
     │                         │                   ┌─────────────────────┐
     │                         │                   │ Complete Quiz       │
     │                         │                   │                     │
     │                         │                   └─────────────────────┘
     │                         │                         │
     │                         └─────────────┬───────────┘
     │                                       │
     │                                       ▼
     │                         ┌─────────────────────────┐
     │                         │ Track Progress & Earn   │
     │                         │ Badges/Certificates     │
     │                         └─────────────────────────┘
     │                                       │
     └───────────────────────┬───────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │ View Analytics &    │
                    │ Generate Reports    │
                    └─────────────────────┘
```

### Use Case Flow Examples

#### Use Case 1: Student Learning Journey
```
1. Register/Login as Student
   ↓
2. Browse Available Courses
   ↓
3. Enroll in Course
   ↓
4. View Course Modules
   ↓
5. Complete Lessons (Videos, Readings)
   ↓
6. Take Quiz Assessment
   ↓
7. Mark Lesson as Complete
   ↓
8. Complete All Modules
   ↓
9. Course Completion → Certificate Generated
   ↓
10. View Certificate & Earned Badges
    ↓
11. View Progress in Dashboard
```

#### Use Case 2: Instructor Course Management
```
1. Register/Login as Instructor
   ↓
2. Create New Course
   ↓
3. Set Course Metadata (title, description, category)
   ↓
4. Create Course Modules
   ↓
5. Add Content to Modules (Videos, Readings)
   ↓
6. Create Quizzes for Assessment
   ↓
7. Publish Course
   ↓
8. Monitor Student Enrollments
   ↓
9. View Student Progress & Quiz Scores
   ↓
10. Generate Performance Reports
```

#### Use Case 3: Admin System Management
```
1. Login as Admin
   ↓
2. Manage User Accounts (Create, Edit, Delete)
   ↓
3. Approve/Reject Course Submissions
   ↓
4. Monitor System Performance
   ↓
5. Generate System-wide Reports
   ↓
6. Manage Course Categories
   ↓
7. View User Analytics & Engagement Metrics
   ↓
8. Configure System Settings
```

---

## 1.4.6 User Roles and Responsibilities (Detailed)

### 1. Administrator (Admin)

#### Description
System administrators are responsible for overall platform management, user administration, and ensuring system integrity and performance.

#### Capabilities
| Feature | Permission | Details |
|---------|-----------|---------|
| **User Management** | Full Control | Create, edit, delete, suspend users across all roles |
| **Course Approval** | Review & Approve | Review and approve instructor-created courses before publication |
| **Category Management** | Full Control | Create, edit, delete course categories |
| **System Monitoring** | View Only | Monitor system performance, uptime, and resource usage |
| **Analytics & Reports** | Full Access | Generate system-wide reports and view analytics |
| **Permissions** | Manage | Grant/revoke permissions to other users |
| **Settings Configuration** | Full Control | Configure system-wide settings and policies |

#### Key Responsibilities
- ✓ Manage user accounts and enforce security policies
- ✓ Monitor platform performance and availability
- ✓ Review and approve new courses
- ✓ Generate compliance and audit reports
- ✓ Manage system configurations and updates
- ✓ Resolve technical issues and support escalations

#### Example Actions
- Create new instructor or student accounts
- Remove inappropriate course content
- Generate monthly usage reports
- Configure email notification settings
- Backup database and manage system maintenance

---

### 2. Instructor

#### Description
Instructors create, manage, and deliver educational content to students. They design courses, create assessments, and monitor student learning progress.

#### Capabilities
| Feature | Permission | Details |
|---------|-----------|---------|
| **Course Creation** | Full Control | Create courses and define course structure |
| **Content Management** | Full Control | Upload and organize course materials (videos, readings) |
| **Quiz Creation** | Full Control | Create quizzes and define assessment criteria |
| **Student Progress** | View Only | View student progress, completion rates, and quiz scores |
| **Analytics** | View Only | Generate reports on their courses and student performance |
| **Course Publishing** | Submit for Review | Submit courses for admin approval |
| **Own Profile** | Edit | Update personal profile and expertise information |
| **Student Communication** | Limited | Send notifications and messages to enrolled students |

#### Key Responsibilities
- ✓ Design and develop course curriculum and learning objectives
- ✓ Create and upload educational content in multiple formats
- ✓ Design assessment quizzes and grading rubrics
- ✓ Monitor student progress and identify struggling learners
- ✓ Provide feedback on quiz submissions
- ✓ Maintain course content quality and relevance
- ✓ Engage with students and respond to inquiries

#### Example Actions
- Create a new course titled "Introduction to Web Development"
- Upload video lectures and PDF materials
- Create 5 quizzes for chapter assessments
- View dashboard showing 150 students enrolled
- Analyze quiz performance statistics
- Send announcement to students about course updates

---

### 3. Student

#### Description
Students are learners who enroll in courses, complete learning materials, take assessments, and track their progress through the platform.

#### Capabilities
| Feature | Permission | Details |
|---------|-----------|---------|
| **Course Browsing** | View | Browse and search available courses |
| **Course Enrollment** | Self-Service | Enroll in any published course |
| **Content Access** | View Only | Access enrolled course materials (videos, readings) |
| **Quiz Participation** | Full Access | Take quizzes and submit answers |
| **Progress Tracking** | View Own | View personal progress and completion status |
| **Certificates** | View/Download | Download certificates upon course completion |
| **Badges** | View | View earned badges and achievements |
| **Own Profile** | Edit | Update personal profile information |
| **Performance Reports** | View Own | View personal quiz scores and progress reports |

#### Key Responsibilities
- ✓ Complete assigned coursework and learning materials
- ✓ Participate in assessments and quizzes
- ✓ Track personal learning progress and completion
- ✓ Maintain account security and password
- ✓ Respect intellectual property and course content
- ✓ Provide feedback on course quality

#### Example Actions
- Search for "Python Programming" courses
- Enroll in "Python Basics for Beginners"
- Watch video lectures on Python syntax
- Complete reading materials with assignments
- Take a 10-question quiz on for/while loops
- View completion percentage (65% complete)
- Check earned badges ("Week 1 Completer", "Quiz Master")
- Download certificate upon 100% course completion

---

## 1.4.7 Access Control Matrix

### Role-Based Access Control (RBAC)

| Feature | Admin | Instructor | Student |
|---------|:-----:|:----------:|:-------:|
| **User Management** | ✅ Full | ❌ None | ❌ None |
| **Manage Categories** | ✅ Full | ❌ None | ❌ None |
| **Create Courses** | ❌ None | ✅ Full | ❌ None |
| **Edit Own Courses** | ✅ Full | ✅ Full | ❌ None |
| **Delete Courses** | ✅ Full | ✅ Own Only | ❌ None |
| **Publish Courses** | ✅ Approve | ✅ Submit | ❌ None |
| **Create Content** | ❌ None | ✅ In Own Courses | ❌ None |
| **Edit Content** | ✅ Full | ✅ Own Only | ❌ None |
| **Create Quizzes** | ❌ None | ✅ In Own Courses | ❌ None |
| **Grade Quizzes** | ✅ Full | ✅ Own Courses | ❌ None |
| **Enroll Students** | ✅ Full | ❌ None | ✅ Self |
| **View All Progress** | ✅ Full | ✅ Their Courses | ❌ None |
| **View Own Progress** | ✅ Full | ✅ Full | ✅ Full |
| **Generate Reports** | ✅ Full | ✅ Their Courses | ✅ Own Only |
| **Issue Certificates** | ✅ Full | ❌ Auto | ✅ Auto Receive |
| **Award Badges** | ✅ Full | ❌ Auto | ✅ Auto Earn |
| **System Settings** | ✅ Full | ❌ None | ❌ None |
| **View Analytics** | ✅ Full | ✅ Their Courses | ✅ Own Data |

Legend: ✅ = Allowed, ❌ = Not Allowed

---

## 1.5 Technical Architecture Overview

### Technology Stack
- **Backend**: Spring Boot 3.5.7 (Java 17)
- **Database**: MySQL 8.0
- **Frontend**: React 19 with Vite
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker

### Database Structure (15 Tables)
1. **User Management**: Admins, Instructors, Students, Categories
2. **Course Structure**: Courses, Course Modules, Course Content
3. **Enrollment**: Enrollments, Student Progress, Certificates
4. **Assessment**: Quizzes, Quiz Questions, Quiz Attempts
5. **Gamification**: Badges, User Badges

### Key Features Implemented
- Multi-role authentication and authorization
- Course creation and content management
- Quiz and assessment system
- Progress tracking and analytics
- Certificate generation
- Badge/achievement system
- RESTful API design
- JWT-based security

---

## 1.6 Data Dictionary

This section provides a comprehensive description of all database tables, their columns, data types, constraints, and descriptions.

### 1.6.1 User Management Tables

#### Table: ADMINS

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| admin_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each admin user |
| first_name | VARCHAR(100) | NOT NULL | "John", "Jane" | Admin's first name |
| last_name | VARCHAR(100) | NOT NULL | "Doe", "Smith" | Admin's last name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | "admin@lms.com" | Admin's email address (unique) |
| password_hash | VARCHAR(255) | NOT NULL | "$2a$10$..." | BCrypt hashed password |
| permissions | TEXT | NULL | "all,manage_users" | JSON or comma-separated permissions list |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-15 10:30:00" | Timestamp when admin account was created |
| updated_at | TIMESTAMP | DEFAULT ON UPDATE | "2024-01-20 14:22:00" | Timestamp when admin record was last updated |

---

#### Table: INSTRUCTORS

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| instructor_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each instructor |
| first_name | VARCHAR(100) | NOT NULL | "Jane", "Bob" | Instructor's first name |
| last_name | VARCHAR(100) | NOT NULL | "Smith", "Johnson" | Instructor's last name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | "jane.smith@example.com" | Instructor's email address (unique) |
| password_hash | VARCHAR(255) | NOT NULL | "$2a$10$..." | BCrypt hashed password |
| bio | TEXT | NOT NULL | "Experienced web developer..." | Instructor's biography/description |
| expertise | VARCHAR(500) | NOT NULL | "Web Development, JavaScript" | Instructor's areas of expertise |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-10 09:15:00" | Timestamp when instructor account was created |
| updated_at | TIMESTAMP | DEFAULT ON UPDATE | "2024-01-25 16:45:00" | Timestamp when instructor record was last updated |

---

#### Table: STUDENTS

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| student_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each student |
| first_name | VARCHAR(100) | NOT NULL | "John", "Alice" | Student's first name |
| last_name | VARCHAR(100) | NOT NULL | "Doe", "Williams" | Student's last name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | "john.doe@example.com" | Student's email address (unique) |
| password_hash | VARCHAR(255) | NOT NULL | "$2a$10$..." | BCrypt hashed password |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-12 11:20:00" | Timestamp when student account was created |
| updated_at | TIMESTAMP | DEFAULT ON UPDATE | "2024-02-01 13:30:00" | Timestamp when student record was last updated |

---

#### Table: CATEGORIES

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| category_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each category |
| name | VARCHAR(100) | UNIQUE, NOT NULL | "Web Development", "Data Science" | Category name (unique) |
| description | TEXT | NULL | "Learn web development..." | Detailed description of the category |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-01 08:00:00" | Timestamp when category was created |
| updated_at | TIMESTAMP | DEFAULT ON UPDATE | "2024-01-15 10:00:00" | Timestamp when category was last updated |

---

### 1.6.2 Course Structure Tables

#### Table: COURSES

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| course_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each course |
| category_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing CATEGORIES table |
| instructor_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing INSTRUCTORS table |
| title | VARCHAR(255) | NOT NULL | "Complete Web Development Bootcamp" | Course title |
| description | TEXT | NULL | "Learn HTML, CSS, JavaScript..." | Detailed course description |
| status | ENUM | DEFAULT 'Draft' | "Draft", "Published" | Course publication status |
| thumbnail | LONGTEXT | NULL | "data:image/png;base64..." | Base64 encoded course thumbnail image |
| level | ENUM | DEFAULT 'Beginner' | "Beginner", "Intermediate", "Advanced" | Course difficulty level |
| duration | VARCHAR(50) | DEFAULT '6 weeks' | "6 weeks", "8 weeks" | Estimated course duration |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-15 10:00:00" | Timestamp when course was created |
| updated_at | TIMESTAMP | DEFAULT ON UPDATE | "2024-01-20 14:30:00" | Timestamp when course was last updated |

**Foreign Keys:**
- `category_id` → `CATEGORIES(category_id)` ON DELETE RESTRICT
- `instructor_id` → `INSTRUCTORS(instructor_id)` ON DELETE CASCADE

---

#### Table: COURSE_MODULES

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| module_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each module |
| course_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing COURSES table |
| title | VARCHAR(255) | NOT NULL | "Introduction to HTML" | Module title |
| module_order | INT | NOT NULL | 1, 2, 3 | Order/sequence of module within course |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-15 11:00:00" | Timestamp when module was created |
| updated_at | TIMESTAMP | DEFAULT ON UPDATE | "2024-01-18 09:00:00" | Timestamp when module was last updated |

**Foreign Keys:**
- `course_id` → `COURSES(course_id)` ON DELETE CASCADE

---

#### Table: COURSE_CONTENT

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| content_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each content item |
| module_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing COURSE_MODULES table |
| title | VARCHAR(255) | NOT NULL | "What is HTML?", "HTML Quiz" | Content title |
| content_type | ENUM | NOT NULL | "Video", "Reading", "Quiz" | Type of content |
| content_url | VARCHAR(500) | NULL | "https://example.com/video.mp4" | External URL for content (if applicable) |
| file_path | VARCHAR(500) | NULL | "./uploads/course-content/video/abc123.mp4" | Path to uploaded file on server |
| content_order | INT | NOT NULL | 1, 2, 3 | Order/sequence of content within module |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-15 12:00:00" | Timestamp when content was created |
| updated_at | TIMESTAMP | DEFAULT ON UPDATE | "2024-01-16 10:00:00" | Timestamp when content was last updated |

**Foreign Keys:**
- `module_id` → `COURSE_MODULES(module_id)` ON DELETE CASCADE

---

### 1.6.3 Enrollment and Progress Tracking Tables

#### Table: ENROLLMENTS

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| enrollment_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each enrollment |
| student_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing STUDENTS table |
| course_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing COURSES table |
| enrollment_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-20 09:00:00" | Date and time when student enrolled |
| completion_status | ENUM | DEFAULT 'In Progress' | "In Progress", "Completed" | Current status of enrollment |

**Foreign Keys:**
- `student_id` → `STUDENTS(student_id)` ON DELETE CASCADE
- `course_id` → `COURSES(course_id)` ON DELETE CASCADE

**Unique Constraints:**
- `unique_enrollment (student_id, course_id)` - Prevents duplicate enrollments

---

#### Table: STUDENT_PROGRESS

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| progress_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each progress record |
| student_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing STUDENTS table |
| content_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing COURSE_CONTENT table |
| completed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-25 15:30:00" | Timestamp when content was marked as completed |

**Foreign Keys:**
- `student_id` → `STUDENTS(student_id)` ON DELETE CASCADE
- `content_id` → `COURSE_CONTENT(content_id)` ON DELETE CASCADE

**Unique Constraints:**
- `unique_progress (student_id, content_id)` - Prevents duplicate progress records

---

#### Table: CERTIFICATES

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| certificate_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each certificate |
| enrollment_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing ENROLLMENTS table |
| student_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing STUDENTS table |
| issue_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-02-15 10:00:00" | Date when certificate was issued |
| unique_code | VARCHAR(100) | UNIQUE, NOT NULL | "CERT-2024-001-ABC123XYZ" | Unique verification code for certificate |

**Foreign Keys:**
- `enrollment_id` → `ENROLLMENTS(enrollment_id)` ON DELETE CASCADE
- `student_id` → `STUDENTS(student_id)` ON DELETE CASCADE

---

### 1.6.4 Assessment Tables

#### Table: QUIZZES

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| quiz_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each quiz |
| content_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing COURSE_CONTENT table |
| title | VARCHAR(255) | NOT NULL | "HTML Basics Quiz" | Quiz title |
| max_score | DECIMAL(5,2) | NOT NULL | 100.00, 50.00 | Maximum possible score for the quiz |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-16 10:00:00" | Timestamp when quiz was created |
| updated_at | TIMESTAMP | DEFAULT ON UPDATE | "2024-01-18 14:00:00" | Timestamp when quiz was last updated |

**Foreign Keys:**
- `content_id` → `COURSE_CONTENT(content_id)` ON DELETE CASCADE

---

#### Table: QUIZ_QUESTIONS

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| question_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each question |
| quiz_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing QUIZZES table |
| question_text | TEXT | NOT NULL | "What does HTML stand for?" | The question text |
| options | TEXT | NULL | '["Option A", "Option B", "Option C", "Option D"]' | JSON array of multiple choice options |
| correct_answer | TEXT | NOT NULL | "HyperText Markup Language" | The correct answer to the question |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-16 11:00:00" | Timestamp when question was created |
| updated_at | TIMESTAMP | DEFAULT ON UPDATE | "2024-01-17 09:00:00" | Timestamp when question was last updated |

**Foreign Keys:**
- `quiz_id` → `QUIZZES(quiz_id)` ON DELETE CASCADE

---

#### Table: QUIZ_ATTEMPTS

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| attempt_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each quiz attempt |
| quiz_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing QUIZZES table |
| student_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing STUDENTS table |
| score | DECIMAL(5,2) | NOT NULL | 85.00, 92.50 | Score achieved by student |
| attempt_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-25 14:30:00" | Date and time when quiz was attempted |

**Foreign Keys:**
- `quiz_id` → `QUIZZES(quiz_id)` ON DELETE CASCADE
- `student_id` → `STUDENTS(student_id)` ON DELETE CASCADE

---

### 1.6.5 Gamification Tables

#### Table: BADGES

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| badge_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each badge |
| name | VARCHAR(100) | NOT NULL | "First Course", "Quiz Master" | Badge name |
| description | TEXT | NULL | "Completed your first course" | Badge description |
| icon_url | VARCHAR(500) | NULL | "https://example.com/badges/first-course.png" | URL to badge icon image |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-01-01 08:00:00" | Timestamp when badge was created |

---

#### Table: USER_BADGES

| Column | Data Type | Constraint | Example | Description |
|--------|-----------|------------|---------|-------------|
| user_badge_id | BIGINT | PK, AUTO_INCREMENT | 1, 2, 3 | Unique identifier for each user-badge association |
| student_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing STUDENTS table |
| badge_id | BIGINT | FK, NOT NULL | 1, 2 | Foreign key referencing BADGES table |
| earned_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | "2024-02-15 16:00:00" | Timestamp when badge was earned by student |

**Foreign Keys:**
- `student_id` → `STUDENTS(student_id)` ON DELETE CASCADE
- `badge_id` → `BADGES(badge_id)` ON DELETE CASCADE

**Unique Constraints:**
- `unique_user_badge (student_id, badge_id)` - Prevents duplicate badge awards

---

### 1.6.6 Database Relationships Summary

**Primary Relationships:**
1. **COURSES** → **CATEGORIES** (Many-to-One): Each course belongs to one category
2. **COURSES** → **INSTRUCTORS** (Many-to-One): Each course is created by one instructor
3. **COURSE_MODULES** → **COURSES** (Many-to-One): Each module belongs to one course
4. **COURSE_CONTENT** → **COURSE_MODULES** (Many-to-One): Each content item belongs to one module
5. **ENROLLMENTS** → **STUDENTS** (Many-to-One): Each enrollment belongs to one student
6. **ENROLLMENTS** → **COURSES** (Many-to-One): Each enrollment is for one course
7. **STUDENT_PROGRESS** → **STUDENTS** (Many-to-One): Each progress record belongs to one student
8. **STUDENT_PROGRESS** → **COURSE_CONTENT** (Many-to-One): Each progress record tracks one content item
9. **CERTIFICATES** → **ENROLLMENTS** (Many-to-One): Each certificate is linked to one enrollment
10. **CERTIFICATES** → **STUDENTS** (Many-to-One): Each certificate belongs to one student
11. **QUIZZES** → **COURSE_CONTENT** (One-to-One): Each quiz is associated with one content item
12. **QUIZ_QUESTIONS** → **QUIZZES** (Many-to-One): Each question belongs to one quiz
13. **QUIZ_ATTEMPTS** → **QUIZZES** (Many-to-One): Each attempt is for one quiz
14. **QUIZ_ATTEMPTS** → **STUDENTS** (Many-to-One): Each attempt is by one student
15. **USER_BADGES** → **STUDENTS** (Many-to-One): Each user-badge record belongs to one student
16. **USER_BADGES** → **BADGES** (Many-to-One): Each user-badge record references one badge

**Total Tables:** 15  
**Total Foreign Key Relationships:** 16

---

## 1.7 Success Criteria

### Functional Success Criteria
- [ ] All three user roles (Admin, Instructor, Student) can register and authenticate
- [ ] Instructors can create, edit, and publish courses
- [ ] Students can enroll in courses and access content
- [ ] Quiz system functions correctly with automatic grading
- [ ] Progress tracking displays accurate completion percentages
- [ ] Certificates generate automatically upon course completion
- [ ] Badges are awarded based on defined criteria
- [ ] All role-based access controls are enforced correctly

### Performance Success Criteria
- [ ] System maintains 99.5% uptime
- [ ] Average API response time < 500ms
- [ ] Page load time < 2 seconds
- [ ] Support 500+ concurrent users
- [ ] Database queries execute in < 100ms

### Adoption Success Criteria
- [ ] 80%+ user satisfaction score
- [ ] 75%+ course completion rate
- [ ] < 24-hour support response time
- [ ] Zero data breaches

---

## 1.8 Project Constraints and Risks

### Constraints
1. **Timeline**: Project must be completed within academic semester (4 months)
2. **Budget**: Limited to free/open-source technologies
3. **Team Size**: Small development team (1-3 people)
4. **Deployment**: Must run on university servers or cloud platform

### Risks and Mitigation
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Large video files slow system | High | Implement video compression, CDN setup |
| Database performance issues | High | Indexing, query optimization, regular backups |
| Security vulnerabilities | Critical | Regular security audits, OWASP compliance |
| Scope creep | Medium | Strict requirement management |
| User adoption resistance | Medium | Training and documentation |

---

## Appendix: Sample Database Views

### View 1: Course Overview
Shows all courses with enrollment counts and instructor details.

### View 2: Student Dashboard
Displays student progress across enrolled courses, completed content, earned badges, and certificates.

### View 3: Instructor Statistics
Shows instructor's total courses, enrollments, and student performance metrics.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-12 | AI Assistant | Initial scope document creation |

---

**End of Project Scope Document**
