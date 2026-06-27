import json
import unittest
from pathlib import Path
from unittest.mock import patch

import scripts.gera_shortlist_mvp as gen


class TestScoreRegression(unittest.TestCase):

    def test_scores_are_transported(self):
        """Gera a shortlist a partir do mock e garante que os score_match são preservados."""
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
        in_scores = {c["candidato_id"]: c["score_match"] for c in data["candidatos"]}
        out_scores = {c["candidato_id"]: c["score_match"] for c in out["candidatos"]}

        self.assertEqual(in_scores, out_scores)
