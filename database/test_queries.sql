-- ============================================
-- LMS DATABASE TEST QUERIES
-- ============================================
-- Use these queries to test your database schema
-- ============================================

USE lms_elearn_db;

-- ============================================
-- 1. BASIC TABLE VERIFICATION
-- ============================================

-- Check all tables exist
SHOW TABLES;

-- Check table structures
DESCRIBE USERS;
DESCRIBE COURSES;
DESCRIBE ENROLLMENTS;

-- Count records in each table
SELECT 'USERS' AS table_name, COUNT(*) AS record_count FROM USERS
UNION ALL
SELECT 'ADMINS', COUNT(*) FROM ADMINS
UNION ALL
SELECT 'CATEGORIES', COUNT(*) FROM CATEGORIES
UNION ALL
SELECT 'COURSES', COUNT(*) FROM COURSES
UNION ALL
SELECT 'COURSE_MODULES', COUNT(*) FROM COURSE_MODULES
UNION ALL
SELECT 'COURSE_CONTENT', COUNT(*) FROM COURSE_CONTENT
UNION ALL
SELECT 'ENROLLMENTS', COUNT(*) FROM ENROLLMENTS
UNION ALL
SELECT 'STUDENT_PROGRESS', COUNT(*) FROM STUDENT_PROGRESS
UNION ALL
SELECT 'CERTIFICATES', COUNT(*) FROM CERTIFICATES
UNION ALL
SELECT 'QUIZZES', COUNT(*) FROM QUIZZES
UNION ALL
SELECT 'QUIZ_QUESTIONS', COUNT(*) FROM QUIZ_QUESTIONS
UNION ALL
SELECT 'QUIZ_ATTEMPTS', COUNT(*) FROM QUIZ_ATTEMPTS
UNION ALL
SELECT 'ASSIGNMENTS', COUNT(*) FROM ASSIGNMENTS
UNION ALL
SELECT 'ASSIGNMENT_SUBMISSIONS', COUNT(*) FROM ASSIGNMENT_SUBMISSIONS
UNION ALL
SELECT 'BADGES', COUNT(*) FROM BADGES
UNION ALL
SELECT 'USER_BADGES', COUNT(*) FROM USER_BADGES
UNION ALL
SELECT 'ACHIEVEMENTS', COUNT(*) FROM ACHIEVEMENTS
UNION ALL
SELECT 'SUPPORT_REQUESTS', COUNT(*) FROM SUPPORT_REQUESTS
UNION ALL
SELECT 'RESOURCES', COUNT(*) FROM RESOURCES;

-- ============================================
-- 2. USER MANAGEMENT TESTS
-- ============================================

-- Test: Get all users with their roles
SELECT 
    user_id,
    CONCAT(first_name, ' ', last_name) AS full_name,
    email,
    CASE 
        WHEN is_instructor = TRUE THEN 'Instructor'
        WHEN user_id IN (SELECT user_id FROM ADMINS) THEN 'Admin'
        ELSE 'Student'
    END AS role
FROM USERS;

-- Test: Get admin details with permissions
SELECT 
    a.admin_id,
    CONCAT(u.first_name, ' ', u.last_name) AS admin_name,
    u.email,
    a.permissions
FROM ADMINS a
JOIN USERS u ON a.user_id = u.user_id;

-- Test: Get all instructors
SELECT 
    user_id,
    CONCAT(first_name, ' ', last_name) AS instructor_name,
    email
FROM USERS
WHERE is_instructor = TRUE;

-- ============================================
-- 3. COURSE STRUCTURE TESTS
-- ============================================

-- Test: Get all courses with category and instructor info
SELECT 
    c.course_id,
    c.title,
    cat.name AS category,
    CONCAT(u.first_name, ' ', u.last_name) AS instructor,
    c.price,
    c.status
FROM COURSES c
JOIN CATEGORIES cat ON c.category_id = cat.category_id
JOIN USERS u ON c.instructor_id = u.user_id;

-- Test: Get course structure (modules and content)
SELECT 
    c.title AS course_title,
    cm.title AS module_title,
    cm.module_order,
    cc.title AS content_title,
    cc.content_type,
    cc.content_order
