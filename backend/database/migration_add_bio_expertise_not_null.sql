-- Migration script to add NOT NULL constraints and update column length for bio and expertise
-- Run this script to update your existing database schema

USE lms_elearn_db;

-- Step 1: Update existing NULL values (if any) - Set default values for existing records
UPDATE INSTRUCTORS 
SET bio = 'No bio provided' 
WHERE bio IS NULL OR bio = '';

UPDATE INSTRUCTORS 
SET expertise = 'No expertise specified' 
WHERE expertise IS NULL OR expertise = '';

-- Step 2: Alter the expertise column to increase length from 255 to 500
ALTER TABLE INSTRUCTORS 
MODIFY COLUMN expertise VARCHAR(500);

-- Step 3: Add NOT NULL constraints
ALTER TABLE INSTRUCTORS 
MODIFY COLUMN bio TEXT NOT NULL;

ALTER TABLE INSTRUCTORS 
MODIFY COLUMN expertise VARCHAR(500) NOT NULL;

-- Verify the changes
DESCRIBE INSTRUCTORS;

