import json
import math
import sys
import unicodedata
from pathlib import Path

SKILL_WEIGHT = 0.50
EXPERIENCE_WEIGHT = 0.25
WORK_MODEL_WEIGHT = 0.15
DIVERSITY_WEIGHT = 0.10
MAX_EXPERIENCE_YEARS = 5
MIN_EXPERIENCE = 1


def norm(value: str | None) -> str:
    if value is None:
        return ""
    normalized = unicodedata.normalize("NFD", value)
    no_marks = "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")
    return no_marks.strip().lower()


def normalize_skills(skills):
    if not skills:
        return set()
    return {norm(s) for s in skills if s and str(s).strip()}


def calcular_skill_score(candidate_skills, vaga_skills):
    norm_vaga = normalize_skills(vaga_skills)
    if not norm_vaga:
        return 1.0
    norm_candidato = normalize_skills(candidate_skills)
    interseccao = sum(1 for s in norm_candidato if s in norm_vaga)
    return min(1.0, interseccao / len(norm_vaga))


def calcular_exp_score(anos_experiencia, min_experiencia=MIN_EXPERIENCE):
    anos = anos_experiencia or 0
    if anos <= 0:
        return 0.0
    min_efetivo = max(min_experiencia, 1)
    return min(1.0, anos / max(min_efetivo, MAX_EXPERIENCE_YEARS))


def calcular_modelo_score(modelo_candidato, modelo_vaga):
    c = norm(modelo_candidato)
    v = norm(modelo_vaga)
    if not c or not v:
        return 0.5
    if c == v:
        return 1.0
    if c == "hibrido" or v == "hibrido":
        return 0.85
    if c == "remoto" and v == "presencial":
        return 0.75
    if c == "presencial" and v == "remoto":
        return 0.65
    return 0.75


def calcular_diversidade(badge):
    return 1.0 if badge and str(badge).strip() else 0.0


def recalcular_score(candidate, vaga):
    raw = (
        calcular_skill_score(candidate.get("skills"), vaga.get("skills")) * SKILL_WEIGHT
        + calcular_exp_score(candidate.get("anos_experiencia")) * EXPERIENCE_WEIGHT
        + calcular_modelo_score(candidate.get("modelo_trabalho_preferido"), vaga.get("modelo_trabalho"))
        * WORK_MODEL_WEIGHT
        + calcular_diversidade(candidate.get("badge_diversidade")) * DIVERSITY_WEIGHT
    )
    return round(max(0.0, min(100.0, raw * 100)))


def atende_filtros(candidate, request):
    vaga = request.get("vaga") or {}

    nivel = vaga.get("nivel")
    if nivel and norm(candidate.get("nivel")) != norm(nivel):
        return False

    regiao = vaga.get("regiao")
    if regiao and norm(regiao) not in norm(candidate.get("regiao")):
        return False

    skills_vaga = vaga.get("skills") or []
    if not skills_vaga:
        return True

    skills_candidato = normalize_skills(candidate.get("skills"))
    return any(norm(s) in skills_candidato for s in skills_vaga)


def limite(request, total):
    filtros = request.get("filtros") or {}
    limite_resultados = filtros.get("limite_resultados")
    if limite_resultados is None:
        return total
    return max(0, min(limite_resultados, total))


def python_match(source_candidates, request):
    filtered = []
    for candidate in source_candidates:
        if atende_filtros(candidate, request):
            candidate_copy = dict(candidate)
            candidate_copy["score_match"] = recalcular_score(candidate, request.get("vaga") or {})
            filtered.append(candidate_copy)

    filtered.sort(key=lambda c: c.get("score_match", 0), reverse=True)
    filtered = filtered[: limite(request, len(source_candidates))]

    return {
        "total_analisados": len(source_candidates),
        "total_retorno": len(filtered),
        "candidatos": filtered,
    }


def assert_equal(java_response, py_response, scenario_name):
    failures = []

    if java_response.get("total_analisados") != py_response.get("total_analisados"):
        failures.append(
            f"[{scenario_name}] total_analisados difere: java={java_response.get('total_analisados')} "
            f"python={py_response.get('total_analisados')}"
        )

    if java_response.get("total_retorno") != py_response.get("total_retorno"):
        failures.append(
            f"[{scenario_name}] total_retorno difere: java={java_response.get('total_retorno')} "
            f"python={py_response.get('total_retorno')}"
        )

    java_cands = java_response.get("candidatos", [])
    py_cands = py_response.get("candidatos", [])

    if len(java_cands) != len(py_cands):
        failures.append(
            f"[{scenario_name}] tamanho da shortlist difere: java={len(java_cands)} python={len(py_cands)}"
        )
        return failures

    for idx, (j, p) in enumerate(zip(java_cands, py_cands), start=1):
        j_id = j.get("candidato_id")
        p_id = p.get("candidato_id")
        if j_id != p_id:
            failures.append(
                f"[{scenario_name}] ordem divergiu na posicao {idx}: java={j_id} python={p_id}"
            )

        j_score = j.get("score_match")
        p_score = p.get("score_match")
        if j_score != p_score:
            failures.append(
                f"[{scenario_name}] score divergiu para {j_id}: java={j_score} python={p_score}"
            )

        if not (0 <= (j_score or 0) <= 100):
            failures.append(
                f"[{scenario_name}] score fora da faixa 0-100 para {j_id}: {j_score}"
            )

    return failures


def main():
    output_path = Path("target/parity/java_parity_output.json")
    if not output_path.exists():
        print(f"Arquivo nao encontrado: {output_path}")
        print("Execute primeiro: mvnw.cmd -Dtest=MatchingJavaPythonParityExportTest test")
        sys.exit(1)

    payload = json.loads(output_path.read_text(encoding="utf-8"))
    source_candidates = payload.get("source_candidates", [])
    scenarios = payload.get("scenarios", [])

    all_failures = []
    results = []

    for scenario in scenarios:
        name = scenario.get("name")
        request = scenario.get("request")
        java_response = scenario.get("java_response")

        py_response = python_match(source_candidates, request)
        failures = assert_equal(java_response, py_response, name)
        all_failures.extend(failures)

        results.append(
            {
                "scenario": name,
                "status": "PASS" if not failures else "FAIL",
                "java_total_retorno": java_response.get("total_retorno"),
                "python_total_retorno": py_response.get("total_retorno"),
                "top3_java": [c.get("candidato_id") for c in java_response.get("candidatos", [])[:3]],
                "top3_python": [c.get("candidato_id") for c in py_response.get("candidatos", [])[:3]],
            }
        )

    print(json.dumps({"results": results}, ensure_ascii=False, indent=2))

    if all_failures:
        print("\nDivergencias encontradas:")
        for failure in all_failures:
            print(f"- {failure}")
        sys.exit(2)

    print("\nParidade Java x Python confirmada em todos os cenarios.")


if __name__ == "__main__":
    main()
