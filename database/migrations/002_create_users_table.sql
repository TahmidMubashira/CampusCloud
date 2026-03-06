CREATE TABLE users (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    name          NVARCHAR(255)        NOT NULL,
    email         NVARCHAR(255)        NOT NULL UNIQUE,
    password      NVARCHAR(255)        NOT NULL,
    role          NVARCHAR(50)         NOT NULL DEFAULT 'student',
    remember_token NVARCHAR(100)       NULL,
    created_at    DATETIME2            NULL,
    updated_at    DATETIME2            NULL
);