-- Add job_name column to ncs_approved_curriculum (idempotent: skip if column exists)
-- SQLite has no ADD COLUMN IF NOT EXISTS; this migration is a no-op when job_name already exists.
-- Run once manually if needed: ALTER TABLE ncs_approved_curriculum ADD COLUMN job_name TEXT;
SELECT 1;
