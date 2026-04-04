CREATE TABLE resources (
    id INT IDENTITY(1,1) PRIMARY KEY,

    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    department NVARCHAR(100) NOT NULL,
    courseCode NVARCHAR(50) NOT NULL,
    resourceType NVARCHAR(100) NOT NULL,

    file_path NVARCHAR(500) NOT NULL,
    file_type NVARCHAR(50),
    file_size NVARCHAR(50),

    user_id INT NOT NULL,
    downloads INT DEFAULT 0,

    created_at DATETIME2 NULL,
    updated_at DATETIME2 NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
);