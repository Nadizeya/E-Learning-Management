# Course Creation Fix - JWT Authentication Implementation

## Problem
Course creation was failing because the authentication system was misconfigured:
- Backend had JWT infrastructure but wasn't using it
- Frontend was sending Basic Auth credentials
- Signin endpoint wasn't generating JWT tokens

## Solution Implemented

### Backend Changes

#### 1. Updated `AuthController.java`
- Added `JwtUtil` dependency
- Modified `/api/auth/instructor/signin` endpoint to:
  - Accept Basic Auth for initial authentication
  - Generate JWT token upon successful authentication
  - Return JWT token in response

**Response format:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Sign in successful",
  "username": "INSTRUCTOR_1"
}
```

#### 2. Updated `SecurityConfig.java`
- Enabled HTTP Basic Auth for signin endpoint
- JWT filter handles all other protected endpoints
- Signin flow: Basic Auth → Get JWT → Use JWT for subsequent requests

### Frontend Changes

#### 1. Updated `authService.js`
- Modified `signIn()` to store JWT token instead of password
- Stores: `{ token, email }` in localStorage

#### 2. Updated `api.js`
- Changed request interceptor to send JWT as Bearer token
- Format: `Authorization: Bearer <token>`

## How It Works Now

### Authentication Flow:
1. **Signup**: `POST /api/auth/instructor/signup` (no auth required)
2. **Signin**: 
   - Frontend sends Basic Auth (email/password)
   - Backend validates and returns JWT token
   - Frontend stores JWT token
3. **Course Creation**:
   - Frontend sends `POST /api/instructor/courses` with Bearer token
   - Backend validates JWT token
   - Course created with authenticated instructor ID

### Endpoints

**Public (No Auth):**
- `POST /api/auth/instructor/signup`
- `POST /api/auth/student/**`

**Basic Auth (Signin only):**
- `POST /api/auth/instructor/signin`

**JWT Required:**
- `GET /api/instructor/courses`
- `POST /api/instructor/courses`
- `PUT /api/instructor/courses/{id}`
- `DELETE /api/instructor/courses/{id}`
- `GET /api/auth/instructor/me`

## Testing

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow
1. Navigate to `http://localhost:5173/instructor/signup`
2. Create an instructor account
3. Sign in at `/instructor/signin`
4. Go to dashboard and create a course
5. Check browser DevTools → Network tab to see JWT token in requests

## Course Creation API

**Endpoint:** `POST /api/instructor/courses`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categoryId": 1,
  "title": "Introduction to Web Development",
  "description": "Learn HTML, CSS, and JavaScript",
  "status": "Draft"
}
```

**Response:**
```json
{
  "courseId": 1,
  "categoryId": 1,
  "instructorId": 1,
  "title": "Introduction to Web Development",
  "description": "Learn HTML, CSS, and JavaScript",
  "status": "Draft",
  "createdAt": "2025-11-06T13:30:00",
  "updatedAt": "2025-11-06T13:30:00"
}
```

## Security Notes

- JWT tokens expire after 24 hours (configurable in `application.properties`)
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- CORS is configured for `localhost:5173` and `localhost:3000`
- Passwords are hashed with BCrypt

## Files Modified

### Backend:
- `AuthController.java` - Added JWT token generation
- `SecurityConfig.java` - Enabled Basic Auth + JWT
- `CustomUserDetailsService.java` - Marked as @Primary

### Frontend:
- `authService.js` - Store JWT token
- `api.js` - Send Bearer token
- `App.jsx` - Unified routing

## Next Steps

1. ✅ Course creation now works
2. Consider implementing token refresh mechanism
3. Add token expiration handling in frontend
4. Implement proper error messages for expired tokens
5. Consider moving to httpOnly cookies for better security
