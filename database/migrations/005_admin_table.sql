CREATE TABLE admins (
    admin_id      INT IDENTITY(1,1) PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    DATETIME2 NULL,
    updated_at    DATETIME2 NULL
);

INSERT INTO admins (name, email, password_hash, created_at, updated_at)
VALUES (
    'Admin User',
    'admin@campuscloud.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    GETDATE(),
    GETDATE()
);

UPDATE admins
SET password_hash = '$2y$10$FjrS4E1H8rG3FCzDI.7JnOxaQHcg2ObC/tpGWhxqfqxlOfwQQuc.6'
WHERE email = 'admin@campuscloud.com';