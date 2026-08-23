# EarlyFlag AI/ML Approach

EarlyFlag uses an explainable weighted risk model rather than a black-box classifier. This is intentional for a school setting: teachers can immediately see what needs attention and can challenge or validate the underlying data.

For every student, the risk engine derives four 0–100 signals from the shared PostgreSQL database:

1. **Attendance trend (35%)** compares attendance in the most recent two-week data window with the preceding two weeks. A worsening rate increases risk.
2. **Academic trend (30%)** compares average percentage marks in the latest term and preceding term. A larger drop increases risk.
3. **Fee delay (15%)** measures overdue days on the most recently due unpaid fee.
4. **Engagement (20%)** counts non-positive engagement flags recorded during the last 30 days.

The final score is `attendance × 0.35 + academic × 0.30 + fees × 0.15 + engagement × 0.20`. Scores are classified as LOW (0–39), MEDIUM (40–69), or HIGH (70–100). When a sub-score exceeds 60, the system records a short reason code—such as `Attendance declining`, `Grades dropping`, `Fees overdue`, or `Engagement concerns`—alongside the score.

The engine runs on demand with `python compute_risk.py`, reads the raw tables directly, and replaces the `risk_scores` table with one fresh score per student. Students with missing history are safely assigned a low default for the unavailable signal, allowing the dashboard to remain usable as data arrives.