FROM COURSES c
JOIN COURSE_MODULES cm ON c.course_id = cm.course_id
JOIN COURSE_CONTENT cc ON cm.module_id = cc.module_id
ORDER BY c.course_id, cm.module_order, cc.content_order;

-- Test: Get resources for each content
SELECT 
    c.title AS course_title,
    cc.title AS content_title,
    r.file_name,
    r.file_type
FROM RESOURCES r
JOIN COURSE_CONTENT cc ON r.content_id = cc.content_id
JOIN COURSE_MODULES cm ON cc.module_id = cm.module_id
JOIN COURSES c ON cm.course_id = c.course_id;

-- ============================================
-- 4. ENROLLMENT AND PROGRESS TESTS
-- ============================================

-- Test: Get all enrollments with student and course details
SELECT 
    e.enrollment_id,
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    c.title AS course_title,
    e.enrollment_date,
    e.completion_status
FROM ENROLLMENTS e
JOIN USERS u ON e.user_id = u.user_id
JOIN COURSES c ON e.course_id = c.course_id;

-- Test: Get student progress for a specific course
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    c.title AS course_title,
    cc.title AS completed_content,
    sp.completed_at
FROM STUDENT_PROGRESS sp
JOIN USERS u ON sp.user_id = u.user_id
JOIN COURSE_CONTENT cc ON sp.content_id = cc.content_id
JOIN COURSE_MODULES cm ON cc.module_id = cm.module_id
JOIN COURSES c ON cm.course_id = c.course_id
ORDER BY u.user_id, sp.completed_at;

-- Test: Calculate progress percentage for each enrollment
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    c.title AS course_title,
    COUNT(DISTINCT cc.content_id) AS total_content,
    COUNT(DISTINCT sp.content_id) AS completed_content,
    ROUND((COUNT(DISTINCT sp.content_id) * 100.0 / COUNT(DISTINCT cc.content_id)), 2) AS progress_percentage
FROM ENROLLMENTS e
JOIN USERS u ON e.user_id = u.user_id
JOIN COURSES c ON e.course_id = c.course_id
JOIN COURSE_MODULES cm ON c.course_id = cm.course_id
JOIN COURSE_CONTENT cc ON cm.module_id = cc.module_id
LEFT JOIN STUDENT_PROGRESS sp ON e.user_id = sp.user_id AND cc.content_id = sp.content_id
GROUP BY e.enrollment_id, u.first_name, u.last_name, c.title;

-- Test: Get issued certificates
SELECT 
    cert.certificate_id,
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    c.title AS course_title,
    cert.unique_code,
    cert.issue_date
FROM CERTIFICATES cert
JOIN USERS u ON cert.user_id = u.user_id
JOIN ENROLLMENTS e ON cert.enrollment_id = e.enrollment_id
JOIN COURSES c ON e.course_id = c.course_id;

-- ============================================
-- 5. ASSESSMENT TESTS
-- ============================================

-- Test: Get all quizzes with their questions
SELECT 
    q.quiz_id,
    q.title AS quiz_title,
    q.max_score,
    qq.question_id,
    qq.question_text,
    qq.correct_answer
FROM QUIZZES q
JOIN QUIZ_QUESTIONS qq ON q.quiz_id = qq.quiz_id
ORDER BY q.quiz_id, qq.question_id;

-- Test: Get quiz attempts with scores
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    q.title AS quiz_title,
    qa.score,
    q.max_score,
    ROUND((qa.score / q.max_score * 100), 2) AS percentage,
    qa.attempt_date
FROM QUIZ_ATTEMPTS qa
JOIN USERS u ON qa.user_id = u.user_id
JOIN QUIZZES q ON qa.quiz_id = q.quiz_id
ORDER BY qa.attempt_date DESC;

-- Test: Get assignments with submission status
SELECT 
    a.assignment_id,
    a.title AS assignment_title,
    a.due_date,
    a.max_score,
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    asub.submitted_at,
    asub.grade_score,
    CASE 
        WHEN asub.submitted_at IS NULL THEN 'Not Submitted'
        WHEN asub.grade_score IS NULL THEN 'Pending Grading'
        ELSE 'Graded'
    END AS status
