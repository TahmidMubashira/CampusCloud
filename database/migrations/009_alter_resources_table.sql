IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'resources' AND COLUMN_NAME = 'department_id')
    ALTER TABLE resources ADD department_id INT NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'resources' AND COLUMN_NAME = 'course_id')
    ALTER TABLE resources ADD course_id INT NULL;

-- Drop old text columns if they still exist
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'resources' AND COLUMN_NAME = 'department')
    ALTER TABLE resources DROP COLUMN department;

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'resources' AND COLUMN_NAME = 'courseCode')
    ALTER TABLE resources DROP COLUMN courseCode;

-- Fill existing rows with default values
UPDATE resources SET department_id = 1 WHERE department_id IS NULL;
UPDATE resources SET course_id = 1 WHERE course_id IS NULL;

-- Add foreign key constraints if they don't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
               WHERE CONSTRAINT_NAME = 'FK_resources_department')
    ALTER TABLE resources
    ADD CONSTRAINT FK_resources_department
    FOREIGN KEY (department_id) REFERENCES departments(department_id);

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
               WHERE CONSTRAINT_NAME = 'FK_resources_course')
    ALTER TABLE resources
    ADD CONSTRAINT FK_resources_course
    FOREIGN KEY (course_id) REFERENCES courses(course_id);

-- Make columns NOT NULL
ALTER TABLE resources ALTER COLUMN department_id INT NOT NULL;
ALTER TABLE resources ALTER COLUMN course_id INT NOT NULL;