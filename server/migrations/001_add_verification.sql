-- 1. Add the boolean flag to know if they are verified or not (default to false)
ALTER TABLE account
ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Add a column to store the verification token (nullable)
ALTER TABLE account
ADD COLUMN verification_token VARCHAR(255);