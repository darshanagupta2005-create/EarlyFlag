#!/usr/bin/env python3
"""Compute explainable EarlyFlag risk scores directly in PostgreSQL.

Run from this directory with:
    python compute_risk.py

Connection settings default to the shared development database and may be
overridden with the standard DB_HOST, DB_PORT, DB_NAME, DB_USER and DB_PASSWORD
environment variables.
"""

from __future__ import annotations

import argparse
import os
import re
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, timedelta
from decimal import Decimal
from typing import Any, Iterable

import psycopg2
from psycopg2.extras import Json


WEIGHTS = {
    "attendance": Decimal("0.35"),
    "academic": Decimal("0.30"),
    "fees": Decimal("0.15"),
    "engagement": Decimal("0.20"),
}
REASON_THRESHOLD = 60
POSITIVE_ENGAGEMENT_FLAGS = {
    "achievement",
    "commendation",
    "good",
    "participation",
    "positive",
    "praise",
}


@dataclass(frozen=True)
class RiskResult:
    student_id: int
    score: Decimal
    level: str
    reason_codes: list[str]
    sub_scores: dict[str, int]


def clamp(value: Decimal | float | int) -> int:
    """Return a whole-number score constrained to the contract's 0-100 range."""
    return max(0, min(100, int(round(float(value)))))


def attendance_sub_score(records: Iterable[tuple[date, str]]) -> int:
    """Score a decline between the last 14 data days and the 14 before them.

    The most recent attendance date is used as the anchor rather than today's
    date so uploaded historical demo data is evaluated correctly.
    """
    rows = list(records)
    if not rows:
        return 0
    latest = max(row[0] for row in rows)
    recent_start = latest - timedelta(days=13)
    previous_start = latest - timedelta(days=27)
    previous_end = latest - timedelta(days=14)
    recent = [status for record_date, status in rows if recent_start <= record_date <= latest]
    previous = [status for record_date, status in rows if previous_start <= record_date <= previous_end]
    if not recent or not previous:
        return 0
    recent_rate = sum(status == "present" for status in recent) / len(recent) * 100
    previous_rate = sum(status == "present" for status in previous) / len(previous) * 100
    # A 25 percentage-point fall is maximum risk; no decline has no trend risk.
    return clamp(max(0, previous_rate - recent_rate) * 4)


def _term_key(term: str) -> tuple[int, int, str]:
    """Sort common labels (term1, term2, semester 1) before lexical fallback."""
    match = re.search(r"\d+", term)
    return (0, int(match.group())) if match else (1, 0, term.lower())


def academic_sub_score(records: Iterable[tuple[str, Decimal, Decimal]]) -> int:
    """Score the average percentage drop from the preceding term to latest."""
    by_term: dict[str, list[float]] = defaultdict(list)
    for term, score, max_score in records:
        if max_score and max_score > 0:
            by_term[term].append(float(score / max_score * 100))
    if len(by_term) < 2:
        return 0
    terms = sorted(by_term, key=_term_key)
    previous_average = sum(by_term[terms[-2]]) / len(by_term[terms[-2]])
    latest_average = sum(by_term[terms[-1]]) / len(by_term[terms[-1]])
    # A 30 percentage-point fall is maximum risk.
    return clamp(max(0, previous_average - latest_average) * (100 / 30))


def fees_sub_score(unpaid_due_dates: Iterable[date], as_of: date) -> int:
    """Use the most recently due unpaid fee; 50 overdue days reaches 100."""
    dates = list(unpaid_due_dates)
    if not dates:
        return 0
    most_recent_due = max(dates)
    return clamp(max(0, (as_of - most_recent_due).days) * 2)


def engagement_sub_score(records: Iterable[tuple[date, str]], as_of: date) -> int:
    """Score negative flags in the trailing 30 calendar days (25 points each)."""
    cutoff = as_of - timedelta(days=29)
    negative_count = sum(
        record_date >= cutoff and (flag_type or "").strip().lower() not in POSITIVE_ENGAGEMENT_FLAGS
        for record_date, flag_type in records
    )
    return clamp(negative_count * 25)


def level_for(score: Decimal) -> str:
    if score >= 70:
        return "HIGH"
    if score >= 40:
        return "MEDIUM"
    return "LOW"


