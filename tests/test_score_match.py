import json
import unittest
from pathlib import Path

from scripts.score_match import ScoreConfig, ScoreProfile, compute_scores


class TestScoreMatch(unittest.TestCase):

    def setUp(self):
        repo_root = Path(__file__).resolve().parents[1]
        self.candidates = json.loads(
            (repo_root / "mocks" / "candidatos_teste.json").read_text(encoding="utf-8")
        )["candidatos"]
        self.profile = ScoreProfile(
            required_skills=("sql", "python", "power bi"),
            preferred_work_model="hibrido",
            min_experience_years=1,
        )
        self.config = ScoreConfig(
            skill_weight=0.5,
            experience_weight=0.25,
            work_model_weight=0.15,
            diversity_bonus_weight=0.1,
            max_experience_years=5,
        )

    def test_compute_scores_for_all_candidates(self):
        scored = compute_scores(self.candidates, self.profile, self.config)
        self.assertEqual(len(scored), 8)
        expected_scores = {
            "cand_001": 80,
            "cand_002": 61,
            "cand_003": 56,
            "cand_004": 68,
            "cand_005": 63,
            "cand_006": 49,
            "cand_007": 78,
            "cand_008": 58,
        }

        for candidate in scored:
            cid = candidate["candidato_id"]
            self.assertIn(cid, expected_scores)
            self.assertEqual(candidate["score_match"], expected_scores[cid])

    def test_scores_are_within_bounds(self):
        scored = compute_scores(self.candidates, self.profile, self.config)
        for candidate in scored:
            self.assertGreaterEqual(candidate["score_match"], 0)
            self.assertLessEqual(candidate["score_match"], 100)


if __name__ == "__main__":
    unittest.main()