FROM ASSIGNMENTS a
JOIN COURSE_CONTENT cc ON a.content_id = cc.content_id
JOIN COURSE_MODULES cm ON cc.module_id = cm.module_id
JOIN COURSES c ON cm.course_id = c.course_id
LEFT JOIN ENROLLMENTS e ON c.course_id = e.course_id
LEFT JOIN USERS u ON e.user_id = u.user_id
LEFT JOIN ASSIGNMENT_SUBMISSIONS asub ON a.assignment_id = asub.assignment_id AND u.user_id = asub.user_id
ORDER BY a.assignment_id, u.user_id;

-- Test: Get average quiz scores per student
SELECT 
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    COUNT(qa.attempt_id) AS total_attempts,
    ROUND(AVG(qa.score), 2) AS average_score,
    ROUND(AVG(qa.score / q.max_score * 100), 2) AS average_percentage
FROM USERS u
JOIN QUIZ_ATTEMPTS qa ON u.user_id = qa.user_id
JOIN QUIZZES q ON qa.quiz_id = q.quiz_id
GROUP BY u.user_id, u.first_name, u.last_name;

-- ============================================
-- 6. GAMIFICATION TESTS
-- ============================================

-- Test: Get all badges and who earned them
SELECT 
    b.badge_id,
    b.name AS badge_name,
    b.description,
    COUNT(ub.user_badge_id) AS times_earned,
    GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ') AS earned_by
FROM BADGES b
LEFT JOIN USER_BADGES ub ON b.badge_id = ub.badge_id
LEFT JOIN USERS u ON ub.user_id = u.user_id
GROUP BY b.badge_id, b.name, b.description;

-- Test: Get user badges with earn dates
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    b.name AS badge_name,
    b.description,
    ub.earned_at
FROM USER_BADGES ub
JOIN USERS u ON ub.user_id = u.user_id
JOIN BADGES b ON ub.badge_id = b.badge_id
ORDER BY ub.earned_at DESC;

-- Test: Get all achievements
SELECT 
    achievement_id,
    name,
    description,
    points_reward,
    trigger_condition
FROM ACHIEVEMENTS;

-- ============================================
-- 7. SUPPORT TESTS
-- ============================================

-- Test: Get all support requests with user details
SELECT 
    sr.request_id,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    u.email,
    sr.subject,
    sr.status,
    sr.priority,
    sr.created_at
FROM SUPPORT_REQUESTS sr
JOIN USERS u ON sr.user_id = u.user_id
ORDER BY 
    CASE sr.priority
        WHEN 'High' THEN 1
        WHEN 'Medium' THEN 2
        WHEN 'Low' THEN 3
    END,
    sr.created_at DESC;

-- Test: Count support requests by status
SELECT 
    status,
    COUNT(*) AS request_count
FROM SUPPORT_REQUESTS
GROUP BY status;

-- ============================================
-- 8. VIEW TESTS
-- ============================================

-- Test: Course Overview View
SELECT * FROM v_course_overview;

-- Test: Student Dashboard View
SELECT * FROM v_student_dashboard;

-- Test: Instructor Statistics View
SELECT * FROM v_instructor_stats;

-- ============================================
-- 9. COMPLEX ANALYTICAL QUERIES
-- ============================================

-- Test: Most popular courses (by enrollments)
SELECT 
    c.title,
    COUNT(e.enrollment_id) AS total_enrollments,
    COUNT(CASE WHEN e.completion_status = 'Completed' THEN 1 END) AS completed_enrollments,
    ROUND(COUNT(CASE WHEN e.completion_status = 'Completed' THEN 1 END) * 100.0 / COUNT(e.enrollment_id), 2) AS completion_rate
FROM COURSES c
LEFT JOIN ENROLLMENTS e ON c.course_id = e.course_id
GROUP BY c.course_id, c.title
ORDER BY total_enrollments DESC;

-- Test: Instructor performance summary
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS instructor_name,
    COUNT(DISTINCT c.course_id) AS courses_taught,
    COUNT(DISTINCT e.enrollment_id) AS total_students,
    ROUND(AVG(asub.grade_score), 2) AS avg_assignment_grade,
    ROUND(AVG(qa.score), 2) AS avg_quiz_score
