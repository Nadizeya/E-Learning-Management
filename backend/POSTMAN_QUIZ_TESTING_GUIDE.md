# Postman Testing Guide for Quiz API

This guide provides complete JSON test cases for testing the Quiz API endpoints in Postman.

## 📋 Prerequisites

Before testing quiz endpoints, you need:
1. A course module (get `moduleId`)
2. A course content item with `contentType: "Quiz"` (get `contentId`)
3. A student ID (for submitting quiz attempts)

---

## 🚀 Step-by-Step Testing Flow

### **Step 1: Create Quiz Content Item**

First, create a course content item with type "Quiz".

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/course-contents`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
```json
{
  "moduleId": 1,
  "title": "HTML Basics Quiz",
  "contentType": "Quiz",
  "contentOrder": 3
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Course content created successfully",
  "data": {
    "contentId": 3,
    "moduleId": 1,
    "title": "HTML Basics Quiz",
    "contentType": "Quiz",
    "contentUrl": null,
    "filePath": null,
    "contentOrder": 3,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

**⚠️ Important:** Save the `contentId` from the response (e.g., `3`) - you'll need it for the next step.

---

### **Step 2: Create Quiz with Questions**

Create a quiz with multiple choice questions.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/quizzes`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
```json
{
  "contentId": 3,
  "title": "HTML Basics Quiz",
  "maxScore": 100.0,
  "questions": [
    {
      "questionText": "What does HTML stand for?",
      "options": [
        "HyperText Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink and Text Markup Language"
      ],
      "correctAnswer": "0"
    },
    {
      "questionText": "Which tag is used for the largest heading?",
      "options": [
        "<h1>",
        "<h6>",
        "<head>",
        "<header>"
      ],
      "correctAnswer": "0"
    },
    {
      "questionText": "What is the correct HTML element for inserting a line break?",
      "options": [
        "<br>",
        "<break>",
        "<lb>",
        "<line>"
      ],
      "correctAnswer": "0"
    },
    {
      "questionText": "Which attribute is used to define inline styles?",
      "options": [
        "class",
        "style",
        "styles",
        "font"
      ],
      "correctAnswer": "1"
    },
    {
      "questionText": "What is the correct HTML for creating a hyperlink?",
      "options": [
        "<a url=\"http://example.com\">Example</a>",
        "<a href=\"http://example.com\">Example</a>",
        "<a>http://example.com</a>",
        "<a name=\"http://example.com\">Example</a>"
      ],
      "correctAnswer": "1"
    }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "quizId": 1,
    "contentId": 3,
    "title": "HTML Basics Quiz",
    "maxScore": 100.0,
    "questions": [
      {
        "questionId": 1,
        "quizId": 1,
        "questionText": "What does HTML stand for?",
        "options": [
          "HyperText Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlink and Text Markup Language"
        ],
        "correctAnswer": "0",
        "createdAt": "2024-01-15T10:30:00",
        "updatedAt": "2024-01-15T10:30:00"
      },
      {
        "questionId": 2,
        "quizId": 1,
        "questionText": "Which tag is used for the largest heading?",
        "options": [
          "<h1>",
          "<h6>",
          "<head>",
          "<header>"
        ],
        "correctAnswer": "0",
        "createdAt": "2024-01-15T10:30:00",
        "updatedAt": "2024-01-15T10:30:00"
      }
      // ... more questions
    ],
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

**⚠️ Important:** Save the `quizId` from the response (e.g., `1`) and note the `questionId` values for each question.

---

### **Step 3: Get Quiz (Instructor View - With Correct Answers)**

Get the quiz with correct answers visible (for instructors).

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/quizzes/1?includeCorrectAnswers=true`
- **Headers:** None required

**Expected Response:** Same structure as Step 2, with `correctAnswer` field visible in each question.

---

### **Step 4: Get Quiz (Student View - Without Correct Answers)**

Get the quiz without correct answers (for students taking the quiz).

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/quizzes/1/student`
- **Headers:** None required

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "quizId": 1,
    "contentId": 3,
    "title": "HTML Basics Quiz",
    "maxScore": 100.0,
    "questions": [
      {
        "questionId": 1,
        "questionText": "What does HTML stand for?",
        "options": [
          "HyperText Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlink and Text Markup Language"
        ]
      },
      {
        "questionId": 2,
        "questionText": "Which tag is used for the largest heading?",
        "options": [
          "<h1>",
          "<h6>",
          "<head>",
          "<header>"
        ]
      }
      // ... more questions (note: no correctAnswer field)
    ],
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

**Note:** The `correctAnswer` field is NOT included in the response.

---

### **Step 5: Submit Quiz Attempt**

Submit answers for a quiz and get the score.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/quizzes/attempt`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
```json
{
  "quizId": 1,
  "studentId": 1,
  "answers": {
    "1": "0",
    "2": "0",
    "3": "0",
    "4": "1",
    "5": "1"
  }
}
```

**Explanation:**
- `quizId`: The ID of the quiz (from Step 2)
- `studentId`: The ID of the student submitting
- `answers`: A map where:
  - **Key:** `questionId` (as a string or number)
  - **Value:** Selected answer index (0-based) or letter (A, B, C, D)

**Alternative format using letters:**
```json
{
  "quizId": 1,
  "studentId": 1,
  "answers": {
    "1": "A",
    "2": "A",
    "3": "A",
    "4": "B",
    "5": "B"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "attemptId": 1,
    "quizId": 1,
    "studentId": 1,
    "score": 100.0,
    "maxScore": 100.0,
    "answerResults": {
      "1": {
        "selectedAnswer": "0",
        "correctAnswer": "0",
        "isCorrect": true
      },
      "2": {
        "selectedAnswer": "0",
        "correctAnswer": "0",
        "isCorrect": true
      },
      "3": {
        "selectedAnswer": "0",
        "correctAnswer": "0",
        "isCorrect": true
      },
      "4": {
        "selectedAnswer": "1",
        "correctAnswer": "1",
        "isCorrect": true
      },
      "5": {
        "selectedAnswer": "1",
        "correctAnswer": "1",
        "isCorrect": true
      }
    },
    "attemptDate": "2024-01-15T11:00:00"
  }
}
```

**Example with incorrect answers:**
```json
{
  "quizId": 1,
  "studentId": 2,
  "answers": {
    "1": "0",
    "2": "1",
    "3": "2",
    "4": "0",
    "5": "1"
  }
}
```

**Expected Response (with some wrong answers):**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "attemptId": 2,
    "quizId": 1,
    "studentId": 2,
    "score": 40.0,
    "maxScore": 100.0,
    "answerResults": {
      "1": {
        "selectedAnswer": "0",
        "correctAnswer": "0",
        "isCorrect": true
      },
      "2": {
        "selectedAnswer": "1",
        "correctAnswer": "0",
        "isCorrect": false
      },
      "3": {
        "selectedAnswer": "2",
        "correctAnswer": "0",
        "isCorrect": false
      },
      "4": {
        "selectedAnswer": "0",
        "correctAnswer": "1",
        "isCorrect": false
      },
      "5": {
        "selectedAnswer": "1",
        "correctAnswer": "1",
        "isCorrect": true
      }
    },
    "attemptDate": "2024-01-15T11:15:00"
  }
}
```

---

### **Step 6: Get All Attempts for a Quiz**

Get all quiz attempts (for instructors to see all student submissions).

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/quizzes/1/attempts`
- **Headers:** None required

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "attemptId": 1,
      "quizId": 1,
      "studentId": 1,
      "score": 100.0,
      "maxScore": 100.0,
      "attemptDate": "2024-01-15T11:00:00"
    },
    {
      "attemptId": 2,
      "quizId": 1,
      "studentId": 2,
      "score": 40.0,
      "maxScore": 100.0,
      "attemptDate": "2024-01-15T11:15:00"
    }
  ]
}
```

---

### **Step 7: Get All Attempts for a Student**

Get all quiz attempts made by a specific student.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/quizzes/student/1/attempts`
- **Headers:** None required

**Expected Response:** Similar to Step 6, but filtered for the specific student.

---

### **Step 8: Get Attempts for Student and Quiz**

Get all attempts for a specific student on a specific quiz.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/quizzes/1/student/1/attempts`
- **Headers:** None required

**Expected Response:** Similar to Step 6, but filtered for the specific student and quiz.

---

### **Step 9: Update Quiz**

Update quiz details and questions.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/quizzes/1`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
```json
{
  "contentId": 3,
  "title": "HTML Basics Quiz - Updated",
  "maxScore": 50.0,
  "questions": [
    {
      "questionText": "What does HTML stand for?",
      "options": [
        "HyperText Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink and Text Markup Language"
      ],
      "correctAnswer": "0"
    },
    {
      "questionText": "Which tag is used for the largest heading?",
      "options": [
        "<h1>",
        "<h6>",
        "<head>",
        "<header>"
      ],
      "correctAnswer": "0"
    }
  ]
}
```

**Expected Response:** Same structure as Step 2, with updated values.

---

### **Step 10: Delete Quiz**

Delete a quiz.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:8080/api/quizzes/1`
- **Headers:** None required

**Expected Response:**
```json
{
  "success": true,
  "message": "Quiz deleted successfully"
}
```

---

## 📝 Additional Test Cases

### **Test Case 1: Get Quiz by Content ID**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/quizzes/content/3?includeCorrectAnswers=true`
- **Headers:** None required

**Expected Response:** Same as Step 3.

---

### **Test Case 2: Create Quiz with Minimum Fields**

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/quizzes`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
```json
{
  "contentId": 3,
  "title": "Simple Quiz",
  "maxScore": 100.0,
  "questions": [
    {
      "questionText": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "1"
    }
  ]
}
```

---

### **Test Case 3: Submit Quiz with Partial Answers**

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/quizzes/attempt`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
```json
{
  "quizId": 1,
  "studentId": 1,
  "answers": {
    "1": "0",
    "3": "0"
  }
}
```

**Note:** Only answering 2 out of 5 questions. The unanswered questions will be marked as incorrect.

---

### **Test Case 4: Error Cases**

#### **4.1: Create Quiz with Invalid Content ID**
```json
{
  "contentId": 999,
  "title": "Test Quiz",
  "maxScore": 100.0,
  "questions": []
}
```
**Expected Error:**
```json
{
  "success": false,
  "message": "Content not found with id: 999"
}
```

#### **4.2: Create Quiz with Content Type Not "Quiz"**
If you try to create a quiz for content with `contentType: "Video"`, you'll get:
```json
{
  "success": false,
  "message": "Content must be of type 'Quiz'"
}
```

#### **4.3: Submit Quiz with Invalid Quiz ID**
```json
{
  "quizId": 999,
  "studentId": 1,
  "answers": {}
}
```
**Expected Error:**
```json
{
  "success": false,
  "message": "Quiz not found with id: 999"
}
```

#### **4.4: Submit Quiz with Empty Answers**
```json
{
  "quizId": 1,
  "studentId": 1,
  "answers": {}
}
```
**Expected Error:**
```json
{
  "success": false,
  "message": "Answers cannot be empty"
}
```

---

## 🔧 Postman Collection Setup

### **Environment Variables**

Create a Postman environment with these variables:

```
base_url: http://localhost:8080
contentId: (will be set after Step 1)
quizId: (will be set after Step 2)
studentId: 1
moduleId: 1
```

### **Using Variables in Requests**

Instead of hardcoding values, use:
- URL: `{{base_url}}/api/quizzes/{{quizId}}`
- Body: `"contentId": {{contentId}}`

---

## ✅ Testing Checklist

- [ ] Create quiz content item
- [ ] Create quiz with questions
- [ ] Get quiz (instructor view - with answers)
- [ ] Get quiz (student view - without answers)
- [ ] Submit quiz attempt (all correct)
- [ ] Submit quiz attempt (some incorrect)
- [ ] Submit quiz attempt (partial answers)
- [ ] Get all attempts for a quiz
- [ ] Get all attempts for a student
- [ ] Get attempts for student and quiz
- [ ] Update quiz
- [ ] Delete quiz
- [ ] Test error cases

---

## 🐛 Common Issues

1. **"Content not found"** - Make sure you created the course content item first (Step 1)
2. **"Quiz already exists for this content"** - Each content item can only have one quiz
3. **"Content must be of type 'Quiz'"** - Ensure the content item has `contentType: "Quiz"`
4. **Score calculation** - Score = (correct answers / total questions) × maxScore
5. **Answer format** - You can use either index ("0", "1") or letter ("A", "B") format

---

## 📊 Example Complete Flow

Here's a complete example with actual values:

1. **Create Content:**
   ```json
   POST /api/course-contents
   {
     "moduleId": 1,
     "title": "JavaScript Quiz",
     "contentType": "Quiz",
     "contentOrder": 5
   }
   ```
   Response: `contentId: 10`

2. **Create Quiz:**
   ```json
   POST /api/quizzes
   {
     "contentId": 10,
     "title": "JavaScript Quiz",
     "maxScore": 100.0,
     "questions": [
       {
         "questionText": "What is JavaScript?",
         "options": ["A programming language", "A markup language", "A database", "A framework"],
         "correctAnswer": "0"
       }
     ]
   }
   ```
   Response: `quizId: 2`, `questionId: 5`

3. **Student Gets Quiz:**
   ```
   GET /api/quizzes/2/student
   ```

4. **Student Submits:**
   ```json
   POST /api/quizzes/attempt
   {
     "quizId": 2,
     "studentId": 1,
     "answers": {
       "5": "0"
     }
   }
   ```

5. **View Results:**
   ```
   GET /api/quizzes/2/student/1/attempts
   ```

---

Happy Testing! 🎉

