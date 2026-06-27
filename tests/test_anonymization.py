import json
import unittest
from pathlib import Path


class TestMatchAnonymization(unittest.TestCase):

    def test_match_payload_omits_contato_pos_aprovacao(self):
        repo_root = Path(__file__).resolve().parents[1]
        match = json.loads((repo_root / "mocks" / "match_payload.json").read_text(encoding="utf-8"))
        self.assertIsInstance(match.get("candidatos"), list)
        self.assertEqual(len(match["candidatos"]), 8)
        self.assertFalse(any("contato_pos_aprovacao" in candidate for candidate in match["candidatos"]))

    def test_all_shortlist_fields_are_public(self):
        repo_root = Path(__file__).resolve().parents[1]
        match = json.loads((repo_root / "mocks" / "match_payload.json").read_text(encoding="utf-8"))
        for candidate in match["candidatos"]:
            self.assertNotIn("nome", candidate)
            self.assertNotIn("email", candidate)
            self.assertNotIn("telefone", candidate)
            self.assertNotIn("linkedin", candidate)
            self.assertIn("apelido_exibicao", candidate)
            self.assertIn("score_match", candidate)
            self.assertIn("skills", candidate)


if __name__ == "__main__":
    unittest.main()