def build_risk_result(
    student_id: int,
    attendance: Iterable[tuple[date, str]],
    marks: Iterable[tuple[str, Decimal, Decimal]],
    unpaid_fees: Iterable[date],
    engagement: Iterable[tuple[date, str]],
    as_of: date,
) -> RiskResult:
    sub_scores = {
        "attendance": attendance_sub_score(attendance),
        "academic": academic_sub_score(marks),
        "fees": fees_sub_score(unpaid_fees, as_of),
        "engagement": engagement_sub_score(engagement, as_of),
    }
    score = sum(Decimal(sub_scores[name]) * weight for name, weight in WEIGHTS.items())
    score = max(Decimal("0"), min(Decimal("100"), score)).quantize(Decimal("0.01"))
    reasons = []
    if sub_scores["attendance"] > REASON_THRESHOLD:
        reasons.append("Attendance declining")
    if sub_scores["academic"] > REASON_THRESHOLD:
        reasons.append("Grades dropping")
    if sub_scores["fees"] > REASON_THRESHOLD:
        reasons.append("Fees overdue")
    if sub_scores["engagement"] > REASON_THRESHOLD:
        reasons.append("Engagement concerns")
    return RiskResult(student_id, score, level_for(score), reasons, sub_scores)


def connection_config() -> dict[str, Any]:
    return {
        "host": os.getenv("DB_HOST", "localhost"),
        "port": os.getenv("DB_PORT", "5432"),
        "dbname": os.getenv("DB_NAME", "earlyflag_db"),
        "user": os.getenv("DB_USER", "earlyflag"),
        "password": os.getenv("DB_PASSWORD", "earlyflag123"),
    }


def fetch_by_student(cursor: Any, query: str) -> dict[int, list[tuple[Any, ...]]]:
    cursor.execute(query)
    grouped: dict[int, list[tuple[Any, ...]]] = defaultdict(list)
    for row in cursor.fetchall():
        grouped[row[0]].append(tuple(row[1:]))
    return grouped


def compute_all(as_of: date | None = None) -> list[RiskResult]:
    as_of = as_of or date.today()
    with psycopg2.connect(**connection_config()) as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM students ORDER BY id")
            student_ids = [row[0] for row in cursor.fetchall()]
            attendance = fetch_by_student(cursor, "SELECT student_id, date, status FROM attendance")
            marks = fetch_by_student(cursor, "SELECT student_id, term, score, max_score FROM marks")
            unpaid_fees = fetch_by_student(
                cursor, "SELECT student_id, due_date FROM fees WHERE paid_status = 'unpaid'"
            )
            engagement = fetch_by_student(cursor, "SELECT student_id, date, flag_type FROM engagement")
            results = [
                build_risk_result(
                    student_id,
                    attendance.get(student_id, []),
                    marks.get(student_id, []),
                    [row[0] for row in unpaid_fees.get(student_id, [])],
                    engagement.get(student_id, []),
                    as_of,
                )
                for student_id in student_ids
            ]

            # risk_scores is a current snapshot: each successful run replaces the
            # previous one so the API's "latest risk" view stays unambiguous.
            cursor.execute("DELETE FROM risk_scores")
            cursor.executemany(
                """
                INSERT INTO risk_scores (student_id, score, level, reason_codes, sub_scores)
                VALUES (%s, %s, %s, %s, %s)
                """,
                [
                    (result.student_id, result.score, result.level, Json(result.reason_codes), Json(result.sub_scores))
                    for result in results
                ],
            )
        # Context manager commits only after the complete read/compute/write succeeds.
    return results


def main() -> None:
    parser = argparse.ArgumentParser(description="Compute the current EarlyFlag risk-score snapshot.")
    parser.add_argument(
        "--as-of",
        type=date.fromisoformat,
        metavar="YYYY-MM-DD",
        help="Override today's date; use 2026-08-20 for the included demo dataset.",
    )
    args = parser.parse_args()
    results = compute_all(args.as_of)
    counts = {level: sum(result.level == level for result in results) for level in ("LOW", "MEDIUM", "HIGH")}
    print(f"Computed {len(results)} risk scores: LOW={counts['LOW']}, MEDIUM={counts['MEDIUM']}, HIGH={counts['HIGH']}")


if __name__ == "__main__":
    main()
