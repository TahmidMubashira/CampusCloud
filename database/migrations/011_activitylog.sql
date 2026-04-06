CREATE TABLE activity_logs (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    action NVARCHAR(255) NOT NULL,
    resource_id INT NULL,
    details NVARCHAR(MAX) NULL,
    created_at DATETIME2 NULL,
    updated_at DATETIME2 NULL,

    CONSTRAINT FK_activity_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT FK_activity_logs_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE NO ACTION
);