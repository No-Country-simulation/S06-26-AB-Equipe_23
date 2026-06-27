from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class ScoreConfig:
    skill_weight: float = 0.5
    experience_weight: float = 0.25
    work_model_weight: float = 0.15
    diversity_bonus_weight: float = 0.1
    max_experience_years: int = 5


@dataclass(frozen=True)
class ScoreProfile:
    required_skills: tuple[str, ...]
    preferred_work_model: str = "hibrido"
    min_experience_years: int = 1


def _normalize_skills(skills: Iterable[str]) -> set[str]:
    return {skill.strip().lower() for skill in skills if isinstance(skill, str) and skill.strip()}


def _skill_match(candidate_skills: Iterable[str], required_skills: Iterable[str]) -> float:
    candidate = _normalize_skills(candidate_skills)
    required = _normalize_skills(required_skills)
    if not required:
        return 1.0
    return min(1.0, len(candidate & required) / len(required))


def _experience_score(years: int, profile: ScoreProfile, config: ScoreConfig) -> float:
    if years <= 0:
        return 0.0
    minimum = max(profile.min_experience_years, 1)
    return min(1.0, years / max(minimum, config.max_experience_years))


def _work_model_score(candidate_model: str, preferred_model: str) -> float:
    candidate = (candidate_model or "").strip().lower()
    preferred = (preferred_model or "").strip().lower()
    if not candidate or not preferred:
        return 0.5
    if candidate == preferred:
        return 1.0
    if "hibrido" in (candidate, preferred):
        return 0.85
    if candidate == "remoto" and preferred == "presencial":
        return 0.75
    if candidate == "presencial" and preferred == "remoto":
        return 0.65
    return 0.75


def _diversity_score(candidate: dict) -> float:
    badge = candidate.get("badge_diversidade")
    return 1.0 if badge and isinstance(badge, str) and badge.strip() else 0.0


def compute_match_score(candidate: dict, profile: ScoreProfile, config: ScoreConfig | None = None) -> float:
    """Compute a normalized match score for a single candidate."""
    config = config or ScoreConfig()
    skill_score = _skill_match(candidate.get("skills", []), profile.required_skills)
    experience_years = 0
    try:
        experience_years = int(candidate.get("anos_experiencia", 0) or 0)
    except (TypeError, ValueError):
        experience_years = 0
    experience_score = _experience_score(experience_years, profile, config)
    work_model_score = _work_model_score(candidate.get("modelo_trabalho_preferido", ""), profile.preferred_work_model)
    diversity_score = _diversity_score(candidate)

    weighted = (
        skill_score * config.skill_weight
        + experience_score * config.experience_weight
        + work_model_score * config.work_model_weight
    )
    bonus = diversity_score * config.diversity_bonus_weight
    raw_score = weighted + bonus
    return max(0.0, min(100.0, round(raw_score * 100)))


def compute_scores(candidates: Iterable[dict], profile: ScoreProfile, config: ScoreConfig | None = None) -> list[dict]:
    """Return a new list of candidate dicts with computed `score_match`."""
    config = config or ScoreConfig()
    return [
        {
            **candidate,
            "score_match": compute_match_score(candidate, profile, config),
        }
        for candidate in candidates
    ]
