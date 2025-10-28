-- ============================================
-- E-Learning Management System (LMS) Database Schema
-- ============================================
-- Database: lms_elearn_db
-- Total Tables: 19
-- ============================================

USE lms_elearn_db;

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS SUPPORT_REQUESTS;
DROP TABLE IF EXISTS ACHIEVEMENTS;
DROP TABLE IF EXISTS USER_BADGES;
DROP TABLE IF EXISTS BADGES;
DROP TABLE IF EXISTS ASSIGNMENT_SUBMISSIONS;
DROP TABLE IF EXISTS ASSIGNMENTS;
DROP TABLE IF EXISTS QUIZ_ATTEMPTS;
DROP TABLE IF EXISTS QUIZ_QUESTIONS;
DROP TABLE IF EXISTS QUIZZES;
DROP TABLE IF EXISTS CERTIFICATES;
DROP TABLE IF EXISTS STUDENT_PROGRESS;
DROP TABLE IF EXISTS ENROLLMENTS;
DROP TABLE IF EXISTS RESOURCES;
DROP TABLE IF EXISTS COURSE_CONTENT;
DROP TABLE IF EXISTS COURSE_MODULES;
DROP TABLE IF EXISTS COURSES;
DROP TABLE IF EXISTS CATEGORIES;
DROP TABLE IF EXISTS ADMINS;
DROP TABLE IF EXISTS USERS;

-- ============================================
-- 1. USER MANAGEMENT (3 TABLES)
-- ============================================

