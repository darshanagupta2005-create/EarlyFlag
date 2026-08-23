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
