-- Add comment_count to resources (updated by trigger)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'resources' AND COLUMN_NAME = 'comment_count')
    ALTER TABLE resources ADD comment_count INT DEFAULT 0;

-- Update existing resources with actual counts
UPDATE resources 
SET comment_count = (
    SELECT COUNT(*) FROM comments 
    WHERE comments.resource_id = resources.id
);

-- Notifications table
CREATE TABLE notifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    type NVARCHAR(50) NOT NULL,        -- 'new_comment' or 'new_reply'
    message NVARCHAR(500) NOT NULL,
    resource_id INT NULL,
    is_read BIT DEFAULT 0,
    created_at DATETIME2 NULL,
    updated_at DATETIME2 NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE NO ACTION
);

-- Trigger: auto-update comment_count when comment inserted
CREATE TRIGGER trg_increment_comment_count
ON comments
AFTER INSERT
AS
BEGIN
    UPDATE resources
    SET comment_count = comment_count + 1
    FROM resources
    INNER JOIN inserted ON resources.id = inserted.resource_id
    WHERE inserted.parent_id IS NULL;  -- only count top-level comments
END;

-- Trigger: auto-decrement comment_count when comment deleted
CREATE TRIGGER trg_decrement_comment_count
ON comments
AFTER DELETE
AS
BEGIN
    UPDATE resources
    SET comment_count = comment_count - 1
    FROM resources
    INNER JOIN deleted ON resources.id = deleted.resource_id
    WHERE deleted.parent_id IS NULL;
END;