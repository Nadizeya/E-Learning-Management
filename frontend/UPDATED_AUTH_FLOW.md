# Updated Authentication Flow

## Overview
StudentHome is now the landing page. It shows different UI based on login status.

## Key Changes

### 1. StudentHome as Landing Page
- **Route**: `/` → `StudentHome.jsx`
- **Behavior**: 
  - When NOT logged in: Shows "Sign In" dropdown button
  - When logged in: Shows Settings, Profile Avatar, and Logout

### 2. Sign In Dropdown (When Not Logged In)
- Click "Sign In" button → Dropdown appears with 2 options:
  - **Sign in as Student** → `/student/signin`
  - **Sign in as Instructor** → `/instructor/signin`

### 3. Removed Features
- ❌ Separate Landing page (deleted)
- ❌ Continue Learning section (moved to profile settings)
- ❌ EnrolledCourseCard component (no longer needed)

### 4. Conditional UI Elements
**When `isLoggedIn = false`:**
- ✅ Sign In dropdown button
- ❌ Settings button
- ❌ User avatar
- ❌ User name
- ❌ Logout button

**When `isLoggedIn = true`:**
- ❌ Sign In dropdown button
- ✅ Settings button
- ✅ User avatar
- ✅ User name ("Hi, Alex!")
- ✅ Logout button

### 5. Current Routes
```
/ → StudentHome (landing page with courses)
/student/signin → Student Sign In
/student/signup → Student Sign Up
/instructor/signin → Instructor Sign In
/instructor/signup → Instructor Sign Up
/instructor/dashboard → Placeholder
/signin → Admin Sign In
/admin → Admin Dashboard
/settings → Student Settings
/enroll/:id → Course Enrollment
/course/:id → Course Player
```

## Files Modified

1. **StudentHome.jsx**
   - Added `showSignInDropdown` state
   - Changed `isLoggedIn` default to `false`
   - Removed `enrolledCourses` state
   - Added Sign In dropdown in navbar
   - Removed Continue Learning section
   - Removed EnrolledCourseCard component

2. **StudentHome.css**
   - Added dropdown styles (`.signin-dropdown-wrapper`, `.btn-signin-nav`, etc.)
   - Dropdown animation and hover effects

3. **main.jsx**
   - Changed `/` route to `StudentHome`
   - Removed `Landing` import
   - Removed `/student/home` duplicate route

## TODO: Backend Integration

Update `isLoggedIn` state based on actual authentication:
```javascript
// Replace this line in StudentHome.jsx:
const [isLoggedIn] = useState(false)

// With actual auth context:
const { isAuthenticated } = useAuth()
```

## User Flow

### First-time Visitor
1. Visits `/` → Sees StudentHome with all courses
2. Clicks "Sign In" → Dropdown shows Student/Instructor options
3. Selects role → Redirected to sign-in page
4. After login → Redirected back to `/` with logged-in UI

### Logged-in User
1. Visits `/` → Sees StudentHome with Settings, Avatar, Logout
2. Can browse courses and enroll
3. Settings button visible in navbar
4. Continue Learning will be in Settings page (not on home)

## Notes
- Landing.jsx and Landing.css files can be deleted (no longer used)
- Continue Learning feature will be implemented in Student Settings
- All auth pages (Student/Instructor Sign In/Up) are still functional
