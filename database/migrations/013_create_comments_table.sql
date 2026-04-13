CREATE TABLE comments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    resource_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT NULL,         -- NULL = top-level comment, INT = reply to a comment
    body NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NULL,
    updated_at DATETIME2 NULL,

    CONSTRAINT FK_comments_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT FK_comments_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_comments_parent FOREIGN KEY (parent_id) REFERENCES comments(id)
);