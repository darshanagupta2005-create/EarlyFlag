# Shared EarlyFlag demo database

This folder is deliberately compatible with the team's integration contract. It contains the exact PostgreSQL schema and a deterministic 15-student demo dataset, including clear HIGH, MEDIUM, and LOW risk cases.

## One-command setup (PowerShell)

With Docker Desktop running, execute this from the project root:

```powershell
.\database\load_demo_data.ps1
```

The script starts PostgreSQL on port 5432, creates the schema only if it is missing, then resets and inserts data into only the eight EarlyFlag tables. It does not create backend or frontend-specific tables.

After loading, score the data with:

```powershell
cd risk_engine
python -m pip install -r requirements.txt
python compute_risk.py --as-of 2026-08-20
```

## Demo stories

- **Aarav Sharma (ID 1):** strong attendance and marks decline, a long-overdue fee, and several engagement flags — intended HIGH-risk walkthrough.
- **Diya Patel (ID 2):** attendance and grade decline plus unpaid fee — alternate HIGH-risk story.
- **Kabir Singh (ID 3):** moderate grade decline, long-overdue fees, and engagement flags — intended MEDIUM-risk contrast.
- **Riya Das (ID 8):** positive/steady data — intended LOW-risk contrast.

The reference date matters because overdue-fee scoring uses days overdue. Use `--as-of 2026-08-20` for the intended demo results.

## Larger UI dataset

`seed_50_students.sql` is a separate, full replacement demo dataset for the dashboard. It contains 50 students, 1,400 attendance rows, 400 marks rows, a fee record for every student, and engagement notes for every student. It intentionally creates 10 clear HIGH-risk cases, 10 MEDIUM-risk cases, and a broad LOW-risk comparison group. Run it after `schema.sql`, then rerun the risk engine. It deliberately begins with `TRUNCATE`, so do not use it against production/student data.
