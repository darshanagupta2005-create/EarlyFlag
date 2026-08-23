-- Deterministic 15-student demo dataset. Reference date: 2026-08-20.
-- It intentionally includes clear HIGH, MEDIUM, and LOW risk stories.
TRUNCATE TABLE interventions, risk_scores, engagement, fees, marks, attendance, students RESTART IDENTITY CASCADE;

INSERT INTO students (id, name, class, section) VALUES
  (1, 'Aarav Sharma', '10', 'A'),
  (2, 'Diya Patel', '10', 'A'),
  (3, 'Kabir Singh', '10', 'B'),
  (4, 'Meera Iyer', '9', 'A'),
  (5, 'Arjun Nair', '9', 'B'),
  (6, 'Ishaan Gupta', '10', 'B'),
  (7, 'Ananya Rao', '9', 'A'),
  (8, 'Riya Das', '10', 'A'),
  (9, 'Vihaan Kapoor', '9', 'B'),
  (10, 'Sana Khan', '10', 'B'),
  (11, 'Advait Joshi', '9', 'A'),
  (12, 'Nisha Verma', '10', 'A'),
  (13, 'Dev Malhotra', '9', 'B'),
  (14, 'Tara Menon', '10', 'B'),
  (15, 'Yash Kulkarni', '9', 'A');
SELECT setval(pg_get_serial_sequence('students', 'id'), 15, true);

-- 28 days of attendance. Students 1 and 2 decline sharply; 4 declines moderately.
INSERT INTO attendance (student_id, date, status)
SELECT s.id, d::date,
  CASE
    WHEN s.id = 1 AND d >= DATE '2026-08-07' AND EXTRACT(DAY FROM d)::int % 4 <> 0 THEN 'absent'
    WHEN s.id = 2 AND d >= DATE '2026-08-07' AND EXTRACT(DAY FROM d)::int % 3 <> 0 THEN 'absent'
    WHEN s.id = 4 AND d >= DATE '2026-08-07' AND EXTRACT(DAY FROM d)::int % 3 = 0 THEN 'absent'
    WHEN s.id = 3 AND EXTRACT(DAY FROM d)::int % 8 = 0 THEN 'absent'
    ELSE 'present'
  END
FROM students s
CROSS JOIN generate_series(DATE '2026-07-24', DATE '2026-08-20', INTERVAL '1 day') AS d;

