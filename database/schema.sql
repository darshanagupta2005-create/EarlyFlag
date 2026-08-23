CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  class VARCHAR(20),
  section VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  date DATE NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('present','absent'))
);

CREATE TABLE marks (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  subject VARCHAR(50) NOT NULL,
  term VARCHAR(20) NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) DEFAULT 100
);

CREATE TABLE fees (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  due_date DATE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  paid_status VARCHAR(10) NOT NULL CHECK (paid_status IN ('paid','unpaid')),
  paid_date DATE
);

CREATE TABLE engagement (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  date DATE NOT NULL,
  flag_type VARCHAR(50) NOT NULL,
  notes TEXT
);

CREATE TABLE risk_scores (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  score NUMERIC(5,2) NOT NULL,
  level VARCHAR(10) NOT NULL CHECK (level IN ('LOW','MEDIUM','HIGH')),
  reason_codes JSONB NOT NULL,
  sub_scores JSONB NOT NULL,
  computed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE interventions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  action_taken TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  outcome TEXT
);
