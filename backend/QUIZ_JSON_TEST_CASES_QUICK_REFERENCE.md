# Quiz API - Quick JSON Reference

Quick copy-paste JSON test cases for Postman testing.

---

## 1. Create Quiz Content Item

```json
{
  "moduleId": 1,
  "title": "HTML Basics Quiz",
  "contentType": "Quiz",
  "contentOrder": 3
}
```

**Endpoint:** `POST http://localhost:8080/api/course-contents`

---

## 2. Create Quiz with Questions

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

**Endpoint:** `POST http://localhost:8080/api/quizzes`

---

## 3. Submit Quiz Attempt (All Correct - Using Index)

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

**Endpoint:** `POST http://localhost:8080/api/quizzes/attempt`

---

## 4. Submit Quiz Attempt (All Correct - Using Letters)

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

**Endpoint:** `POST http://localhost:8080/api/quizzes/attempt`

---

## 5. Submit Quiz Attempt (Some Incorrect)

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

**Endpoint:** `POST http://localhost:8080/api/quizzes/attempt`

---

## 6. Submit Quiz Attempt (Partial Answers)

```json
{
  "quizId": 1,
  "studentId": 3,
  "answers": {
    "1": "0",
    "3": "0"
  }
}
```

**Endpoint:** `POST http://localhost:8080/api/quizzes/attempt`

**Note:** Unanswered questions will be marked as incorrect.

---

## 7. Update Quiz

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

**Endpoint:** `PUT http://localhost:8080/api/quizzes/1`

---

## 8. Simple Quiz (Minimal Example)

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

**Endpoint:** `POST http://localhost:8080/api/quizzes`

---

## 9. JavaScript Quiz Example

```json
{
  "contentId": 10,
  "title": "JavaScript Fundamentals Quiz",
  "maxScore": 100.0,
  "questions": [
    {
      "questionText": "What is JavaScript?",
      "options": [
        "A programming language",
        "A markup language",
        "A database",
        "A framework"
      ],
      "correctAnswer": "0"
    },
    {
      "questionText": "Which keyword is used to declare a variable in JavaScript?",
      "options": [
        "var",
        "variable",
        "v",
        "declare"
      ],
      "correctAnswer": "0"
    },
    {
      "questionText": "What is the result of typeof null?",
      "options": [
        "null",
        "undefined",
        "object",
        "string"
      ],
      "correctAnswer": "2"
    },
    {
      "questionText": "Which method is used to add an element to the end of an array?",
      "options": [
        "push()",
        "pop()",
        "shift()",
        "unshift()"
      ],
      "correctAnswer": "0"
    }
  ]
}
```

**Endpoint:** `POST http://localhost:8080/api/quizzes`

---

## 10. CSS Quiz Example

```json
{
  "contentId": 11,
  "title": "CSS Basics Quiz",
  "maxScore": 100.0,
  "questions": [
    {
      "questionText": "What does CSS stand for?",
      "options": [
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Creative Style Sheets",
        "Colorful Style Sheets"
      ],
      "correctAnswer": "0"
    },
    {
      "questionText": "Which property is used to change the background color?",
      "options": [
        "color",
        "background-color",
        "bgcolor",
        "background"
      ],
      "correctAnswer": "1"
    },
    {
      "questionText": "How do you select an element with id 'demo'?",
      "options": [
        ".demo",
        "#demo",
        "demo",
        "*demo"
      ],
      "correctAnswer": "1"
    }
  ]
}
```

**Endpoint:** `POST http://localhost:8080/api/quizzes`

---

## GET Endpoints (No Body Required)

### Get Quiz (Instructor View)
```
GET http://localhost:8080/api/quizzes/1?includeCorrectAnswers=true
```

### Get Quiz (Student View)
```
GET http://localhost:8080/api/quizzes/1/student
```

### Get Quiz by Content ID
```
GET http://localhost:8080/api/quizzes/content/3?includeCorrectAnswers=true
```

### Get All Attempts for Quiz
```
GET http://localhost:8080/api/quizzes/1/attempts
```

### Get All Attempts for Student
```
GET http://localhost:8080/api/quizzes/student/1/attempts
```

### Get Attempts for Student and Quiz
```
GET http://localhost:8080/api/quizzes/1/student/1/attempts
```

### Delete Quiz
```
DELETE http://localhost:8080/api/quizzes/1
```

---

## Error Test Cases

### Invalid Content ID
```json
{
  "contentId": 999,
  "title": "Test Quiz",
  "maxScore": 100.0,
  "questions": []
}
```

### Empty Answers
```json
{
  "quizId": 1,
  "studentId": 1,
  "answers": {}
}
```

### Invalid Quiz ID
```json
{
  "quizId": 999,
  "studentId": 1,
  "answers": {
    "1": "0"
  }
}
```

---

## Answer Format Notes

- **Index format:** Use "0", "1", "2", "3" (0-based index)
- **Letter format:** Use "A", "B", "C", "D"
- Both formats are accepted and will be normalized for comparison
- The `answers` map uses `questionId` as key (can be number or string)

---

## Quick Testing Flow

1. **Create Content:** Use test case #1 → Save `contentId`
2. **Create Quiz:** Use test case #2 (replace `contentId: 3` with your value) → Save `quizId` and `questionId`s
3. **Get Student View:** `GET /api/quizzes/{quizId}/student`
4. **Submit Answers:** Use test case #3 or #4 (replace `quizId` and `questionId`s)
5. **View Results:** `GET /api/quizzes/{quizId}/attempts`

---

## Tips

- Replace `contentId: 3` with the actual ID from Step 1
- Replace `quizId: 1` with the actual ID from Step 2
- Replace question IDs in answers (e.g., `"1": "0"`) with actual question IDs from Step 2
- Use `studentId: 1` or any valid student ID
- Use `moduleId: 1` or any valid module ID

