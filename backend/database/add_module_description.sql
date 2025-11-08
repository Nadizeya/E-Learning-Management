-- Migration script to add description column to COURSE_MODULES table
-- Run this if the column doesn't exist yet (JPA update mode should handle it automatically)

ALTER TABLE COURSE_MODULES 
ADD COLUMN description TEXT NULL AFTER title;

