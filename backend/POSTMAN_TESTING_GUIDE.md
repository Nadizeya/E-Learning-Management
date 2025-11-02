# Postman Testing Guide for LMS API

Complete guide to test your LMS User API endpoints using Postman.

---

## 🚀 Prerequisites

1. **Start Docker containers:**
   ```bash
   docker-compose up -d
   ```

2. **Import database schema** (if not done):
   - Go to http://localhost:8081 (PhpMyAdmin)
   - Import `database/lms_schema.sql`

3. **Start Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```
   
   Or run from your IDE. Application should start on **http://localhost:8080**

4. **Install Postman:**
   - Download from: https://www.postman.com/downloads/

---

## 📋 API Endpoints

Base URL: `http://localhost:8080/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create new user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| GET | `/api/users/email/{email}` | Get user by email |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

---

## 🧪 Test Cases in Postman

### 1. CREATE NEW USER (POST)

**Endpoint:** `POST http://localhost:8080/api/users`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "firstName": "Michael",
  "lastName": "Scott",
  "email": "michael.scott@lms.com",
  "password": "password123",
  "isInstructor": false
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": 6,
    "firstName": "Michael",
    "lastName": "Scott",
    "email": "michael.scott@lms.com",
    "isInstructor": false,
    "createdAt": "2024-10-28T23:00:00",
    "updatedAt": "2024-10-28T23:00:00"
  }
}
```

**Test Variations:**

**a) Create Instructor:**
```json
{
  "firstName": "Dwight",
  "lastName": "Schrute",
  "email": "dwight.schrute@lms.com",
  "password": "beets123",
  "isInstructor": true
}
```

**b) Create Student (default):**
```json
{
  "firstName": "Jim",
  "lastName": "Halpert",
  "email": "jim.halpert@lms.com",
  "password": "pranks123",
  "isInstructor": false
}
```

**c) Test Duplicate Email (Should Fail):**
```json
{
  "firstName": "Duplicate",
  "lastName": "User",
  "email": "michael.scott@lms.com",
  "password": "test123",
  "isInstructor": false
}
```

**Expected Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email already exists: michael.scott@lms.com"
}
```

---

### 2. GET ALL USERS (GET)

**Endpoint:** `GET http://localhost:8080/api/users`

**Headers:** None required

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "isInstructor": false,
      "createdAt": "2024-10-28T22:00:00",
      "updatedAt": "2024-10-28T22:00:00"
    },
    {
      "userId": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "isInstructor": true,
      "createdAt": "2024-10-28T22:00:00",
      "updatedAt": "2024-10-28T22:00:00"
    }
  ]
}
```

---

### 3. GET USER BY ID (GET)

**Endpoint:** `GET http://localhost:8080/api/users/1`

**Headers:** None required

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isInstructor": false,
    "createdAt": "2024-10-28T22:00:00",
    "updatedAt": "2024-10-28T22:00:00"
  }
}
```

**Test Invalid ID:**
`GET http://localhost:8080/api/users/9999`

**Expected Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "User not found with id: 9999"
}
```

---

### 4. GET USER BY EMAIL (GET)

**Endpoint:** `GET http://localhost:8080/api/users/email/john.doe@example.com`

**Headers:** None required

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isInstructor": false,
    "createdAt": "2024-10-28T22:00:00",
    "updatedAt": "2024-10-28T22:00:00"
  }
}
```

---

### 5. UPDATE USER (PUT)

**Endpoint:** `PUT http://localhost:8080/api/users/6`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "firstName": "Michael",
  "lastName": "Scott-Updated",
  "email": "michael.scott.updated@lms.com",
  "password": "newpassword123",
  "isInstructor": true
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "userId": 6,
    "firstName": "Michael",
    "lastName": "Scott-Updated",
    "email": "michael.scott.updated@lms.com",
    "isInstructor": true,
    "createdAt": "2024-10-28T23:00:00",
    "updatedAt": "2024-10-28T23:05:00"
  }
}
```

**Test Update with Existing Email (Should Fail):**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "john.doe@example.com",
  "password": "test123",
  "isInstructor": false
}
```

---

### 6. DELETE USER (DELETE)

**Endpoint:** `DELETE http://localhost:8080/api/users/6`

**Headers:** None required

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Test Delete Non-existent User:**
`DELETE http://localhost:8080/api/users/9999`

