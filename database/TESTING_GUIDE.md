# Database Testing Guide

This guide will help you test your LMS database schema using different methods.

---

## 🎯 Testing Methods

### Method 1: Using PhpMyAdmin (Easiest)
### Method 2: Using MySQL Command Line
### Method 3: Using Spring Boot Application
### Method 4: Using MySQL Workbench

---

## 📋 Method 1: PhpMyAdmin (Recommended for Beginners)

### Step 1: Access PhpMyAdmin
1. Make sure Docker containers are running:
   ```bash
   docker-compose up -d
   ```

2. Open your browser and go to: **http://localhost:8081**

3. Login with:
   - **Username**: `lms_user`
   - **Password**: `lms_password`

### Step 2: Import the Schema
1. Click on **lms_elearn_db** database in the left sidebar
2. Click the **Import** tab at the top
3. Click **Choose File** and select `lms_schema.sql`
4. Scroll down and click **Import**
5. Wait for success message

### Step 3: Verify Tables
1. Click on **lms_elearn_db** in the left sidebar
2. You should see all 19 tables listed
3. Click on any table name to view its structure and data

### Step 4: Run Test Queries
1. Click the **SQL** tab at the top
2. Copy queries from `test_queries.sql`
3. Paste into the SQL editor
4. Click **Go** to execute
5. View results below

### Example Queries to Try:

**Check all tables:**
```sql
SHOW TABLES;
```

**View all users:**
```sql
SELECT * FROM USERS;
```

**View course overview:**
```sql
SELECT * FROM v_course_overview;
```

**Check enrollments:**
```sql
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS student,
    c.title AS course,
    e.completion_status
FROM ENROLLMENTS e
JOIN USERS u ON e.user_id = u.user_id
JOIN COURSES c ON e.course_id = c.course_id;
```

---

## 📋 Method 2: MySQL Command Line

### Step 1: Connect to MySQL Container
```bash
docker exec -it lms_mysql mysql -ulms_user -plms_password lms_elearn_db
```

### Step 2: Import Schema (if not already done)
```bash
docker exec -i lms_mysql mysql -ulms_user -plms_password lms_elearn_db < database/lms_schema.sql
```

### Step 3: Run Queries
Once connected, you can run SQL commands directly:

```sql
-- Show all tables
SHOW TABLES;

-- Describe a table structure
DESCRIBE USERS;

-- Run any query
SELECT * FROM USERS;

-- Exit
EXIT;
```

### Step 4: Run Test File
```bash
docker exec -i lms_mysql mysql -ulms_user -plms_password lms_elearn_db < database/test_queries.sql
```

---

## 📋 Method 3: Using Spring Boot Application

### Step 1: Create a Test Controller

Create a file: `src/main/java/e_learn_/lms_e_learn/TestController.java`

```java
package e_learn_.lms_e_learn;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @GetMapping("/tables")
    public List<Map<String, Object>> getTables() {
        return jdbcTemplate.queryForList("SHOW TABLES");
    }
    
    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        return jdbcTemplate.queryForList("SELECT * FROM USERS");
    }
    
    @GetMapping("/courses")
    public List<Map<String, Object>> getCourses() {
        return jdbcTemplate.queryForList(
            "SELECT c.*, CONCAT(u.first_name, ' ', u.last_name) AS instructor " +
            "FROM COURSES c JOIN USERS u ON c.instructor_id = u.user_id"
        );
    }
    
    @GetMapping("/enrollments")
    public List<Map<String, Object>> getEnrollments() {
        return jdbcTemplate.queryForList(
            "SELECT e.*, CONCAT(u.first_name, ' ', u.last_name) AS student, " +
            "c.title AS course_title FROM ENROLLMENTS e " +
            "JOIN USERS u ON e.user_id = u.user_id " +
            "JOIN COURSES c ON e.course_id = c.course_id"
        );
    }
}
```

### Step 2: Run Your Spring Boot App
```bash
mvn spring-boot:run
```

### Step 3: Test Endpoints
Open your browser or use curl:

```bash
# Get all tables
curl http://localhost:8080/api/test/tables

# Get all users
curl http://localhost:8080/api/test/users

# Get all courses
curl http://localhost:8080/api/test/courses

# Get all enrollments
curl http://localhost:8080/api/test/enrollments
```

---

## 📋 Method 4: MySQL Workbench

### Step 1: Install MySQL Workbench
Download from: https://dev.mysql.com/downloads/workbench/

### Step 2: Create Connection
1. Open MySQL Workbench
2. Click **+** next to "MySQL Connections"
3. Enter connection details:
   - **Connection Name**: LMS Database
   - **Hostname**: localhost
   - **Port**: 3306
   - **Username**: lms_user
   - **Password**: lms_password (click "Store in Keychain")
4. Click **Test Connection**
5. Click **OK**

### Step 3: Open Connection
1. Double-click on your new connection
2. Select `lms_elearn_db` from the schema list

### Step 4: Import and Test
1. Go to **File** → **Open SQL Script**
2. Select `lms_schema.sql` and execute
3. Open `test_queries.sql` and run individual queries

---

## ✅ Quick Verification Checklist

Run these queries to verify everything is working:

### 1. Check All Tables Exist (Should show 19 tables)
```sql
SELECT COUNT(*) AS total_tables 
FROM information_schema.tables 
WHERE table_schema = 'lms_elearn_db';
```

