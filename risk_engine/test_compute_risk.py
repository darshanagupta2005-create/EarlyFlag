from datetime import date, timedelta
from decimal import Decimal
import unittest

from compute_risk import (
    academic_sub_score,
    attendance_sub_score,
    build_risk_result,
    engagement_sub_score,
    fees_sub_score,
    level_for,
)


class RiskScoringTests(unittest.TestCase):
    def test_clear_decline_becomes_high_and_explainable(self):
        anchor = date(2026, 8, 20)
        attendance = []
        for offset in range(28):
            record_date = anchor - timedelta(days=27 - offset)
            attendance.append((record_date, "present" if offset < 14 else "absent"))
        marks = [
            ("term1", Decimal("90"), Decimal("100")),
            ("term2", Decimal("50"), Decimal("100")),
        ]
        result = build_risk_result(
            1,
            attendance,
            marks,
            [anchor - timedelta(days=40)],
            [(anchor - timedelta(days=1), "disciplinary")] * 3,
            anchor,
        )
        self.assertEqual(result.level, "HIGH")
        self.assertIn("Attendance declining", result.reason_codes)
        self.assertIn("Grades dropping", result.reason_codes)
        self.assertIn("Fees overdue", result.reason_codes)
        self.assertIn("Engagement concerns", result.reason_codes)

    def test_missing_history_is_a_low_default(self):
        result = build_risk_result(2, [], [], [], [], date(2026, 8, 20))
        self.assertEqual(result.score, Decimal("0.00"))
        self.assertEqual(result.level, "LOW")
        self.assertEqual(result.reason_codes, [])

    def test_future_unpaid_fee_and_positive_flag_are_not_risks(self):
        today = date(2026, 8, 20)
        self.assertEqual(fees_sub_score([today + timedelta(days=2)], today), 0)
        self.assertEqual(engagement_sub_score([(today, "praise")], today), 0)

    def test_scores_are_zero_when_the_trend_is_improving(self):
        anchor = date(2026, 8, 20)
        attendance = [
            (anchor - timedelta(days=27 - offset), "absent" if offset < 14 else "present")
            for offset in range(28)
        ]
        marks = [
            ("term1", Decimal("55"), Decimal("100")),
            ("term2", Decimal("85"), Decimal("100")),
        ]
        self.assertEqual(attendance_sub_score(attendance), 0)
        self.assertEqual(academic_sub_score(marks), 0)

    def test_level_boundaries_match_the_contract(self):
        self.assertEqual(level_for(Decimal("39.99")), "LOW")
        self.assertEqual(level_for(Decimal("40")), "MEDIUM")
        self.assertEqual(level_for(Decimal("69.99")), "MEDIUM")
        self.assertEqual(level_for(Decimal("70")), "HIGH")


if __name__ == "__main__":
    unittest.main()
