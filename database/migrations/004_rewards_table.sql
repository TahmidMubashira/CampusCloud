CREATE TABLE rewards (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    points_earned INT DEFAULT 0,
    reward_name NVARCHAR(255) NOT NULL,
    reward_description NVARCHAR(MAX) NULL,
    created_at DATETIME2 NULL,
    updated_at DATETIME2 NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);