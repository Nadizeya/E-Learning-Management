# Course Metadata Enhancement

## Overview
Added rich metadata fields to courses so instructors can provide better course information instead of showing fake/mock data in the enrollment page.

## Changes Made

### 1. Database Migration
**File**: `backend/database/migration_add_course_metadata.sql`

Run this SQL to add new fields to COURSES table:
```sql
ALTER TABLE COURSES
ADD COLUMN thumbnail VARCHAR(10) DEFAULT '🎓' COMMENT 'Emoji or icon for course',
ADD COLUMN color VARCHAR(7) DEFAULT '#667eea' COMMENT 'Hex color for course theme',
ADD COLUMN level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
ADD COLUMN duration VARCHAR(50) DEFAULT '6 weeks' COMMENT 'Estimated course duration',
ADD COLUMN price DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Course price (0 for free)',
ADD INDEX idx_level (level);
```

**How to run**:
```bash
# Option 1: Using MySQL command line
mysql -u root -p lms_db < backend/database/migration_add_course_metadata.sql

# Option 2: Using MySQL Workbench
# Open the migration file and execute it
```

### 2. Backend Updates

#### Course Entity (`Course.java`)
- ✅ Added fields: `thumbnail`, `color`, `level`, `duration`, `price`
- ✅ Added getters and setters

#### Course DTOs
- ✅ `CourseRequest.java` - Added fields for creating/updating courses
- ✅ `CourseResponse.java` - Added fields to return course data

#### Course Service (`CourseService.java`)
- ✅ `createCourse()` - Sets default values if not provided
- ✅ `updateCourse()` - Updates metadata fields if provided

### 3. Frontend Updates

#### Enroll Page (`Enroll.jsx`)
- ✅ Removed hardcoded/mock data
- ✅ Now uses real data from backend:
  - `course.thumbnail` - Emoji/icon
  - `course.color` - Theme color
  - `course.level` - Difficulty level
  - `course.duration` - Course duration
  - `course.price` - Course price (shows "Free" if 0)

## New Course Fields

| Field | Type | Default | Description | Example |
|-------|------|---------|-------------|---------|
| `thumbnail` | VARCHAR(10) | 🎓 | Emoji or icon | 🎓, 💻, 📊, 🎨 |
| `color` | VARCHAR(7) | #667eea | Hex color code | #667eea, #10b981 |
| `level` | ENUM | Beginner | Difficulty level | Beginner, Intermediate, Advanced |
| `duration` | VARCHAR(50) | 6 weeks | Estimated duration | "6 weeks", "3 months" |
| `price` | DECIMAL(10,2) | 0.00 | Course price | 0.00 (Free), 49.99 |

## How to Use

### For Instructors (Creating Courses)

When creating a course, you can now optionally provide:

```json
{
  "categoryId": 1,
  "instructorId": 1,
  "title": "Web Development Bootcamp",
  "description": "Learn full-stack web development",
  "status": "Published",
  "thumbnail": "💻",
  "color": "#3b82f6",
  "level": "Beginner",
  "duration": "12 weeks",
  "price": 0
}
```

**If you don't provide these fields**, defaults will be used:
- thumbnail: 🎓
- color: #667eea
- level: Beginner
- duration: 6 weeks
- price: 0 (Free)

### For Students (Viewing Courses)

The enrollment page now shows:
- ✅ Real course thumbnail (emoji)
- ✅ Real course color theme
- ✅ Real difficulty level
- ✅ Real duration
- ✅ Real price (or "Free")

## Testing

1. **Run the migration**:
   ```bash
   mysql -u root -p lms_db < backend/database/migration_add_course_metadata.sql
   ```

2. **Restart the backend** (it will auto-detect the new columns)

3. **Create a new course** with metadata:
   - Use the instructor interface
   - Or use Postman/curl to POST to `/api/courses`

4. **View the course** as a student:
   - Go to student home
   - Click "Enroll Now" on any course
   - See the real metadata displayed!

## Emoji Options for Thumbnails

Popular course emojis:
- 💻 Programming
- 🎨 Design
- 📊 Business/Analytics
- 🎓 General Education
- 🔬 Science
- 📱 Mobile Development
- 🌐 Web Development
- 🤖 AI/ML
- 📈 Marketing
- 🎵 Music

## Color Options

Popular course colors:
- `#667eea` - Purple (default)
- `#3b82f6` - Blue
- `#10b981` - Green
- `#f59e0b` - Orange
- `#ef4444` - Red
- `#8b5cf6` - Violet
- `#ec4899` - Pink

## Next Steps

### Optional: Add Document Upload Support

Currently, the database schema supports `'Reading'` content type for PDFs/documents. The file upload system already works for this!

**To add document support**:
1. ✅ Backend already supports it (contentType: 'Reading')
2. ✅ Frontend CoursePlayer already handles it
3. ✅ Just upload with contentType='Reading' or 'Document'

**Example upload**:
```javascript
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('moduleId', moduleId);
formData.append('title', 'Course Syllabus');
formData.append('contentType', 'Reading');
formData.append('contentOrder', 1);

await fetch('http://localhost:8080/api/course-contents/upload', {
  method: 'POST',
  body: formData
});
```

The CoursePlayer will show a download button for documents!

## Summary

✅ Database migration created  
✅ Backend entities updated  
✅ Backend DTOs updated  
✅ Backend service updated  
✅ Frontend Enroll page updated  
✅ No more fake/mock data  
✅ Document upload already supported  

**Action Required**: Run the database migration to enable these features!
