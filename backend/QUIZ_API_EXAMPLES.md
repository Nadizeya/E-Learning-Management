# Quiz API Documentation

This document provides examples for testing the Quiz API endpoints.

## Overview

The Quiz API supports Multiple Choice Questions (MCQ) for course content. Quizzes are linked to course content items with `content_type = 'Quiz'`.

## Prerequisites

1. First, create a course content item with `contentType: "Quiz"`:
   ```http
   POST /api/course-contents
   Content-Type: application/json

   {
     "moduleId": 1,
     "title": "HTML Basics Quiz",
     "contentType": "Quiz",
     "contentOrder": 3
   }
   ```

2. Note the `contentId` from the response - you'll need it to create the quiz.

## API Endpoints

### 1. Create Quiz

Create a quiz with questions for a course content item.

**Endpoint:** `POST /api/quizzes`

**Request Body:**
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
    }
  ]
}
```

**Response:**
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
      }
      // ... more questions
    ],
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

### 2. Get Quiz (For Instructors)

Get quiz with correct answers (for instructors).

**Endpoint:** `GET /api/quizzes/{quizId}?includeCorrectAnswers=true`

**Response:** Same as create response, includes `correctAnswer` field.

### 3. Get Quiz (For Students)

Get quiz without correct answers (for students taking the quiz).

**Endpoint:** `GET /api/quizzes/{quizId}/student`

**Response:**
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
        // Note: correctAnswer is NOT included
      }
      // ... more questions
    ],
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

### 4. Submit Quiz Attempt

Submit quiz answers and get score.

**Endpoint:** `POST /api/quizzes/attempt`

**Request Body:**
```json
{
  "quizId": 1,
  "studentId": 1,
  "answers": {
    "1": "0",
    "2": "0",
    "3": "0"
  }
}
```

**Note:** The `answers` map uses:
- Key: `questionId` (as string or number)
- Value: Selected answer index (0-based) or letter (A, B, C, D)

**Response:**
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
      }
    },
    "attemptDate": "2024-01-15T11:00:00"
  }
}
```

### 5. Get Quiz Attempts

Get all attempts for a quiz.

**Endpoint:** `GET /api/quizzes/{quizId}/attempts`

**Response:**
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
      "score": 85.0,
      "maxScore": 100.0,
      "attemptDate": "2024-01-15T11:30:00"
    }
  ]
}
```

### 6. Get Student Attempts

Get all quiz attempts for a student.

**Endpoint:** `GET /api/quizzes/student/{studentId}/attempts`

### 7. Get Student Quiz Attempts

Get attempts for a specific student and quiz.

**Endpoint:** `GET /api/quizzes/{quizId}/student/{studentId}/attempts`

### 8. Update Quiz

Update quiz details and questions.

**Endpoint:** `PUT /api/quizzes/{quizId}`

**Request Body:** Same as create quiz request.

### 9. Delete Quiz

Delete a quiz.

**Endpoint:** `DELETE /api/quizzes/{quizId}`

## Answer Format

The `correctAnswer` field in questions can be:
- **Index format**: "0", "1", "2", "3" (0-based index of the correct option)
- **Letter format**: "A", "B", "C", "D" (letter of the correct option)

When submitting answers, you can use either format. The system will normalize and compare them correctly.

## Example: Complete Flow

1. **Create Quiz Content:**
   ```http
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
   ```http
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
   Response: `quizId: 2`

3. **Student Gets Quiz:**
   ```http
   GET /api/quizzes/2/student
   ```

4. **Student Submits Answers:**
   ```http
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
   ```http
   GET /api/quizzes/2/student/1/attempts
   ```

## Testing with cURL

### Create Quiz
```bash
curl -X POST http://localhost:8080/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": 3,
    "title": "Test Quiz",
    "maxScore": 100.0,
    "questions": [
      {
        "questionText": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": "1"
      }
    ]
  }'
```

### Get Quiz for Student
```bash
curl http://localhost:8080/api/quizzes/1/student
```

### Submit Quiz Attempt
```bash
curl -X POST http://localhost:8080/api/quizzes/attempt \
  -H "Content-Type: application/json" \
  -d '{
    "quizId": 1,
    "studentId": 1,
    "answers": {
      "1": "1"
    }
  }'
```

