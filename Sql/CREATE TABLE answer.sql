CREATE TABLE IF NOT EXISTS answer (
  id SERIAL PRIMARY KEY,
  -- Unique identifier for each answer
  answer_text VARCHAR(255) NOT NULL,
  -- Text of the answer
  is_correct BOOLEAN NOT NULL,
  -- Indicates if the answer is correct
  question_id INT REFERENCES question(id) ON DELETE CASCADE -- Links to the question table
);