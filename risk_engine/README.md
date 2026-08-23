# EarlyFlag risk engine

This component owns Person 2's explainable, rule-based risk scoring. It reads the shared PostgreSQL database directly and writes the current risk snapshot into the contract-defined `risk_scores` table. It never calls the backend API.

## Setup and run

1. Start the team's PostgreSQL container and have Person 1 create/populate the contract schema.
2. From this folder, install the dependency:

   ```bash
   python -m pip install -r requirements.txt
   ```

3. Run the engine:

   ```bash
   python compute_risk.py
   ```

   For the repository's deterministic demo seed, use:

   ```bash
   python compute_risk.py --as-of 2026-08-20
   ```

It defaults to `localhost:5432`, database `earlyflag_db`, user `earlyflag`, password `earlyflag123`. Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, or `DB_PASSWORD` to override these values.

Run the non-database unit tests with:

```bash
python -m unittest test_compute_risk.py
```

For the final walkthrough, use the candidate-selection query in
[`../docs/demo_hero_selection.md`](../docs/demo_hero_selection.md) after scoring
the shared sample data.

## Data contract

Reads: `students`, `attendance`, `marks`, `fees`, and `engagement`.

Writes: `risk_scores(student_id, score, level, reason_codes, sub_scores)`. `reason_codes` is a JSON array and `sub_scores` is a JSON object with exactly `attendance`, `academic`, `fees`, and `engagement` keys. A successful run replaces the prior snapshot so there is one current score per student.

## Scoring rules

| Signal | Rule | Weight |
| --- | --- | --- |
| Attendance | Percentage-point fall: recent 14 data days versus the prior 14; a 25-point fall reaches 100 | 35% |
| Academics | Average percentage-point fall: latest ordered term versus previous; a 30-point fall reaches 100 | 30% |
| Fees | Most recently due unpaid fee; 2 points per overdue day, capped at 100 | 15% |
| Engagement | Negative flags in the last 30 days; 25 points per flag, capped at 100 | 20% |

Final score: `attendance × .35 + academic × .30 + fees × .15 + engagement × .20`.

Levels: `LOW` 0–39, `MEDIUM` 40–69, `HIGH` 70–100. A reason is included only when its sub-score is above 60. Missing history produces a zero score for that signal, giving new/incomplete students a conservative lower-risk default without failing the run.
