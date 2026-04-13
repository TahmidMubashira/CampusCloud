IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'resources' AND COLUMN_NAME = 'rejection_reason')
    ALTER TABLE resources ADD rejection_reason NVARCHAR(MAX) NULL;