**Expected Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "User not found with id: 9999"
}
```

---

## 📦 Postman Collection Setup

### Option 1: Manual Setup

1. **Open Postman**
2. **Create New Collection:**
   - Click "New" → "Collection"
   - Name: "LMS User API"
   - Description: "User management endpoints for LMS"

3. **Add Requests:**
   - Click "Add Request" for each endpoint above
   - Set method (GET, POST, PUT, DELETE)
   - Enter URL
   - Add headers and body as specified

### Option 2: Import Collection (Recommended)

I'll create a Postman collection file you can import directly.

---

## 🎯 Step-by-Step Testing Workflow

### Complete Test Scenario:

1. **Get All Users (Initial State)**
   ```
   GET http://localhost:8080/api/users
   ```
   Note the count of existing users.

2. **Create New Student**
   ```
   POST http://localhost:8080/api/users
   Body: {
     "firstName": "Test",
     "lastName": "Student",
     "email": "test.student@lms.com",
     "password": "student123",
     "isInstructor": false
   }
   ```
   Save the returned `userId` (e.g., 6)

3. **Create New Instructor**
   ```
   POST http://localhost:8080/api/users
   Body: {
     "firstName": "Test",
     "lastName": "Instructor",
     "email": "test.instructor@lms.com",
     "password": "instructor123",
     "isInstructor": true
   }
   ```
   Save the returned `userId` (e.g., 7)

4. **Get All Users (Verify Creation)**
   ```
   GET http://localhost:8080/api/users
   ```
   Count should increase by 2.

5. **Get User by ID**
   ```
   GET http://localhost:8080/api/users/6
   ```
   Should return the student you created.

6. **Get User by Email**
   ```
   GET http://localhost:8080/api/users/email/test.student@lms.com
   ```
   Should return the same student.

7. **Update User**
   ```
   PUT http://localhost:8080/api/users/6
   Body: {
     "firstName": "Updated",
     "lastName": "Student",
     "email": "updated.student@lms.com",
     "password": "newpassword",
     "isInstructor": false
   }
   ```
   Check `updatedAt` timestamp changed.

8. **Verify Update**
   ```
   GET http://localhost:8080/api/users/6
   ```
   Should show updated information.

9. **Delete User**
   ```
   DELETE http://localhost:8080/api/users/6
   ```
   Should return success message.

10. **Verify Deletion**
    ```
    GET http://localhost:8080/api/users/6
    ```
    Should return 404 error.

---

## 🔍 Testing Tips

### 1. Use Postman Variables

Create environment variables:
- `base_url`: `http://localhost:8080`
- `user_id`: Store created user ID

Then use: `{{base_url}}/api/users/{{user_id}}`

### 2. Use Tests Tab

Add automatic tests in Postman:

```javascript
// Test for successful creation
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has success true", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("User has email", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.email).to.exist;
});
```

### 3. Save Responses

Use Postman's "Save Response" to compare before/after states.

### 4. Use Pre-request Scripts

Generate random data:

```javascript
pm.environment.set("random_email", 
    "user" + Math.floor(Math.random() * 10000) + "@lms.com"
);
```

Then use `{{random_email}}` in your request body.

---

## 🐛 Common Issues & Solutions

### Issue 1: Connection Refused
**Problem:** Cannot connect to http://localhost:8080

**Solution:**
```bash
# Check if Spring Boot is running
# Look for "Started LmsELearnApplication" in console

# Check if port 8080 is in use
netstat -ano | findstr :8080
```

### Issue 2: 500 Internal Server Error
**Problem:** Database connection issues

**Solution:**
```bash
# Check Docker containers
docker-compose ps

# Check MySQL logs
docker-compose logs mysql

# Verify database exists
docker exec -it lms_mysql mysql -ulms_user -plms_password -e "SHOW DATABASES;"
```

### Issue 3: 400 Bad Request
**Problem:** Invalid JSON format

**Solution:**
- Verify JSON syntax (use JSON validator)
- Check Content-Type header is `application/json`
- Ensure all required fields are present

---

## 📊 Verify in Database

After testing in Postman, verify in PhpMyAdmin:

1. Go to http://localhost:8081
2. Select `lms_elearn_db`
3. Click on `USERS` table
4. Click "Browse" to see all users
5. Verify your test users are there

Or use SQL:
```sql
SELECT * FROM USERS ORDER BY created_at DESC LIMIT 5;
```

---

## 🎉 Next Steps

Once user management works:

1. Create similar endpoints for:
   - Courses (`/api/courses`)
   - Enrollments (`/api/enrollments`)
   - Assignments (`/api/assignments`)
   - Quizzes (`/api/quizzes`)

2. Add authentication (JWT tokens)

3. Add validation (email format, password strength)

4. Add pagination for GET all endpoints

5. Add search and filter capabilities

---

**Happy Testing! 🚀**
