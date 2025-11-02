# 🎓 LMS E-Learning Platform

A comprehensive Learning Management System (LMS) built with Spring Boot and React, similar to Coursera and Udemy.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Contributing](#contributing)

---

## ✨ Features

### Current Features (v0.1)
- ✅ User Management (CRUD operations)
- ✅ JWT Authentication & Authorization
- ✅ MySQL Database with 19 tables
- ✅ Docker containerization
- ✅ RESTful API design
- ✅ Postman API testing collection

### Planned Features
- 🔄 Course Management (Create, Edit, Publish)
- 🔄 Video Streaming & Content Delivery
- 🔄 Quiz & Assignment System
- 🔄 Progress Tracking & Analytics
- 🔄 Certificate Generation
- 🔄 Payment Integration (Stripe/PayPal)
- 🔄 Real-time Chat & Discussions
- 🔄 Email Notifications
- 🔄 Search & Filtering
- 🔄 Recommendation System
- 🔄 Mobile App (React Native)

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.7
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **API Documentation**: Swagger/OpenAPI (planned)

### Frontend (Planned)
- **Framework**: React.js 18+
- **UI Library**: TailwindCSS + shadcn/ui
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Video Player**: Video.js

### DevOps
- **Containerization**: Docker
- **Database Admin**: PhpMyAdmin
- **Version Control**: Git
- **CI/CD**: GitHub Actions (planned)

---

## 📁 Project Structure

```
lms_e_learn/
├── database/
│   ├── lms_schema.sql              # Database schema (19 tables)
│   ├── test_queries.sql            # Test queries
│   └── TESTING_GUIDE.md            # Database testing guide
├── src/main/java/e_learn_/lms_e_learn/
│   ├── controller/                 # REST API controllers
│   │   └── UserController.java
│   ├── dto/                        # Data Transfer Objects
│   │   ├── UserRequest.java
│   │   └── UserResponse.java
│   ├── entity/                     # JPA Entities
│   │   └── User.java
│   ├── repository/                 # Data access layer
│   │   └── UserRepository.java
│   ├── service/                    # Business logic
│   │   └── UserService.java
│   └── LmsELearnApplication.java   # Main application
├── src/main/resources/
│   └── application.properties      # Application configuration
├── docker-compose.yml              # Docker services
├── Dockerfile                      # Docker image
├── pom.xml                         # Maven dependencies
├── POSTMAN_TESTING_GUIDE.md        # API testing guide
├── PROJECT_ROADMAP.md              # Development roadmap
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Docker Desktop
- Git
- Postman (for API testing)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/lms-elearning-platform.git
cd lms-elearning-platform
```

#### 2. Start Docker Services
```bash
docker-compose up -d
```

This will start:
- MySQL database on port `3306`
- PhpMyAdmin on port `8081`

#### 3. Import Database Schema
**Option A: Using PhpMyAdmin**
1. Go to http://localhost:8081
2. Login: `lms_user` / `lms_password`
3. Select `lms_elearn_db` database
4. Import `database/lms_schema.sql`

**Option B: Using Command Line**
```bash
docker exec -i lms_mysql mysql -ulms_user -plms_password lms_elearn_db < database/lms_schema.sql
```

#### 4. Run Spring Boot Application
**Option A: Using Maven**
```bash
mvn spring-boot:run
```

**Option B: Using IDE**
- Open project in IntelliJ IDEA / Eclipse / VS Code
- Run `LmsELearnApplication.java`

#### 5. Verify Application is Running
```bash
curl http://localhost:8080/api/users
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints (Planned)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create new user |
| GET | `/users` | Get all users |
| GET | `/users/{id}` | Get user by ID |
| GET | `/users/email/{email}` | Get user by email |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Delete user |

### Testing with Postman
1. Import `LMS_User_API.postman_collection.json`
2. See `POSTMAN_TESTING_GUIDE.md` for detailed instructions

---

## 🗄️ Database Schema

The database consists of **19 tables** organized into 6 categories:

### 1. User Management (3 tables)
- `USERS` - User accounts
- `ADMINS` - Admin users
- `CATEGORIES` - Course categories

### 2. Course Structure (4 tables)
- `COURSES` - Course information
- `COURSE_MODULES` - Course modules
- `COURSE_CONTENT` - Lessons and content
- `RESOURCES` - Downloadable resources

### 3. Enrollment & Progress (3 tables)
- `ENROLLMENTS` - Student enrollments
- `STUDENT_PROGRESS` - Learning progress
- `CERTIFICATES` - Issued certificates

### 4. Assessments (5 tables)
- `QUIZZES` - Quiz definitions
- `QUIZ_QUESTIONS` - Quiz questions
- `QUIZ_ATTEMPTS` - Student attempts
- `ASSIGNMENTS` - Assignment definitions
- `ASSIGNMENT_SUBMISSIONS` - Student submissions

### 5. Gamification (3 tables)
- `BADGES` - Badge definitions
- `USER_BADGES` - Earned badges
- `ACHIEVEMENTS` - Achievement system

### 6. Support (1 table)
- `SUPPORT_REQUESTS` - Support tickets

See `database/lms_schema.sql` for complete schema.

---

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=UserServiceTest
```

### API Testing
1. Start the application
2. Import Postman collection
3. Run test requests
4. See `POSTMAN_TESTING_GUIDE.md`

### Database Testing
```bash
# Run test queries
docker exec -i lms_mysql mysql -ulms_user -plms_password lms_elearn_db < database/test_queries.sql
```

---

## 📊 Development Roadmap

See `PROJECT_ROADMAP.md` for complete development plan.

### Phase 1: Core Backend (Weeks 1-4) 🔄
- [ ] Complete all entity classes
- [ ] Implement JWT authentication
- [ ] Create Course management APIs
- [ ] File upload functionality

### Phase 2: Advanced Features (Weeks 5-8)
- [ ] Video streaming
- [ ] Payment integration
- [ ] Email notifications
- [ ] Search functionality

### Phase 3: Frontend (Weeks 9-12)
- [ ] React application setup
- [ ] Student dashboard
- [ ] Instructor dashboard
- [ ] Course player

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow Java naming conventions
- Write meaningful commit messages
- Add comments for complex logic
- Write unit tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer**: Your Name
- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

## 📞 Support

For support, email your.email@example.com or open an issue on GitHub.

---

## 🙏 Acknowledgments

- Spring Boot Documentation
- MySQL Documentation
- Docker Documentation
- Coursera & Udemy for inspiration

---

## 📈 Project Status

**Current Version**: 0.1.0 (Alpha)  
**Status**: 🔄 In Active Development  
**Last Updated**: October 28, 2025

---

**⭐ Star this repo if you find it helpful!**
