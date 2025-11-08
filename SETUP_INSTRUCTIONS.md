# Setup Instructions - Course Metadata & Document Upload

## ✅ What's Been Fixed

1. **Removed Price Field** - No pricing functionality (all courses are free)
2. **Added Course Metadata** - thumbnail, color, level, duration
3. **Document Upload Already Works** - PDF/document support is built-in

## 🚀 Quick Setup

### Step 1: Update Your Database

If you **already have a database**, run this SQL:

```sql
ALTER TABLE COURSES
ADD COLUMN thumbnail VARCHAR(10) DEFAULT '🎓' COMMENT 'Emoji or icon for course',
ADD COLUMN color VARCHAR(7) DEFAULT '#667eea' COMMENT 'Hex color for course theme',
ADD COLUMN level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
ADD COLUMN duration VARCHAR(50) DEFAULT '6 weeks' COMMENT 'Estimated course duration',
ADD INDEX idx_level (level);
```

**How to run**:
```bash
# Open MySQL command line
mysql -u root -p

# Select your database
USE lms_db;

# Paste the ALTER TABLE command above
# Press Enter
```

If you **don't have a database yet**, just run the schema file:
```bash
mysql -u root -p lms_db < backend/database/lms_schema.sql
```

### Step 2: Restart Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will automatically detect the new columns!

### Step 3: Test It!

Everything is ready to use! 🎉

## 📝 How to Create Courses with Metadata

### Option 1: Using Instructor Interface
When creating a course, you can now set:
- **Thumbnail**: Emoji like 💻, 🎨, 📊
- **Color**: Hex color like #3b82f6
- **Level**: Beginner, Intermediate, or Advanced
- **Duration**: Text like "6 weeks", "3 months"

### Option 2: Using API (Postman/curl)

```json
POST http://localhost:8080/api/courses
Content-Type: application/json

{
  "categoryId": 1,
  "instructorId": 1,
  "title": "Web Development Bootcamp",
  "description": "Learn full-stack web development from scratch",
  "status": "Published",
  "thumbnail": "💻",
  "color": "#3b82f6",
  "level": "Beginner",
  "duration": "12 weeks"
}
```

**If you don't provide these fields**, defaults will be used:
- thumbnail: 🎓
- color: #667eea
- level: Beginner
- duration: 6 weeks

## 📄 How to Upload Documents/PDFs

Documents are already supported! Just use `contentType: 'Reading'`

### Example: Upload a PDF

```javascript
const formData = new FormData();
formData.append('file', pdfFile); // Your PDF file
formData.append('moduleId', 1);
formData.append('title', 'Course Syllabus');
formData.append('contentType', 'Reading'); // This is the key!
formData.append('contentOrder', 1);

const response = await fetch('http://localhost:8080/api/course-contents/upload', {
  method: 'POST',
  body: formData
});
```

### Supported Content Types

| Type | Description | Display |
|------|-------------|---------|
| `Video` | MP4, MOV, etc. | Video player |
| `Reading` | PDF, DOC, etc. | Download button |
| `Quiz` | Quiz content | Custom display |

### What Students See

- **Videos**: Play in video player
- **Documents**: Download button to get the PDF
- **All content**: Organized by modules

## 🎨 Customization Options

### Popular Emojis for Courses

```
💻 Programming/Coding
🎨 Design/Creative
📊 Business/Analytics
🎓 General Education
🔬 Science/Research
📱 Mobile Development
🌐 Web Development
🤖 AI/Machine Learning
📈 Marketing/Sales
🎵 Music/Arts
📚 Literature/Writing
🏋️ Health/Fitness
🍳 Cooking/Food
📷 Photography
🎬 Video Production
```

### Popular Colors

```
#667eea - Purple (default)
#3b82f6 - Blue
#10b981 - Green
#f59e0b - Orange
#ef4444 - Red
#8b5cf6 - Violet
#ec4899 - Pink
#06b6d4 - Cyan
#84cc16 - Lime
#f43f5e - Rose
```

## 🧪 Testing

### Test Course Creation
1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm run dev`
3. Login as instructor
4. Create a course with custom emoji and color
5. View it as a student - see the custom appearance!

### Test Document Upload
1. Create a course and module
2. Upload a PDF with `contentType: 'Reading'`
3. Enroll as student
4. See download button for the PDF

### Test Video Upload
1. Upload a video with `contentType: 'Video'`
2. Enroll as student
3. Video plays in the player!

## 📋 Summary of Changes

### Database
- ✅ Added `thumbnail`, `color`, `level`, `duration` columns
- ✅ Removed `price` column (not needed)

### Backend
- ✅ Updated `Course.java` entity
- ✅ Updated `CourseRequest.java` DTO
- ✅ Updated `CourseResponse.java` DTO
- ✅ Updated `CourseService.java` with defaults
- ✅ Document upload already working!

### Frontend
- ✅ Updated `Enroll.jsx` to show real metadata
- ✅ Removed price display
- ✅ `CoursePlayer.jsx` already handles documents!

## 🎯 What You Get

**Before**:
- ❌ Fake hardcoded data
- ❌ All courses look the same
- ❌ No document support

**After**:
- ✅ Real instructor-provided metadata
- ✅ Each course has unique appearance
- ✅ Documents/PDFs fully supported
- ✅ Professional presentation
- ✅ No pricing confusion

## 🆘 Troubleshooting

### "Column not found" error
- Run the ALTER TABLE command to add the new columns

### Backend won't start
- Make sure MySQL is running
- Check database connection in `application.properties`

### Documents won't upload
- Check file size limits in backend
- Verify `contentType` is set to 'Reading' or 'Document'
- Check backend logs for errors

### Videos won't play
- Verify file path in database
- Check `./uploads/course-content/video/` folder exists
- See browser console for URL errors

## 🎉 You're All Set!

Just run the ALTER TABLE command and restart your backend. Everything else is ready to go!

**Next Steps**:
1. Run the SQL ALTER TABLE command
2. Restart backend
3. Create a course with custom emoji/color
4. Upload some PDFs and videos
5. Test as a student!