### 2. Check Sample Data Loaded
```sql
SELECT 
    'USERS' AS table_name, COUNT(*) AS records FROM USERS
UNION ALL
SELECT 'COURSES', COUNT(*) FROM COURSES
UNION ALL
SELECT 'ENROLLMENTS', COUNT(*) FROM ENROLLMENTS;
```

### 3. Test Foreign Keys Work
```sql
-- This should work (valid instructor_id)
INSERT INTO COURSES (category_id, instructor_id, title, description, price, status)
VALUES (1, 2, 'Test Course', 'Test Description', 49.99, 'Draft');

-- This should fail (invalid instructor_id)
INSERT INTO COURSES (category_id, instructor_id, title, description, price, status)
VALUES (1, 9999, 'Test Course', 'Test Description', 49.99, 'Draft');
```

### 4. Test Views Work
```sql
SELECT * FROM v_course_overview;
SELECT * FROM v_student_dashboard;
SELECT * FROM v_instructor_stats;
```

---

## 🧪 Common Test Scenarios

### Scenario 1: Enroll a Student in a Course
```sql
-- Check available courses
SELECT course_id, title, status FROM COURSES WHERE status = 'Published';

-- Enroll student (user_id = 1) in course (course_id = 1)
INSERT INTO ENROLLMENTS (user_id, course_id, completion_status)
VALUES (1, 1, 'In Progress');

-- Verify enrollment
SELECT * FROM ENROLLMENTS WHERE user_id = 1;
```

### Scenario 2: Track Student Progress
```sql
-- Mark content as completed
INSERT INTO STUDENT_PROGRESS (user_id, content_id)
VALUES (1, 1);

-- Check progress
SELECT 
    c.title AS course,
    cc.title AS content,
    sp.completed_at
FROM STUDENT_PROGRESS sp
JOIN COURSE_CONTENT cc ON sp.content_id = cc.content_id
JOIN COURSE_MODULES cm ON cc.module_id = cm.module_id
JOIN COURSES c ON cm.course_id = c.course_id
WHERE sp.user_id = 1;
```

### Scenario 3: Submit and Grade an Assignment
```sql
-- Submit assignment
INSERT INTO ASSIGNMENT_SUBMISSIONS (assignment_id, user_id, file_url)
VALUES (1, 1, 'https://example.com/submissions/assignment1.pdf');

-- Grade assignment (as instructor)
UPDATE ASSIGNMENT_SUBMISSIONS
SET grade_score = 95.00, 
    instructor_feedback = 'Excellent work!'
WHERE submission_id = 1;

-- View graded assignments
SELECT * FROM ASSIGNMENT_SUBMISSIONS WHERE user_id = 1;
```

### Scenario 4: Award a Badge
```sql
-- Award badge to user
INSERT INTO USER_BADGES (user_id, badge_id)
VALUES (1, 1);

-- View user's badges
SELECT 
    u.first_name,
    b.name AS badge_name,
    ub.earned_at
FROM USER_BADGES ub
JOIN USERS u ON ub.user_id = u.user_id
JOIN BADGES b ON ub.badge_id = b.badge_id
WHERE u.user_id = 1;
```

---

## 🐛 Troubleshooting

### Problem: "Table already exists" error
**Solution**: Drop all tables first
```sql
DROP DATABASE IF EXISTS lms_elearn_db;
CREATE DATABASE lms_elearn_db;
USE lms_elearn_db;
-- Then run lms_schema.sql
```

### Problem: "Cannot connect to database"
**Solution**: Check Docker containers
```bash
docker-compose ps
docker-compose logs mysql
```

### Problem: "Foreign key constraint fails"
**Solution**: Make sure parent records exist first
```sql
-- Check if user exists before creating course
SELECT * FROM USERS WHERE user_id = 2;
```

### Problem: Views not working
**Solution**: Recreate views
```sql
DROP VIEW IF EXISTS v_course_overview;
DROP VIEW IF EXISTS v_student_dashboard;
DROP VIEW IF EXISTS v_instructor_stats;
-- Then run the CREATE VIEW statements again
```

---

## 📊 Performance Testing

### Test Query Performance
```sql
-- Enable query profiling
SET profiling = 1;

-- Run a complex query
SELECT * FROM v_course_overview;

-- View profile
SHOW PROFILES;

-- Disable profiling
SET profiling = 0;
```

### Check Index Usage
```sql
EXPLAIN SELECT * FROM COURSES WHERE instructor_id = 2;
EXPLAIN SELECT * FROM ENROLLMENTS WHERE user_id = 1;
```

---

## 🎓 Next Steps

1. ✅ Import `lms_schema.sql` into your database
2. ✅ Run basic verification queries from `test_queries.sql`
3. ✅ Test CRUD operations (Create, Read, Update, Delete)
4. ✅ Test all views work correctly
5. ✅ Create Spring Boot entities and repositories
6. ✅ Build REST API endpoints
7. ✅ Create frontend to interact with the database

---

## 📚 Additional Resources

- **PhpMyAdmin Docs**: https://docs.phpmyadmin.net/
- **MySQL Reference**: https://dev.mysql.com/doc/
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa

---

**Happy Testing! 🚀**
