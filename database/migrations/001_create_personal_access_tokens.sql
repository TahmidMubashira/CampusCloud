CREATE TABLE personal_access_tokens (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    tokenable_type  NVARCHAR(255) NOT NULL,
    tokenable_id    BIGINT        NOT NULL,
    name            NVARCHAR(255) NOT NULL,
    token           NVARCHAR(64)  NOT NULL UNIQUE,
    abilities       NVARCHAR(MAX) NULL,
    last_used_at    DATETIME2     NULL,
    expires_at      DATETIME2     NULL,
    created_at      DATETIME2     NULL,
    updated_at      DATETIME2     NULL
);