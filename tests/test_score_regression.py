import json
import unittest
from pathlib import Path
from unittest.mock import patch

import scripts.gera_shortlist_mvp as gen
from scripts.score_match import ScoreConfig, ScoreProfile, compute_scores


class TestScoreRegression(unittest.TestCase):

    def test_match_payload_uses_computed_scores(self):
        """Gera a shortlist a partir do mock e garante que os scores são recalculados."""
        repo_root = Path(gen.ROOT)
        src = repo_root / "mocks" / "candidatos_teste.json"
        data = json.loads(src.read_text(encoding="utf-8"))

        tmp_dir = Path(".").resolve() / "tests" / "tmp_score_test"
        tmp_dir.mkdir(parents=True, exist_ok=True)
        tmp_input = tmp_dir / "candidatos_teste.json"
        tmp_output = tmp_dir / "match_payload.json"
        tmp_powerbi = tmp_dir / "shortlist.csv"
        tmp_input.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")

        with patch.object(gen, "INPUT", tmp_input), \
             patch.object(gen, "OUTPUT_MATCH", tmp_output), \
             patch.object(gen, "OUTPUT_POWERBI", tmp_powerbi):
            gen.main()

        out = json.loads(tmp_output.read_text(encoding="utf-8"))
        computed = compute_scores(
            data["candidatos"],
            ScoreProfile(required_skills=("sql", "python", "power bi"), preferred_work_model="hibrido", min_experience_years=1),
            ScoreConfig(),
        )
        expected_scores = {c["candidato_id"]: c["score_match"] for c in computed}
        out_scores = {c["candidato_id"]: c["score_match"] for c in out["candidatos"]}

        self.assertEqual(expected_scores, out_scores)
