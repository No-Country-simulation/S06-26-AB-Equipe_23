from __future__ import annotations

import csv
from collections import Counter
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "processed" / "insights_regioes_agregado.csv"
OUTPUT_HTML = ROOT / "exports" / "validacao_mapa_regioes.html"
OUTPUT_MD = ROOT / "reports" / "validacao-mapa-regioes.md"

CORES = {
    "alta": "#16a34a",
    "media": "#f59e0b",
    "baixa": "#ef4444",
    "alerta_exclusao_digital": "#7f1d1d",
    "sem_dado": "#6b7280",
}


def carregar_regioes() -> list[dict[str, str]]:
    if not INPUT.exists():
        raise FileNotFoundError(f"Base agregada nao encontrada: {INPUT}")

    with INPUT.open("r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def to_float(value: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def escala(valor: float, minimo: float, maximo: float, margem: int, tamanho: int) -> float:
    if maximo == minimo:
        return tamanho / 2
    return margem + ((valor - minimo) / (maximo - minimo)) * (tamanho - 2 * margem)


def gerar_html(rows: list[dict[str, str]]) -> str:
    width = 1100
    height = 760
    margin = 70
    lats = [to_float(row["lat_media"]) for row in rows]
    lons = [to_float(row["lon_media"]) for row in rows]
    lat_min, lat_max = min(lats), max(lats)
    lon_min, lon_max = min(lons), max(lons)

    pontos = []
    for row in rows:
        lat = to_float(row["lat_media"])
        lon = to_float(row["lon_media"])
        x = escala(lon, lon_min, lon_max, margin, width)
        y = height - escala(lat, lat_min, lat_max, margin, height)
        indicador = row["indicador_conectividade"]
        cor = CORES.get(indicador, "#6b7280")
        titulo = (
            f"{row['municipio']} / {row['cluster']} | "
            f"{indicador} | 3G {row['percentual_3g']}% | "
            f"4G {row['percentual_4g']}% | 5G {row['percentual_5g']}%"
        )
        tecnologia = escape(row["tecnologia_predominante_regiao"])
        municipio = escape(row["municipio"])
        cluster = escape(row["cluster"])
        indicador = escape(indicador)
        pontos.append(
            f'<g class="map-point" data-municipio="{municipio}" data-cluster="{cluster}" '
            f'data-indicador="{indicador}" data-tecnologia="{tecnologia}">'
            f'<circle cx="{x:.2f}" cy="{y:.2f}" r="8" fill="{cor}" stroke="#111827" stroke-width="1.5">'
            f"<title>{escape(titulo)}</title></circle>"
            f'<text x="{x + 11:.2f}" y="{y + 4:.2f}" font-size="10" fill="#111827">'
            f"{cluster}</text></g>"
        )

    contagem = Counter(row["indicador_conectividade"] for row in rows)
    legenda = "".join(
        f'<span class="legend-item"><span style="background:{cor}"></span>{nome}: {contagem.get(nome, 0)}</span>'
        for nome, cor in CORES.items()
    )

    linhas_tabela = "\n".join(
        f'<tr data-municipio="{escape(row["municipio"])}" data-cluster="{escape(row["cluster"])}" '
        f'data-indicador="{escape(row["indicador_conectividade"])}" '
        f'data-tecnologia="{escape(row["tecnologia_predominante_regiao"])}">'
        f"<td>{escape(row['municipio'])}</td>"
        f"<td>{escape(row['cluster'])}</td>"
        f"<td>{escape(row['lat_media'])}</td>"
        f"<td>{escape(row['lon_media'])}</td>"
        f"<td>{escape(row['indicador_conectividade'])}</td>"
        f"<td>{escape(row['percentual_4g'])}%</td>"
        f"<td>{escape(row['percentual_5g'])}%</td>"
        "</tr>"
        for row in rows
    )
    municipios = sorted({row["municipio"] for row in rows})
    tecnologias = sorted({row["tecnologia_predominante_regiao"] for row in rows})
    indicadores = ["alta", "media", "baixa", "alerta_exclusao_digital", "sem_dado"]
    opcoes_municipio = "".join(f'<option value="{escape(item)}">{escape(item)}</option>' for item in municipios)
    opcoes_tecnologia = "".join(f'<option value="{escape(item)}">{escape(item)}</option>' for item in tecnologias)
    indicadores_checkboxes = "".join(
        f'<label><input type="checkbox" name="indicador" value="{escape(item)}" checked> {escape(item)}</label>'
        for item in indicadores
    )

    return f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Validacao Mapa Regioes - App BiT</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 24px; color: #111827; background: #f8fafc; }}
    h1 {{ margin-bottom: 4px; }}
    .summary {{ display: flex; gap: 16px; flex-wrap: wrap; margin: 18px 0; }}
    .card {{ background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; }}
    .filters {{ display: grid; grid-template-columns: repeat(4, minmax(170px, 1fr)); gap: 12px; margin: 18px 0; max-width: {width}px; }}
    .filter-card {{ background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }}
    .filter-card label, .filter-card span {{ display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px; }}
    select, input[type="search"] {{ width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; }}
    .checks {{ display: flex; flex-direction: column; gap: 4px; }}
    .checks label {{ display: flex; align-items: center; gap: 6px; font-weight: 400; margin: 0; }}
    button {{ border: 1px solid #111827; background: #111827; color: #fff; border-radius: 6px; padding: 9px 12px; cursor: pointer; }}
    .legend {{ display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 16px; }}
    .legend-item {{ display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }}
    .legend-item span {{ width: 12px; height: 12px; display: inline-block; border-radius: 50%; }}
    svg {{ background: #fff; border: 1px solid #d1d5db; border-radius: 8px; width: 100%; max-width: {width}px; height: auto; }}
    table {{ border-collapse: collapse; margin-top: 20px; width: 100%; background: #fff; }}
    th, td {{ border: 1px solid #e5e7eb; padding: 8px; font-size: 13px; text-align: left; }}
    th {{ background: #f3f4f6; }}
    .hidden {{ display: none; }}
    @media (max-width: 900px) {{ .filters {{ grid-template-columns: 1fr; }} }}
  </style>
</head>
<body>
  <h1>Validacao grafica das regioes</h1>
  <p>Arquivo gerado a partir de <code>data/processed/insights_regioes_agregado.csv</code>.</p>
  <div class="summary">
    <div class="card"><strong>Regioes:</strong> {len(rows)}</div>
    <div class="card"><strong>Municipios:</strong> {len(set(row['municipio'] for row in rows))}</div>
    <div class="card"><strong>Lat:</strong> {lat_min:.6f} a {lat_max:.6f}</div>
    <div class="card"><strong>Lon:</strong> {lon_min:.6f} a {lon_max:.6f}</div>
    <div class="card"><strong>Pontos visiveis:</strong> <span id="visible-count">{len(rows)}</span></div>
  </div>
  <div class="filters" aria-label="Filtros do mapa">
    <div class="filter-card">
      <label for="municipio-filter">Municipio</label>
      <select id="municipio-filter">
        <option value="">Todos</option>
        {opcoes_municipio}
      </select>
    </div>
    <div class="filter-card">
      <label for="tecnologia-filter">Tecnologia predominante</label>
      <select id="tecnologia-filter">
        <option value="">Todas</option>
        {opcoes_tecnologia}
      </select>
    </div>
    <div class="filter-card">
      <label for="cluster-filter">Buscar cluster</label>
      <input id="cluster-filter" type="search" placeholder="Ex: TRINDADE">
    </div>
    <div class="filter-card">
      <span>Indicador</span>
      <div class="checks">{indicadores_checkboxes}</div>
    </div>
  </div>
  <button id="clear-filters" type="button">Limpar filtros</button>
  <div class="legend">{legenda}</div>
  <svg viewBox="0 0 {width} {height}" role="img" aria-label="Distribuicao das 24 regioes por coordenadas medias">
    <rect x="40" y="40" width="{width - 80}" height="{height - 80}" fill="#f9fafb" stroke="#e5e7eb" />
    {"".join(pontos)}
  </svg>
  <table>
    <thead>
      <tr>
        <th>Municipio</th><th>Cluster</th><th>Lat media</th><th>Lon media</th>
        <th>Indicador</th><th>4G</th><th>5G</th>
      </tr>
    </thead>
    <tbody>{linhas_tabela}</tbody>
  </table>
  <script>
    const municipioFilter = document.querySelector('#municipio-filter');
    const tecnologiaFilter = document.querySelector('#tecnologia-filter');
    const clusterFilter = document.querySelector('#cluster-filter');
    const indicadorInputs = Array.from(document.querySelectorAll('input[name="indicador"]'));
    const clearButton = document.querySelector('#clear-filters');
    const visibleCount = document.querySelector('#visible-count');
    const points = Array.from(document.querySelectorAll('.map-point'));
    const tableRows = Array.from(document.querySelectorAll('tbody tr'));

    function selectedIndicators() {{
      return new Set(indicadorInputs.filter((input) => input.checked).map((input) => input.value));
    }}

    function matchesFilters(element) {{
      const municipio = municipioFilter.value;
      const tecnologia = tecnologiaFilter.value;
      const cluster = clusterFilter.value.trim().toLowerCase();
      const indicadores = selectedIndicators();

      if (municipio && element.dataset.municipio !== municipio) return false;
      if (tecnologia && element.dataset.tecnologia !== tecnologia) return false;
      if (cluster && !element.dataset.cluster.toLowerCase().includes(cluster)) return false;
      if (!indicadores.has(element.dataset.indicador)) return false;
      return true;
    }}

    function applyFilters() {{
      let count = 0;
      points.forEach((point) => {{
        const visible = matchesFilters(point);
        point.classList.toggle('hidden', !visible);
        if (visible) count += 1;
      }});
      tableRows.forEach((row) => row.classList.toggle('hidden', !matchesFilters(row)));
      visibleCount.textContent = String(count);
    }}

    [municipioFilter, tecnologiaFilter, clusterFilter, ...indicadorInputs].forEach((control) => {{
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }});

    clearButton.addEventListener('click', () => {{
      municipioFilter.value = '';
      tecnologiaFilter.value = '';
      clusterFilter.value = '';
      indicadorInputs.forEach((input) => input.checked = true);
      applyFilters();
    }});
  </script>
</body>
</html>
"""


def gerar_markdown(rows: list[dict[str, str]]) -> str:
    lats = [to_float(row["lat_media"]) for row in rows]
    lons = [to_float(row["lon_media"]) for row in rows]
    contagem = Counter(row["indicador_conectividade"] for row in rows)
    municipios = sorted({row["municipio"] for row in rows})

    linhas = [
        "# Validacao do Mapa de Regioes",
        "",
        "## Base validada",
        "",
        "- Arquivo: `data/processed/insights_regioes_agregado.csv`",
        f"- Total de regioes: {len(rows)}",
        f"- Municipios: {', '.join(municipios)}",
        f"- Latitude media: {min(lats):.6f} a {max(lats):.6f}",
        f"- Longitude media: {min(lons):.6f} a {max(lons):.6f}",
        "",
        "## Distribuicao dos indicadores",
        "",
    ]
    for indicador in ["alta", "media", "baixa", "alerta_exclusao_digital", "sem_dado"]:
        linhas.append(f"- `{indicador}`: {contagem.get(indicador, 0)}")

    linhas.extend(
        [
            "",
            "## Leitura analitica",
            "",
            "Todas as 24 regioes ficaram classificadas como `alta` no output atual.",
            "Isso ocorre porque a regra validada considera `5G >= 20%` ou `4G + 5G >= 75% com 4G >= 50%`, e todos os clusters atuais atendem a esse criterio.",
            "",
            "Com essa distribuicao, o mapa nao deve exibir diferenca de cores entre regioes no dataset atual.",
            "A legenda deve permanecer preparada para `media`, `baixa`, `alerta_exclusao_digital` e `sem_dado`, porque essas categorias podem aparecer com outra base ou com novas regioes.",
            "",
            "## Artefato visual local",
            "",
            "- Guia oficial Power BI: `docs/guia-power-bi-validacao-regioes.md`",
            "- HTML: `exports/validacao_mapa_regioes.html`",
            "",
            "O Power BI e a ferramenta principal para validacao grafica do projeto.",
            "O HTML e apenas uma previa local versionavel para conferencia rapida.",
            "",
            "## Tabela de conferencia",
            "",
            "| Municipio | Cluster | Lat media | Lon media | Indicador | 4G | 5G |",
            "|---|---|---:|---:|---|---:|---:|",
        ]
    )

    for row in rows:
        linhas.append(
            f"| {row['municipio']} | {row['cluster']} | {row['lat_media']} | {row['lon_media']} | "
            f"{row['indicador_conectividade']} | {row['percentual_4g']}% | {row['percentual_5g']}% |"
        )

    return "\n".join(linhas) + "\n"


def main() -> None:
    rows = carregar_regioes()
    OUTPUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_HTML.write_text(gerar_html(rows), encoding="utf-8")
    OUTPUT_MD.write_text(gerar_markdown(rows), encoding="utf-8")
    print(f"HTML gerado: {OUTPUT_HTML}")
    print(f"Relatorio gerado: {OUTPUT_MD}")
    print(f"Regioes validadas: {len(rows)}")


if __name__ == "__main__":
    main()
