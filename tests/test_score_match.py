import json
import unittest
from pathlib import Path
from unittest.mock import patch

import scripts.gera_shortlist_mvp as gen
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

    def test_zero_skill_overlap_still_computes_other_dimensions(self):
        profile = ScoreProfile(
            required_skills=("spark", "hadoop"),
            preferred_work_model="hibrido",
            min_experience_years=1,
        )
        scored = compute_scores(self.candidates, profile, self.config)

        self.assertEqual(len(scored), 8)
        for candidate in scored:
            self.assertGreaterEqual(candidate["score_match"], 0)
            self.assertLessEqual(candidate["score_match"], 100)
            self.assertNotEqual(candidate["score_match"], 100)

        # If no candidate has the required skills, the score is driven by experience,
        # work model compatibility and diversity bonus only.
        self.assertTrue(all(candidate["score_match"] < 80 for candidate in scored))

    def test_gera_shortlist_uses_computed_scores(self):
        repo_root = Path(__file__).resolve().parents[1]
        data = json.loads((repo_root / "mocks" / "candidatos_teste.json").read_text(encoding="utf-8"))

        tmp_dir = repo_root / "tests" / "tmp_gera_shortlist"
        tmp_dir.mkdir(parents=True, exist_ok=True)
        tmp_input = tmp_dir / "candidatos_teste.json"
        tmp_output = tmp_dir / "match_payload.json"
        tmp_powerbi = tmp_dir / "shortlist.csv"
        tmp_input.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")

        with patch.object(gen, "INPUT", tmp_input), \
             patch.object(gen, "OUTPUT_MATCH", tmp_output), \
             patch.object(gen, "OUTPUT_POWERBI", tmp_powerbi):
            gen.main()

        computed = compute_scores(
            data["candidatos"],
            ScoreProfile(required_skills=("sql", "python", "power bi"), preferred_work_model="hibrido", min_experience_years=1),
            ScoreConfig(),
        )
        generated = json.loads(tmp_output.read_text(encoding="utf-8"))
        generated_scores = {c["candidato_id"]: c["score_match"] for c in generated["candidatos"]}
        expected_scores = {c["candidato_id"]: c["score_match"] for c in computed}

        self.assertEqual(generated_scores, expected_scores)


if __name__ == "__main__":
    unittest.main()
