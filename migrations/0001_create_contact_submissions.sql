-- Migration: Create contact_submissions table for D1.
--
-- Stores contact form submissions so that they are not lost even if email
-- delivery fails. Personal data (name, email, message) is kept to the
-- minimum necessary. IP addresses and user-agents are intentionally NOT
-- stored.
--
-- Apply:
--   wrangler d1 execute ouvill-blog-contact --remote \
--     --file=./migrations/0001_create_contact_submissions.sql

CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK (length(name) <= 100),
  email TEXT NOT NULL CHECK (length(email) <= 254),
  message TEXT NOT NULL CHECK (length(message) <= 5000),
  email_status TEXT NOT NULL CHECK (email_status IN ('pending', 'sent', 'failed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON contact_submissions (created_at);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email_status
  ON contact_submissions (email_status);