INSERT INTO marks (student_id, subject, term, score, max_score) VALUES
  (1, 'Mathematics', 'term1', 90, 100), (1, 'Science', 'term1', 86, 100),
  (1, 'Mathematics', 'term2', 50, 100), (1, 'Science', 'term2', 48, 100),
  (2, 'Mathematics', 'term1', 84, 100), (2, 'Science', 'term1', 82, 100),
  (2, 'Mathematics', 'term2', 57, 100), (2, 'Science', 'term2', 55, 100),
  (3, 'Mathematics', 'term1', 82, 100), (3, 'Science', 'term1', 80, 100),
  (3, 'Mathematics', 'term2', 67, 100), (3, 'Science', 'term2', 65, 100),
  (4, 'Mathematics', 'term1', 80, 100), (4, 'Science', 'term1', 78, 100),
  (4, 'Mathematics', 'term2', 68, 100), (4, 'Science', 'term2', 66, 100),
  (5, 'Mathematics', 'term1', 73, 100), (5, 'Science', 'term1', 75, 100),
  (5, 'Mathematics', 'term2', 78, 100), (5, 'Science', 'term2', 77, 100),
  (6, 'Mathematics', 'term1', 85, 100), (6, 'Science', 'term1', 83, 100),
  (6, 'Mathematics', 'term2', 86, 100), (6, 'Science', 'term2', 84, 100),
  (7, 'Mathematics', 'term1', 70, 100), (7, 'Science', 'term1', 72, 100),
  (7, 'Mathematics', 'term2', 72, 100), (7, 'Science', 'term2', 74, 100),
  (8, 'Mathematics', 'term1', 88, 100), (8, 'Science', 'term1', 86, 100),
  (8, 'Mathematics', 'term2', 87, 100), (8, 'Science', 'term2', 88, 100),
  (9, 'Mathematics', 'term1', 68, 100), (9, 'Science', 'term1', 70, 100),
  (9, 'Mathematics', 'term2', 71, 100), (9, 'Science', 'term2', 69, 100),
  (10, 'Mathematics', 'term1', 79, 100), (10, 'Science', 'term1', 81, 100),
  (10, 'Mathematics', 'term2', 80, 100), (10, 'Science', 'term2', 82, 100),
  (11, 'Mathematics', 'term1', 76, 100), (11, 'Science', 'term1', 77, 100),
  (11, 'Mathematics', 'term2', 78, 100), (11, 'Science', 'term2', 79, 100),
  (12, 'Mathematics', 'term1', 91, 100), (12, 'Science', 'term1', 89, 100),
  (12, 'Mathematics', 'term2', 92, 100), (12, 'Science', 'term2', 90, 100),
  (13, 'Mathematics', 'term1', 74, 100), (13, 'Science', 'term1', 73, 100),
  (13, 'Mathematics', 'term2', 76, 100), (13, 'Science', 'term2', 75, 100),
  (14, 'Mathematics', 'term1', 82, 100), (14, 'Science', 'term1', 80, 100),
  (14, 'Mathematics', 'term2', 83, 100), (14, 'Science', 'term2', 81, 100),
  (15, 'Mathematics', 'term1', 77, 100), (15, 'Science', 'term1', 76, 100),
  (15, 'Mathematics', 'term2', 78, 100), (15, 'Science', 'term2', 77, 100);

INSERT INTO fees (student_id, due_date, amount, paid_status, paid_date) VALUES
  (1, '2026-07-01', 5000, 'unpaid', NULL),
  (2, '2026-07-18', 5000, 'unpaid', NULL),
  (3, '2026-07-01', 5000, 'unpaid', NULL),
  (4, '2026-08-05', 5000, 'paid', '2026-08-04'),
  (5, '2026-08-05', 5000, 'paid', '2026-08-02'),
  (6, '2026-08-05', 5000, 'paid', '2026-08-03'),
  (7, '2026-08-05', 5000, 'paid', '2026-08-05'),
  (8, '2026-08-05', 5000, 'paid', '2026-08-01'),
  (9, '2026-08-05', 5000, 'paid', '2026-08-04'),
  (10, '2026-08-05', 5000, 'paid', '2026-08-02'),
  (11, '2026-08-05', 5000, 'paid', '2026-08-03'),
  (12, '2026-08-05', 5000, 'paid', '2026-08-01'),
  (13, '2026-08-05', 5000, 'paid', '2026-08-04'),
  (14, '2026-08-05', 5000, 'paid', '2026-08-02'),
  (15, '2026-08-05', 5000, 'paid', '2026-08-03');

INSERT INTO engagement (student_id, date, flag_type, notes) VALUES
  (1, '2026-08-10', 'disciplinary', 'Repeated classroom disruption'),
  (1, '2026-08-14', 'disengaged', 'Did not participate in group work'),
  (1, '2026-08-18', 'disciplinary', 'Missed counselling check-in'),
  (2, '2026-08-12', 'disengaged', 'Withdrew from class activities'),
  (2, '2026-08-19', 'disciplinary', 'Late arrival without explanation'),
  (3, '2026-08-16', 'disengaged', 'Low participation this week'),
  (3, '2026-08-19', 'disengaged', 'Did not submit group contribution'),
  (3, '2026-08-20', 'disciplinary', 'Left class without permission'),
  (4, '2026-08-17', 'disengaged', 'Quiet in class'),
  (6, '2026-08-15', 'praise', 'Helped a peer with science work'),
  (8, '2026-08-18', 'achievement', 'Excellent science project');
