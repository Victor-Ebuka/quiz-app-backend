CREATE TABLE IF NOT EXISTS score (
  id SERIAL PRIMARY KEY,
  score INT NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INT REFERENCES quiz(id) ON DELETE CASCADE,
  date_taken DATE NOT NULL
)