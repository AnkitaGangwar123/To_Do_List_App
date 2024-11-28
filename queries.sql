CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);

-- INSERT INTO items (title) VALUES ('Buy milk'), ('Finish homework');


-- This update was done later when we want to store to-do lists for daily work.
ALTER TABLE items ADD COLUMN date DATE;