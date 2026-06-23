from __future__ import annotations

import csv
from collections import Counter
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "processed" / "insights_regioes_agregado.csv"
OUTPUT_HTML = ROOT / "exports" / "validacao_mapa_regioes.html"
OUTPUT_MD = ROOT / "reports" / "validacao-mapa-regioes.md"
COLORS = {"3G": "#2563eb", "4G": "#16a34a", "5G": "#7c3aed", "OUTROS": "#f59e0b", "SEM_DADO": "#6b7280"}


def load_rows() -> list[dict[str, str]]:
    with INPUT.open("r", encoding="utf-8-sig", newline="") as file:
        rows = list(csv.DictReader(file))
    if not rows:
        raise RuntimeError(f"Base vazia: {INPUT}")
    return rows


def scale(value: float, minimum: float, maximum: float, margin: int, size: int) -> float:
    return size / 2 if maximum == minimum else margin + (value - minimum) / (maximum - minimum) * (size - 2 * margin)


def generate_html(rows: list[dict[str, str]]) -> str:
    width, height, margin = 1100, 760, 70
    lats = [float(row["lat_media"]) for row in rows]
    lons = [float(row["lon_media"]) for row in rows]
    points = []
    for row in rows:
        x = scale(float(row["lon_media"]), min(lons), max(lons), margin, width)
        y = height - scale(float(row["lat_media"]), min(lats), max(lats), margin, height)
        technology = row["tecnologia_predominante_regiao"]
        title = (
            f"{row['municipio']} / {row['cluster']} | predominante {technology} | "
            f"3G {row['percentual_3g']}% | 4G {row['percentual_4g']}% | 5G {row['percentual_5g']}%"
        )
        points.append(
            f'<circle cx="{x:.2f}" cy="{y:.2f}" r="8" fill="{COLORS.get(technology, COLORS["SEM_DADO"])}" '
            f'stroke="#111827"><title>{escape(title)}</title></circle>'
            f'<text x="{x + 11:.2f}" y="{y + 4:.2f}" font-size="10">{escape(row["cluster"])}</text>'
        )
    counts = Counter(row["tecnologia_predominante_regiao"] for row in rows)
    legend = "".join(
        f'<span><b style="color:{color}">●</b> {tech}: {counts.get(tech, 0)}</span>'
        for tech, color in COLORS.items()
    )
    table = "".join(
        "<tr>"
        f"<td>{escape(row['municipio'])}</td><td>{escape(row['cluster'])}</td>"
        f"<td>{escape(row['lat_media'])}</td><td>{escape(row['lon_media'])}</td>"
        f"<td>{escape(row['qtd_antenas'])}</td><td>{escape(row['tecnologia_predominante_regiao'])}</td>"
        f"<td>{escape(row.get('qualidade_sinal', 'sem_dado'))}</td>"
        f"<td>{escape(row['total_sessoes'])}</td></tr>"
        for row in rows
    )
    return f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Validação Vísent por região</title><style>
body{{font-family:Arial;margin:24px;color:#111827;background:#f8fafc}} .legend{{display:flex;gap:18px}}
svg,table{{background:white;border:1px solid #d1d5db}} table{{border-collapse:collapse;width:100%;margin-top:20px}}
th,td{{border:1px solid #e5e7eb;padding:7px;text-align:left}}
</style></head><body><h1>Regiões derivadas do Vísent</h1>
<p>Os pontos representam médias das coordenadas das antenas. A qualidade do sinal é calculada a partir da tecnologia predominante e do volume de sessões.</p>
<div class="legend">{legend}</div><svg viewBox="0 0 {width} {height}">{''.join(points)}</svg>
<table><thead><tr><th>Município</th><th>Cluster</th><th>Lat.</th><th>Lon.</th><th>Antenas</th><th>Tecnologia predominante</th><th>Qualidade do sinal</th><th>Sessões</th></tr></thead><tbody>{table}</tbody></table>
</body></html>"""


def generate_markdown(rows: list[dict[str, str]]) -> str:
    technologies = Counter(row["tecnologia_predominante_regiao"] for row in rows)
    lines = [
        "# Validação das regiões derivadas do Vísent",
        "",
        "- Fonte de antenas: `dataset-visent/referencias/antenas_flp.csv`",
        "- Fonte de sessões: `dataset-visent/tensores/tensor_mobilidade.csv`",
        f"- Regiões derivadas por município + cluster: {len(rows)}",
        "",
        "A tecnologia predominante é determinada pelo maior volume de sessões observado, e a qualidade do sinal é calculada conforme as regras aprovadas do painel de conectividade.",
        "",
        "## Tecnologias predominantes",
        "",
    ]
    lines.extend(f"- `{name}`: {count}" for name, count in sorted(technologies.items()))
    lines += ["", "| Município | Cluster | Antenas | Tecnologia | Qualidade | Sessões |", "|---|---|---:|---|---|---:|"]
    lines.extend(
        f"| {row['municipio']} | {row['cluster']} | {row['qtd_antenas']} | {row['tecnologia_predominante_regiao']} | {row.get('qualidade_sinal', 'sem_dado')} | {row['total_sessoes']} |"
        for row in rows
    )
    return "\n".join(lines) + "\n"


def main() -> None:
    rows = load_rows()
    OUTPUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_HTML.write_text(generate_html(rows), encoding="utf-8")
    OUTPUT_MD.write_text(generate_markdown(rows), encoding="utf-8")
    print(f"HTML gerado: {OUTPUT_HTML}")
    print(f"Relatório gerado: {OUTPUT_MD}")
    print(f"Regiões validadas: {len(rows)}")


if __name__ == "__main__":
    main()
