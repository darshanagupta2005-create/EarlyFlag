"""Free-tier Render worker: seeds demo data and refreshes risk scores while awake."""
from __future__ import annotations

import os
import threading
import time
from pathlib import Path

from flask import Flask, jsonify
import psycopg2

import compute_risk
compute_risk.connection_config = lambda: {"dsn": os.environ["DATABASE_URL"]}
from compute_risk import compute_all

app = Flask(__name__)
state = {"ready": False, "seeded": False, "last_error": None, "last_count": 0}
INTERVAL_SECONDS = 6 * 60 * 60


def bootstrap_database() -> None:
    root = Path(__file__).resolve().parents[1]
    schema = (root / "database" / "schema.sql").read_text(encoding="utf-8")
    seed = (root / "database" / "seed_demo_data.sql").read_text(encoding="utf-8")
    with psycopg2.connect(os.environ["DATABASE_URL"]) as connection:
        with connection.cursor() as cursor:
            cursor.execute(schema)
            cursor.execute(seed)


def refresh_forever() -> None:
    while True:
        try:
            if not state["seeded"]:
                bootstrap_database()
                state["seeded"] = True
            results = compute_all()
            state.update(ready=True, last_error=None, last_count=len(results))
            time.sleep(INTERVAL_SECONDS)
        except Exception as exc:
            state.update(ready=False, last_error=str(exc))
            time.sleep(15)


@app.get("/")
@app.get("/health")
def health():
    return jsonify(state), 200 if state["ready"] else 503


threading.Thread(target=refresh_forever, daemon=True).start()
