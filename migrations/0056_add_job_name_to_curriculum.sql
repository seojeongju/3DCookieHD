-- Add job_name column to ncs_approved_curriculum table to support multi-job curriculum organization
ALTER TABLE ncs_approved_curriculum ADD COLUMN job_name TEXT;
