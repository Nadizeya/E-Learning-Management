# Quick Start - Postman Testing

## 🚀 Setup (3 Steps)

### 1. Start Everything
```bash
# Start Docker
docker-compose up -d

# Start Spring Boot (from IDE or terminal)
mvn spring-boot:run
```

### 2. Import Postman Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select `LMS_User_API.postman_collection.json`
4. Click **Import**

### 3. Test!
Click on any request and hit **Send**

---

## 📝 Quick Test Sequence

### Test 1: Create User
```
POST http://localhost:8080/api/users

Body:
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@lms.com",
  "password": "test123",
  "isInstructor": false
}
```
✅ Should return 201 with user data

### Test 2: Get All Users
```
GET http://localhost:8080/api/users
```
✅ Should return list of all users

### Test 3: Get User by ID
```
GET http://localhost:8080/api/users/1
```
✅ Should return user with ID 1

### Test 4: Update User
```
PUT http://localhost:8080/api/users/6

Body:
{
  "firstName": "Updated",
  "lastName": "User",
  "email": "updated@lms.com",
  "password": "new123",
  "isInstructor": true
}
```
✅ Should return updated user data

### Test 5: Delete User
```
DELETE http://localhost:8080/api/users/6
```
✅ Should return success message

---

## 🎯 Common Request Bodies

### Create Student
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@lms.com",
  "password": "password123",
  "isInstructor": false
}
```

### Create Instructor
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@lms.com",
  "password": "password123",
  "isInstructor": true
}
```

---

## ✅ Expected Status Codes

| Action | Success | Error |
|--------|---------|-------|
| Create User | 201 Created | 400 Bad Request |
| Get Users | 200 OK | 500 Server Error |
| Get User by ID | 200 OK | 404 Not Found |
| Update User | 200 OK | 400/404 |
| Delete User | 200 OK | 404 Not Found |

---

## 🐛 Troubleshooting

**Can't connect?**
```bash
# Check Spring Boot is running
# Look for: "Started LmsELearnApplication"
```

**Database error?**
```bash
# Check Docker
docker-compose ps

# Should see lms_mysql and lms_phpmyadmin running
```

**Port 8080 in use?**
```bash
# Find and kill process
netstat -ano | findstr :8080
taskkill /PID <process_id> /F
```

---

## 📊 Verify in Database

After creating users, check in PhpMyAdmin:
1. Go to http://localhost:8081
2. Login: `lms_user` / `lms_password`
3. Select `lms_elearn_db` → `USERS` table
4. Click **Browse**

---

## 🎉 You're Ready!

All API endpoints are working. Start testing! 🚀
