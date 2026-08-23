# Person 2 — Demo Hero Student Selection

Run the risk engine after Person 1 uploads the sample CSV files. Then use this query to identify candidates for the dashboard walkthrough:

```sql
SELECT
  s.id,
  s.name,
  rs.score,
  rs.level,
  rs.reason_codes,
  rs.sub_scores
FROM students s
JOIN risk_scores rs ON rs.student_id = s.id
ORDER BY rs.score DESC, s.name
LIMIT 5;
```

Choose two or three students with distinct, easy-to-explain stories:

1. One **HIGH** risk student with two or more reasons (the primary walkthrough).
2. One **MEDIUM** risk student driven by a different signal, ideally fees or engagement.
3. One **LOW** risk student with no reason codes, to show that the dashboard does not over-flag students.

For the demo, speak only to the displayed reason codes and trends: the score flags a student for teacher review; it is not a diagnosis or automatic decision.
