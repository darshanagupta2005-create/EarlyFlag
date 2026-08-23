-- EarlyFlag 50-student demo dataset (reference date: 2026-08-20).
-- WARNING: this replaces data in the eight EarlyFlag tables only.
-- Run schema.sql first, then this file, then:
--   cd risk_engine && python compute_risk.py --as-of 2026-08-20

TRUNCATE TABLE interventions, risk_scores, engagement, fees, marks, attendance, students RESTART IDENTITY CASCADE;

INSERT INTO students (id, name, class, section) VALUES
  (1, 'Aarav Sharma', '10', 'A'), (2, 'Diya Patel', '10', 'A'),
  (3, 'Kabir Singh', '10', 'B'), (4, 'Meera Iyer', '9', 'A'),
  (5, 'Arjun Nair', '9', 'B'), (6, 'Ishaan Gupta', '10', 'B'),
  (7, 'Ananya Rao', '9', 'A'), (8, 'Riya Das', '10', 'A'),
  (9, 'Vihaan Kapoor', '9', 'B'), (10, 'Sana Khan', '10', 'B'),
  (11, 'Advait Joshi', '9', 'A'), (12, 'Nisha Verma', '10', 'A'),
  (13, 'Dev Malhotra', '9', 'B'), (14, 'Tara Menon', '10', 'B'),
  (15, 'Yash Kulkarni', '9', 'A'), (16, 'Aditi Bansal', '10', 'A'),
  (17, 'Rahul Mehta', '9', 'B'), (18, 'Kavya Reddy', '10', 'B'),
  (19, 'Rohan Bose', '9', 'A'), (20, 'Ira Chawla', '10', 'A'),
  (21, 'Neel Shah', '9', 'B'), (22, 'Maya Pillai', '10', 'B'),
  (23, 'Aditya Jain', '9', 'A'), (24, 'Sara Thomas', '10', 'A'),
  (25, 'Karan Sethi', '9', 'B'), (26, 'Aisha Mirza', '10', 'B'),
  (27, 'Rudra Roy', '9', 'A'), (28, 'Ishita Sen', '10', 'A'),
  (29, 'Vivaan Arora', '9', 'B'), (30, 'Myra Dutta', '10', 'B'),
  (31, 'Aryan Sinha', '9', 'A'), (32, 'Kiara Kapoor', '10', 'A'),
  (33, 'Reyansh Paul', '9', 'B'), (34, 'Anvi Bhat', '10', 'B'),
  (35, 'Samar Goel', '9', 'A'), (36, 'Navya Nanda', '10', 'A'),
  (37, 'Dhruv Bedi', '9', 'B'), (38, 'Pari Vora', '10', 'B'),
  (39, 'Ayaan Ali', '9', 'A'), (40, 'Zoya Fernandes', '10', 'A'),
  (41, 'Pranav Desai', '9', 'B'), (42, 'Ishani Ghosh', '10', 'B'),
  (43, 'Arnav Khanna', '9', 'A'), (44, 'Tanvi Sood', '10', 'A'),
  (45, 'Manav Bhatt', '9', 'B'), (46, 'Aarohi Kulkarni', '10', 'B'),
  (47, 'Ritvik Chopra', '9', 'A'), (48, 'Siya Nair', '10', 'A'),
  (49, 'Harsh Vyas', '9', 'B'), (50, 'Meher Anand', '10', 'B');
SELECT setval(pg_get_serial_sequence('students', 'id'), 50, true);

-- Every student gets 28 attendance records. IDs 1-10 decline sharply; 11-20 decline moderately.
INSERT INTO attendance (student_id, date, status)
SELECT s.id, d::date,
  CASE
    WHEN s.id <= 10 AND d >= DATE '2026-08-07' AND (EXTRACT(DAY FROM d)::int + s.id) % 5 <> 0 THEN 'absent'
    WHEN s.id BETWEEN 11 AND 20 AND d >= DATE '2026-08-07' AND (EXTRACT(DAY FROM d)::int + s.id) % 4 = 0 THEN 'absent'
    WHEN s.id BETWEEN 21 AND 30 AND (EXTRACT(DAY FROM d)::int + s.id) % 10 = 0 THEN 'absent'
    WHEN s.id > 30 AND (EXTRACT(DAY FROM d)::int + s.id) % 18 = 0 THEN 'absent'
    ELSE 'present'
  END
FROM students s
CROSS JOIN generate_series(DATE '2026-07-24', DATE '2026-08-20', INTERVAL '1 day') AS d;

-- Every student receives four subjects in both terms (400 complete mark records).
INSERT INTO marks (student_id, subject, term, score, max_score)
SELECT s.id, subject_name, term_name,
  CASE
    WHEN term_name = 'term1' THEN base_score
    WHEN s.id <= 10 THEN base_score - 28
    WHEN s.id <= 20 THEN base_score - 12
    WHEN s.id <= 30 THEN base_score - 4
    ELSE base_score + CASE WHEN s.id % 2 = 0 THEN 3 ELSE -2 END
  END,
  100
FROM students s
CROSS JOIN (VALUES
  ('Mathematics', 0), ('Science', 1), ('English', 2), ('Social Studies', 3)
) AS subjects(subject_name, subject_offset)
CROSS JOIN (VALUES ('term1'), ('term2')) AS terms(term_name)
CROSS JOIN LATERAL (
  SELECT (70 + ((s.id * 3 + subjects.subject_offset * 4) % 21))::numeric AS base_score
) AS scores;

-- Every student has a fee record, including paid_date where paid.
INSERT INTO fees (student_id, due_date, amount, paid_status, paid_date)
SELECT id,
  CASE WHEN id <= 10 THEN DATE '2026-07-01'
       WHEN id <= 20 THEN DATE '2026-07-17'
       WHEN id <= 30 THEN DATE '2026-08-01'
       ELSE DATE '2026-08-05' END,
  5000,
  CASE WHEN id <= 30 THEN 'unpaid' ELSE 'paid' END,
  CASE WHEN id > 30 THEN DATE '2026-08-01' + (id % 5) ELSE NULL END
FROM students;

-- Every student has at least one engagement record with a note.
INSERT INTO engagement (student_id, date, flag_type, notes)
SELECT id, DATE '2026-08-18',
  CASE WHEN id <= 10 THEN 'disciplinary'
       WHEN id <= 20 THEN 'disengaged'
       WHEN id <= 30 THEN 'neutral'
       ELSE 'praise' END,
  CASE WHEN id <= 10 THEN 'Repeated classroom disruption; counsellor follow-up advised.'
       WHEN id <= 20 THEN 'Reduced participation observed during group learning.'
       WHEN id <= 30 THEN 'Routine teacher observation recorded.'
       ELSE 'Positive classroom participation and peer support.' END
FROM students;

-- Additional recent negative flags make the high-risk demo cases unambiguous.
INSERT INTO engagement (student_id, date, flag_type, notes)
SELECT id, DATE '2026-08-19', 'disengaged', 'Missed group-work contribution follow-up.'
FROM students WHERE id <= 10;

INSERT INTO engagement (student_id, date, flag_type, notes)
SELECT id, DATE '2026-08-20', 'disciplinary', 'Late arrival and incomplete class activity.'
FROM students WHERE id <= 10;
