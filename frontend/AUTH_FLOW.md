# Authentication Flow Documentation

## Overview
The application now has a proper landing page with separate authentication flows for Students and Instructors.

## Pages Created

### 1. Landing Page (`/`)
- **File**: `src/pages/Landing.jsx`
- **Features**:
  - Hero section with LearnHub branding
  - Sign In button with dropdown menu
  - Two options: "Sign in as Student" and "Sign in as Instructor"
  - Call-to-action buttons for student and instructor signup
  - Features section highlighting platform benefits
  - Responsive design

### 2. Student Authentication
- **Sign In**: `/student/signin` → `src/pages/StudentSignIn.jsx`
- **Sign Up**: `/student/signup` → `src/pages/StudentSignUp.jsx`
- **Home**: `/student/home` → `src/pages/StudentHome.jsx`

### 3. Instructor Authentication
- **Sign In**: `/instructor/signin` → `src/pages/InstructorSignIn.jsx`
- **Sign Up**: `/instructor/signup` → `src/pages/InstructorSignUp.jsx`
- **Dashboard**: `/instructor/dashboard` (placeholder for now)

### 4. Admin Authentication
- **Sign In**: `/signin` → `src/pages/SignIn.jsx` (existing)
- **Dashboard**: `/admin` → `src/pages/AdminDashboard.jsx` (existing)

## Key Changes

### StudentHome.jsx
- Added `isLoggedIn` state (currently hardcoded to `true`)
- Settings button now only shows when user is logged in
- User avatar, name, and logout button are conditional on login status
- Admin buttons remain visible for development purposes

### Routing (main.jsx)
- Landing page is now the default route (`/`)
- Added routes for student and instructor auth pages
- StudentHome moved to `/student/home`

## Styling
- **Landing.css**: Styles for the landing page
- **Auth.css**: Shared styles for all authentication pages (sign in/sign up)
- Clean, modern design with gradient backgrounds
- Fully responsive for mobile devices

## TODO: Backend Integration
Currently, the authentication pages have placeholder API calls. You need to:

1. **Student Authentication API**:
   ```javascript
   POST /api/students/auth/login
   POST /api/students/auth/register
   ```

2. **Instructor Authentication API**:
   ```javascript
   POST /api/instructors/auth/login
   POST /api/instructors/auth/register
   ```

3. **Update Auth State**:
   - Replace hardcoded `isLoggedIn` with actual auth context
   - Store JWT tokens in localStorage or cookies
   - Implement proper logout functionality
   - Add protected routes

## User Flow

1. User visits `/` (Landing page)
2. Clicks "Sign In" button
3. Dropdown shows two options:
   - Sign in as Student → `/student/signin`
   - Sign in as Instructor → `/instructor/signin`
4. After successful login:
   - Students → `/student/home`
   - Instructors → `/instructor/dashboard`
5. Settings button only appears when logged in

## Development Notes
- All auth pages have error handling UI
- Form validation is implemented
- Loading states are handled
- "Remember me" and "Forgot password" UI elements are present
- Links between sign in and sign up pages work correctly