FROM USERS u
JOIN COURSES c ON u.user_id = c.instructor_id
LEFT JOIN ENROLLMENTS e ON c.course_id = e.course_id
LEFT JOIN COURSE_MODULES cm ON c.course_id = cm.course_id
LEFT JOIN COURSE_CONTENT cc ON cm.module_id = cc.module_id
LEFT JOIN ASSIGNMENTS a ON cc.content_id = a.content_id
LEFT JOIN ASSIGNMENT_SUBMISSIONS asub ON a.assignment_id = asub.assignment_id
LEFT JOIN QUIZZES q ON cc.content_id = q.content_id
LEFT JOIN QUIZ_ATTEMPTS qa ON q.quiz_id = qa.quiz_id
WHERE u.is_instructor = TRUE
GROUP BY u.user_id, u.first_name, u.last_name;

-- Test: Student engagement metrics
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    COUNT(DISTINCT e.course_id) AS enrolled_courses,
    COUNT(DISTINCT sp.content_id) AS completed_content,
    COUNT(DISTINCT qa.attempt_id) AS quiz_attempts,
    COUNT(DISTINCT asub.submission_id) AS assignment_submissions,
    COUNT(DISTINCT ub.badge_id) AS badges_earned
FROM USERS u
LEFT JOIN ENROLLMENTS e ON u.user_id = e.user_id
LEFT JOIN STUDENT_PROGRESS sp ON u.user_id = sp.user_id
LEFT JOIN QUIZ_ATTEMPTS qa ON u.user_id = qa.user_id
LEFT JOIN ASSIGNMENT_SUBMISSIONS asub ON u.user_id = asub.user_id
LEFT JOIN USER_BADGES ub ON u.user_id = ub.user_id
WHERE u.is_instructor = FALSE
GROUP BY u.user_id, u.first_name, u.last_name;

-- Test: Category popularity
SELECT 
    cat.name AS category_name,
    COUNT(DISTINCT c.course_id) AS total_courses,
    COUNT(DISTINCT e.enrollment_id) AS total_enrollments,
    ROUND(AVG(c.price), 2) AS avg_price
FROM CATEGORIES cat
LEFT JOIN COURSES c ON cat.category_id = c.category_id
LEFT JOIN ENROLLMENTS e ON c.course_id = e.course_id
GROUP BY cat.category_id, cat.name
ORDER BY total_enrollments DESC;

-- ============================================
-- 10. DATA INTEGRITY TESTS
-- ============================================

-- Test: Check for orphaned records (should return 0)
SELECT 'Orphaned Admins' AS test, COUNT(*) AS count
FROM ADMINS a
LEFT JOIN USERS u ON a.user_id = u.user_id
WHERE u.user_id IS NULL

UNION ALL

SELECT 'Orphaned Courses', COUNT(*)
FROM COURSES c
LEFT JOIN USERS u ON c.instructor_id = u.user_id
WHERE u.user_id IS NULL

UNION ALL

SELECT 'Orphaned Enrollments', COUNT(*)
FROM ENROLLMENTS e
LEFT JOIN USERS u ON e.user_id = u.user_id
LEFT JOIN COURSES c ON e.course_id = c.course_id
WHERE u.user_id IS NULL OR c.course_id IS NULL;

-- Test: Check for duplicate enrollments (should return 0)
SELECT 
    user_id,
    course_id,
    COUNT(*) AS duplicate_count
FROM ENROLLMENTS
GROUP BY user_id, course_id
HAVING COUNT(*) > 1;

-- Test: Verify foreign key relationships
SELECT 
    'COURSES -> USERS (instructor)' AS relationship,
    COUNT(*) AS valid_references
FROM COURSES c
JOIN USERS u ON c.instructor_id = u.user_id

UNION ALL

SELECT 
    'ENROLLMENTS -> USERS',
    COUNT(*)
FROM ENROLLMENTS e
JOIN USERS u ON e.user_id = u.user_id

UNION ALL

SELECT 
    'ENROLLMENTS -> COURSES',
    COUNT(*)
FROM ENROLLMENTS e
JOIN COURSES c ON e.course_id = c.course_id;

-- ============================================
-- END OF TEST QUERIES
-- ============================================
