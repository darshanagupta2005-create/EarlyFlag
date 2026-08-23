[README.md](https://github.com/user-attachments/files/31349053/README.md)
<div align="center">

# 🚩 EarlyFlag

### An explainable early-warning dashboard that helps teachers spot at-risk students before it's too late.

[![Backend](https://img.shields.io/badge/backend-Spring%20Boot%203-6DB33F?logo=springboot&logoColor=white)](./backend)
[![Frontend](https://img.shields.io/badge/frontend-React%2019%20%2B%20TypeScript-61DAFB?logo=react&logoColor=white)](./frontend)
[![Risk Engine](https://img.shields.io/badge/risk%20engine-Python-3776AB?logo=python&logoColor=white)](./risk_engine)
[![Database](https://img.shields.io/badge/database-PostgreSQL%2016-4169E1?logo=postgresql&logoColor=white)](./database)
[![Deploy](https://img.shields.io/badge/deploy-Render-46E3B7?logo=render&logoColor=white)](./render.yaml)
[![License](https://img.shields.io/badge/license-unspecified-lightgrey)](#license)

</div>

---

EarlyFlag fuses attendance, academic marks, fee-payment history, and behavioral engagement notes into one transparent, reason-coded **risk score** per student — so a teacher gets a same-day, trustworthy signal instead of a pattern only visible in hindsight.

Instead of a black-box classifier, EarlyFlag uses an **explainable, weighted rule-based model**: every flag ships with the exact reason behind it, so a teacher can see it, challenge it, and act on it with confidence.

## Table of Contents

- [Why EarlyFlag](#why-earlyflag)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [The Risk Model](#the-risk-model)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Roadmap / Known Limitations](#roadmap--known-limitations)
- [Contributing](#contributing)
- [License](#license)

---

## Why EarlyFlag

Attendance registers, gradebooks, fee ledgers, and behavior notes usually live in separate systems, so the pattern that predicts a student is struggling only becomes obvious in hindsight — after they've already fallen behind. EarlyFlag connects all four signals continuously and explains **why** a student is flagged in plain language, not just a score, so a teacher can act on it and defend it to a parent or principal.

## Features

| | |
|---|---|
| 📊 **Class-wide dashboard** | LOW / MEDIUM / HIGH risk breakdown with attendance, academic, and risk-distribution charts |
| 👤 **Per-student detail view** | Full attendance / marks / fees / engagement history plus a sub-score breakdown |
| 🏷️ **Plain-language reason codes** | Every flag ships with *why* — e.g. `Attendance declining`, `Fees overdue` |
| 📁 **Bulk CSV upload** | Attendance, marks, fees, and engagement import in the format schools already keep |
| ✅ **Intervention logging** | Record the action taken for a flagged student and track its outcome |
| 🔔 **Risk-alerts feed** | Surfaces newly flagged students so nothing slips through |
| 🧪 **Offline mock-data mode** | Explore the full UI with zero backend setup |

## Architecture

EarlyFlag is three independently deployable services sharing one PostgreSQL schema (the "integration contract"):

```
┌──────────────────────┐   REST/JSON   ┌────────────────────────┐   JDBC   ┌───────────────────────────┐
│   Frontend (SPA)      │◄─────────────►│   Backend API           │◄────────►│   PostgreSQL                │
│   React + TypeScript  │               │   Spring Boot (Java)    │          │   students · attendance      │
│   Vite                │               │   /api/students, /upload│          │   marks · fees · engagement  │
└──────────────────────┘               └────────────────────────┘          │   risk_scores · interventions │
                                                                             └───────────────────────────┘
┌──────────────────────┐   direct SQL read/write                                     ▲
│   Risk Engine          │───────────────────────────────────────────────────────────┘
│   Python (batch job +   │
│   Flask keep-alive)      │
└──────────────────────┘
```

- **Frontend** renders the dashboard and calls the backend over REST.
- **Backend API** owns all HTTP traffic: student data, CSV ingestion, interventions.
- **Risk Engine** reads the raw tables directly and rewrites `risk_scores` — it never calls the backend API, keeping scoring logic independently testable and deployable.
- **Database** is the single shared schema all three services read/write against.

Because the engine writes into the same table the API reads from, dashboard loads stay fast regardless of a student's history length, and the scoring logic can be re-run or replaced without touching the API or UI.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Lucide icons |
| **Backend API** | Java 17, Spring Boot 3 (Web + Data JPA), OpenCSV |
| **Risk Engine** | Python, `psycopg2`, Flask + Gunicorn (hosted worker) |
| **Database** | PostgreSQL 16 |
| **Local Dev** | Docker Compose |
| **Deployment** | Render (Docker web service, Python worker, static site, managed Postgres) |

## Project Structure

```
EarlyFlag/
├── frontend/          React + TypeScript SPA (Vite)
│   └── src/
│       ├── pages/       Dashboard, StudentList, StudentDetail, Reports, ...
│       ├── components/  Charts, Sidebar, Navbar, modals
│       ├── context/     Auth, Student, Notification, Theme contexts
│       └── services/    api.ts (backend client + mock-data fallback)
├── backend/           Spring Boot REST API
│   └── src/main/java/com/earlyflag/
│       ├── controller/  StudentController, CsvUploadController
│       ├── service/      StudentService, CsvUploadService, InterventionService
│       ├── entity/       JPA entities (Student, Attendance, Mark, Fee, ...)
│       ├── dto/          Response/request DTOs
│       └── config/       CORS configuration
├── risk_engine/       Explainable risk-scoring batch job
│   ├── compute_risk.py    Core scoring logic
│   ├── test_compute_risk.py
│   └── web.py              Flask wrapper for hosted deployment
├── database/          Shared schema + seed data
│   ├── schema.sql
│   ├── seed_demo_data.sql       15-student deterministic demo set
│   └── seed_50_students.sql     50-student dataset for scale testing
├── docs/              AI/ML approach notes, demo walkthrough guide
├── docker-compose.yml Local PostgreSQL for development
└── render.yaml         Multi-service deployment config
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) (for local PostgreSQL)
- Java 17+ and Maven
- Node.js 18+ and npm
- Python 3.10+

### Quick Start

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Load schema + demo data (PowerShell)
.\database\load_demo_data.ps1

# 3. Compute risk scores
cd risk_engine
python -m pip install -r requirements.txt
python compute_risk.py --as-of 2026-08-20

# 4. Start the backend  (new terminal, from repo root)
cd backend
./mvnw spring-boot:run          # → http://localhost:8080

# 5. Start the frontend  (new terminal, from repo root)
cd frontend
npm ci
npm run dev                     # → http://localhost:5173
```

<details>
<summary><strong>Step-by-step details</strong></summary>

**1. Database** — `docker compose up -d` starts PostgreSQL 16 on `localhost:5432` with database `earlyflag_db`, matching the local default credentials used throughout the project.

**2. Schema + demo data** — On non-Windows shells, run `database/schema.sql` followed by `database/seed_demo_data.sql` (or `seed_50_students.sql` for a larger dataset) against the running database manually instead of the PowerShell script.

**3. Risk engine** — Connects to `localhost:5432` / `earlyflag_db` by default. Override with `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` env vars. `--as-of` pins the reference date for deterministic demo scoring (fee-overdue math depends on it). Run its unit tests with `python -m unittest test_compute_risk.py`.

**4. Backend** — Connection settings and the allowed CORS origin (`app.cors.allowed-origins`) live in `backend/src/main/resources/application.properties`, all overridable via environment variables.

**5. Frontend** — Calls the backend at `http://localhost:8080/api` by default.

</details>

### Offline / Mock-Data Mode

The frontend can run fully self-contained against bundled mock data — no backend or database required. Toggle it via the `useMock` flag the app stores in `localStorage` (see `frontend/src/services/api.ts`), useful for UI development or demos without a live stack.

## The Risk Model

EarlyFlag intentionally uses an **explainable, weighted rule-based model** rather than a black-box classifier, so every score can be justified with the underlying data.

| Signal | Weight | Rule |
|---|---|---|
| **Attendance trend** | 35% | Recent 14-day present-rate vs. the prior 14 days; a 25-point fall maxes the sub-score |
| **Academic trend** | 30% | Latest term's average % vs. the previous term; a 30-point fall maxes the sub-score |
| **Fee delay** | 15% | Days overdue on the most recently due unpaid fee; 2 points/day, capped at 100 |
| **Engagement** | 20% | Non-positive behavior flags in the trailing 30 days; 25 points per flag, capped at 100 |

**Final score** = `attendance×0.35 + academic×0.30 + fees×0.15 + engagement×0.20`, mapped to **LOW** (0–39) / **MEDIUM** (40–69) / **HIGH** (70–100).

Whenever a sub-score exceeds 60, a human-readable reason code (`Attendance declining`, `Grades dropping`, `Fees overdue`, `Engagement concerns`) is attached. Students with missing history for a signal get a conservative low default for that signal rather than failing the run.

📄 See [`docs/ai_ml_approach.md`](docs/ai_ml_approach.md) and [`risk_engine/README.md`](risk_engine/README.md) for the full write-up, and [`docs/demo_hero_selection.md`](docs/demo_hero_selection.md) for a query to pick good demo students after scoring.

## API Reference

Base path: `/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/students` | List all students with summary info + latest risk score/level |
| `GET` | `/students/{id}` | Full student detail: trends, fees, engagement, detailed risk |
| `POST` | `/students/{id}/interventions` | Log a new intervention for a student |
| `GET` | `/students/{id}/interventions` | List a student's intervention history |
| `POST` | `/upload/attendance` | Bulk-import attendance via CSV |
| `POST` | `/upload/marks` | Bulk-import marks via CSV |
| `POST` | `/upload/fees` | Bulk-import fees via CSV |
| `POST` | `/upload/engagement` | Bulk-import engagement notes via CSV |

CSV uploads are capped at 10MB (`spring.servlet.multipart.max-file-size`). Errors return a consistent `{ "error": "..." }` JSON body via a centralized exception handler.

## Deployment

[`render.yaml`](render.yaml) defines a ready-to-go deployment on [Render](https://render.com):

| Service | Type | Role |
|---|---|---|
| `earlyflag-api` | Docker web service | Spring Boot backend |
| `earlyflag-risk-engine` | Python worker | Scoring engine behind a Flask health check, on a periodic refresh loop |
| `earlyflag-web` | Static site | Frontend build |
| `earlyflag-db` | Managed PostgreSQL | Shared database for all three services |

All service-to-service configuration (`DATABASE_URL`, CORS origin, API base URL) is wired through Render's env var and database-reference system — no secrets are hardcoded.

## Roadmap / Known Limitations

- [ ] **Authentication** — teacher login is currently a client-side demo flow; the API does not yet enforce authentication or authorization. Top priority before handling real student data.
- [ ] **Multi-tenancy** — the schema doesn't yet scope students/classes to a specific teacher or school.
- [ ] **Event-driven scoring** — the risk engine currently runs on demand or on a timer, rather than being triggered automatically by a data upload.
- [ ] **Audit trail** — interventions are logged, but there's no record of who created or changed an entry.
- [ ] **Parent/guardian view** — a simplified, read-only view of a student's status.

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you'd like to change. When contributing:

1. Fork the repo and create a feature branch.
2. Keep the shared database contract (`database/schema.sql`, and the `risk_scores` shape in particular) backward-compatible, or update all three services together.
3. Run the risk engine's unit tests (`python -m unittest test_compute_risk.py`) before submitting changes to `risk_engine/`.

## License

No license file is currently included in this repository — add a `LICENSE` file (e.g. MIT, Apache-2.0) to specify usage terms before distributing or open-sourcing.

---

<div align="center">

Built to help teachers see the whole picture — before it's too late.

</div>
