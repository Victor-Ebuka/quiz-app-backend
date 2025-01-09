CREATE TABLE IF NOT EXISTS quiz (
  id SERIAL PRIMARY KEY,
  -- Unique identifier for each quiz
  title VARCHAR(255) NOT NULL,
  -- Title of the quiz
  difficulty VARCHAR(6) CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')) -- Restricts difficulty to specific values
);