-- Table 1: USERS
CREATE TABLE USERS (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_instructor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_is_instructor (is_instructor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 2: ADMINS
CREATE TABLE ADMINS (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    permissions TEXT COMMENT 'JSON or comma-separated list of permissions',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 3: CATEGORIES
CREATE TABLE CATEGORIES (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. COURSE AND CONTENT STRUCTURE (4 TABLES)
-- ============================================

-- Table 4: COURSES
CREATE TABLE COURSES (
    course_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    instructor_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('Draft', 'Published') DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES CATEGORIES(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (instructor_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_instructor (instructor_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 5: COURSE_MODULES
CREATE TABLE COURSE_MODULES (
    module_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    module_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES COURSES(course_id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_order (module_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 6: COURSE_CONTENT
CREATE TABLE COURSE_CONTENT (
    content_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    module_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_type ENUM('Video', 'Reading', 'Quiz', 'Assignment') NOT NULL,
    content_url VARCHAR(500),
    content_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES COURSE_MODULES(module_id) ON DELETE CASCADE,
    INDEX idx_module (module_id),
    INDEX idx_content_type (content_type),
    INDEX idx_order (content_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 7: RESOURCES
CREATE TABLE RESOURCES (
    resource_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES COURSE_CONTENT(content_id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. ENROLLMENT AND PROGRESS TRACKING (3 TABLES)
-- ============================================

-- Table 8: ENROLLMENTS
CREATE TABLE ENROLLMENTS (
    enrollment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_status ENUM('In Progress', 'Completed') DEFAULT 'In Progress',
    UNIQUE KEY unique_enrollment (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES COURSES(course_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_course (course_id),
    INDEX idx_status (completion_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 9: STUDENT_PROGRESS
CREATE TABLE STUDENT_PROGRESS (
    progress_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content_id BIGINT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_progress (user_id, content_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES COURSE_CONTENT(content_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_content (content_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 10: CERTIFICATES
CREATE TABLE CERTIFICATES (
    certificate_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unique_code VARCHAR(100) UNIQUE NOT NULL,
    FOREIGN KEY (enrollment_id) REFERENCES ENROLLMENTS(enrollment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_enrollment (enrollment_id),
    INDEX idx_user (user_id),
    INDEX idx_unique_code (unique_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. ASSESSMENTS AND GRADING (5 TABLES)
-- ============================================

-- Table 11: QUIZZES
CREATE TABLE QUIZZES (
    quiz_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    max_score DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES COURSE_CONTENT(content_id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 12: QUIZ_QUESTIONS
CREATE TABLE QUIZ_QUESTIONS (
    question_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES QUIZZES(quiz_id) ON DELETE CASCADE,
    INDEX idx_quiz (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 13: QUIZ_ATTEMPTS
CREATE TABLE QUIZ_ATTEMPTS (
    attempt_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES QUIZZES(quiz_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_quiz (quiz_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 14: ASSIGNMENTS
CREATE TABLE ASSIGNMENTS (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMP NULL,
    max_score DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES COURSE_CONTENT(content_id) ON DELETE CASCADE,
    INDEX idx_content (content_id),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 15: ASSIGNMENT_SUBMISSIONS
CREATE TABLE ASSIGNMENT_SUBMISSIONS (
    submission_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    file_url VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade_score DECIMAL(5, 2) NULL,
    instructor_feedback TEXT,
    FOREIGN KEY (assignment_id) REFERENCES ASSIGNMENTS(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_assignment (assignment_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. GAMIFICATION AND ENGAGEMENT (3 TABLES)
-- ============================================

-- Table 16: BADGES
CREATE TABLE BADGES (
    badge_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 17: USER_BADGES
CREATE TABLE USER_BADGES (
    user_badge_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_badge (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES BADGES(badge_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_badge (badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 18: ACHIEVEMENTS
CREATE TABLE ACHIEVEMENTS (
    achievement_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    points_reward INT DEFAULT 0,
    trigger_condition TEXT COMMENT 'Describes what triggers the achievement',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. COMMUNICATION AND SUPPORT (1 TABLE)
-- ============================================

-- Table 19: SUPPORT_REQUESTS
CREATE TABLE SUPPORT_REQUESTS (
    request_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Closed') DEFAULT 'Open',
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert sample users
INSERT INTO USERS (first_name, last_name, email, password_hash, is_instructor) VALUES
('John', 'Doe', 'john.doe@example.com', '$2a$10$SampleHashedPassword1', FALSE),
('Jane', 'Smith', 'jane.smith@example.com', '$2a$10$SampleHashedPassword2', TRUE),
('Admin', 'User', 'admin@lms.com', '$2a$10$SampleHashedPassword3', FALSE),
('Bob', 'Johnson', 'bob.johnson@example.com', '$2a$10$SampleHashedPassword4', TRUE),
('Alice', 'Williams', 'alice.williams@example.com', '$2a$10$SampleHashedPassword5', FALSE);

-- Insert admin
INSERT INTO ADMINS (user_id, permissions) VALUES
(3, 'all,manage_users,manage_courses,manage_content,view_reports');

-- Insert categories
INSERT INTO CATEGORIES (name, description) VALUES
('Web Development', 'Learn web development technologies including HTML, CSS, JavaScript, and frameworks'),
('Data Science', 'Master data analysis, machine learning, and statistical methods'),
('Mobile Development', 'Build iOS and Android applications'),
('Business', 'Business management, entrepreneurship, and leadership courses'),
('Design', 'Graphic design, UI/UX, and creative skills');

-- Insert sample courses
INSERT INTO COURSES (category_id, instructor_id, title, description, price, status) VALUES
(1, 2, 'Complete Web Development Bootcamp', 'Learn HTML, CSS, JavaScript, React, Node.js and more', 99.99, 'Published'),
(2, 4, 'Data Science Fundamentals', 'Introduction to data analysis and machine learning', 79.99, 'Published'),
(1, 2, 'Advanced JavaScript', 'Deep dive into JavaScript ES6+ features', 59.99, 'Draft');

-- Insert course modules
INSERT INTO COURSE_MODULES (course_id, title, module_order) VALUES
(1, 'Introduction to HTML', 1),
(1, 'CSS Fundamentals', 2),
(1, 'JavaScript Basics', 3),
(2, 'Introduction to Data Science', 1),
(2, 'Python for Data Analysis', 2);

-- Insert course content
INSERT INTO COURSE_CONTENT (module_id, title, content_type, content_url, content_order) VALUES
(1, 'What is HTML?', 'Video', 'https://example.com/videos/html-intro.mp4', 1),
(1, 'HTML Tags and Elements', 'Reading', 'https://example.com/readings/html-tags.pdf', 2),
(1, 'HTML Quiz', 'Quiz', NULL, 3),
(2, 'CSS Selectors', 'Video', 'https://example.com/videos/css-selectors.mp4', 1),
(3, 'JavaScript Variables', 'Video', 'https://example.com/videos/js-variables.mp4', 1);

-- Insert enrollments
INSERT INTO ENROLLMENTS (user_id, course_id, completion_status) VALUES
(1, 1, 'In Progress'),
(5, 1, 'In Progress'),
(1, 2, 'Completed');

-- Insert student progress
INSERT INTO STUDENT_PROGRESS (user_id, content_id) VALUES
(1, 1),
(1, 2),
(5, 1);

-- Insert certificates
INSERT INTO CERTIFICATES (enrollment_id, user_id, unique_code) VALUES
(3, 1, 'CERT-2024-001-ABC123XYZ');

-- Insert quizzes
INSERT INTO QUIZZES (content_id, title, max_score) VALUES
(3, 'HTML Basics Quiz', 100.00);

-- Insert quiz questions
INSERT INTO QUIZ_QUESTIONS (quiz_id, question_text, correct_answer) VALUES
(1, 'What does HTML stand for?', 'HyperText Markup Language'),
(1, 'Which tag is used for the largest heading?', '<h1>');

-- Insert quiz attempts
INSERT INTO QUIZ_ATTEMPTS (quiz_id, user_id, score) VALUES
(1, 1, 85.00),
(1, 5, 92.00);

-- Insert assignments
INSERT INTO ASSIGNMENTS (content_id, title, due_date, max_score) VALUES
(2, 'Create a Simple HTML Page', '2024-12-31 23:59:59', 100.00);

-- Insert assignment submissions
INSERT INTO ASSIGNMENT_SUBMISSIONS (assignment_id, user_id, file_url, grade_score, instructor_feedback) VALUES
(1, 1, 'https://example.com/submissions/user1-html-page.zip', 95.00, 'Excellent work! Well-structured HTML.');

-- Insert badges
INSERT INTO BADGES (name, description, icon_url) VALUES
('First Course', 'Completed your first course', 'https://example.com/badges/first-course.png'),
('Quiz Master', 'Scored 100% on a quiz', 'https://example.com/badges/quiz-master.png'),
('Early Bird', 'Enrolled in a course within first week', 'https://example.com/badges/early-bird.png');

-- Insert user badges
INSERT INTO USER_BADGES (user_id, badge_id) VALUES
(1, 1),
(1, 3),
(5, 3);

-- Insert achievements
INSERT INTO ACHIEVEMENTS (name, description, points_reward, trigger_condition) VALUES
('Course Completion', 'Complete any course', 100, 'User completes a course with 100% progress'),
('Perfect Score', 'Get 100% on any quiz', 50, 'User scores 100% on a quiz'),
('Dedicated Learner', 'Complete 5 courses', 500, 'User completes 5 different courses');

-- Insert support requests
INSERT INTO SUPPORT_REQUESTS (user_id, subject, description, status, priority) VALUES
(1, 'Cannot access video content', 'I am unable to play videos in Module 2', 'Open', 'High'),
(5, 'Question about certificate', 'When will I receive my certificate?', 'In Progress', 'Medium');

-- Insert resources
INSERT INTO RESOURCES (content_id, file_name, file_url, file_type) VALUES
(2, 'HTML Cheat Sheet', 'https://example.com/resources/html-cheatsheet.pdf', 'PDF'),
(4, 'CSS Reference Guide', 'https://example.com/resources/css-reference.pdf', 'PDF');

-- ============================================
-- CREATE USEFUL VIEWS
-- ============================================

-- View: Course Overview with Instructor Details
CREATE OR REPLACE VIEW v_course_overview AS
SELECT 
    c.course_id,
    c.title AS course_title,
    c.description,
    c.price,
    c.status,
    CONCAT(u.first_name, ' ', u.last_name) AS instructor_name,
    u.email AS instructor_email,
    cat.name AS category_name,
    COUNT(DISTINCT e.enrollment_id) AS total_enrollments,
    COUNT(DISTINCT cm.module_id) AS total_modules
FROM COURSES c
JOIN USERS u ON c.instructor_id = u.user_id
JOIN CATEGORIES cat ON c.category_id = cat.category_id
LEFT JOIN ENROLLMENTS e ON c.course_id = e.course_id
LEFT JOIN COURSE_MODULES cm ON c.course_id = cm.course_id
GROUP BY c.course_id, c.title, c.description, c.price, c.status, 
         u.first_name, u.last_name, u.email, cat.name;

-- View: Student Progress Dashboard
CREATE OR REPLACE VIEW v_student_dashboard AS
SELECT 
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    u.email,
    COUNT(DISTINCT e.enrollment_id) AS total_enrollments,
    COUNT(DISTINCT CASE WHEN e.completion_status = 'Completed' THEN e.enrollment_id END) AS completed_courses,
    COUNT(DISTINCT sp.progress_id) AS completed_content,
    COUNT(DISTINCT ub.badge_id) AS total_badges,
    COUNT(DISTINCT cert.certificate_id) AS total_certificates
FROM USERS u
LEFT JOIN ENROLLMENTS e ON u.user_id = e.user_id
LEFT JOIN STUDENT_PROGRESS sp ON u.user_id = sp.user_id
LEFT JOIN USER_BADGES ub ON u.user_id = ub.user_id
LEFT JOIN CERTIFICATES cert ON u.user_id = cert.user_id
WHERE u.is_instructor = FALSE
GROUP BY u.user_id, u.first_name, u.last_name, u.email;

-- View: Instructor Course Statistics
CREATE OR REPLACE VIEW v_instructor_stats AS
SELECT 
    u.user_id AS instructor_id,
    CONCAT(u.first_name, ' ', u.last_name) AS instructor_name,
    COUNT(DISTINCT c.course_id) AS total_courses,
    COUNT(DISTINCT CASE WHEN c.status = 'Published' THEN c.course_id END) AS published_courses,
    COUNT(DISTINCT e.enrollment_id) AS total_students,
    AVG(asub.grade_score) AS average_assignment_grade
FROM USERS u
JOIN COURSES c ON u.user_id = c.instructor_id
LEFT JOIN ENROLLMENTS e ON c.course_id = e.course_id
LEFT JOIN COURSE_MODULES cm ON c.course_id = cm.course_id
LEFT JOIN COURSE_CONTENT cc ON cm.module_id = cc.module_id
LEFT JOIN ASSIGNMENTS a ON cc.content_id = a.content_id
LEFT JOIN ASSIGNMENT_SUBMISSIONS asub ON a.assignment_id = asub.assignment_id
WHERE u.is_instructor = TRUE
GROUP BY u.user_id, u.first_name, u.last_name;

-- ============================================
-- END OF SCHEMA
-- ============================================
