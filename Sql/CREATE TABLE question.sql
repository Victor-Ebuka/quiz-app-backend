CREATE TABLE IF NOT EXISTS question (
  id SERIAL PRIMARY KEY,
  -- Unique identifier for each question
  text VARCHAR(255) NOT NULL,
  -- Text of the question
  type VARCHAR(10) CHECK (type IN ('MULTIPLE', 'TRUE/FALSE')),
  -- Restricts question type to specific values
  quiz_id INT REFERENCES quiz(id) ON DELETE CASCADE
);