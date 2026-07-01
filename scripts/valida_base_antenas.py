#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script de Validação - Base de Antenas e Sinal
Cobre as tarefas 1, 2 e 3 do arquivo docs/entrega-para-andre.md:
  1. Validar a estrutura da base antenas_sinal_tratadas.csv
  2. Conferir se as colunas estão coerentes com o dicionário de dados
  3. Verificar se latitude e longitude estão preenchidas e em faixa plausível
"""

from __future__ import annotations

import csv
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "processed" / "antenas_sinal_tratadas.csv"
REPORT_PATH = ROOT / "docs" / "relatorio-validacao-entrega-andre.md"

# ──────────────────────────────────────────────
# Colunas esperadas (conforme dicionario-antenas-sinal.md)
# ──────────────────────────────────────────────
COLUNAS_ESPERADAS = [
    "ecgi",
    "cluster",
    "municipio",
    "lat",
    "lon",
    "sessoes_3g",
    "sessoes_4g",
    "sessoes_5g",
    "sessoes_outros",
    "tecnologia_predominante",
]

# Faixa plausível para a Região Metropolitana de Florianópolis
LAT_MIN, LAT_MAX = -28.5, -26.5
LON_MIN, LON_MAX = -49.5, -47.5
TECNOLOGIAS_VALIDAS = {"3G", "4G", "5G", "OUTROS", "SEM_DADO"}


def validar_estrutura(rows: list[dict]) -> dict:
    """Tarefa 1: valida estrutura geral da base."""
    resultado = {
        "total_linhas": len(rows),
        "colunas_presentes": list(rows[0].keys()) if rows else [],
        "linhas_vazias": 0,
        "ecgis_duplicados": [],
    }

    ecgis_vistos: set[str] = set()
    ecgis_dup: list[str] = []

    for row in rows:
        if all(v.strip() == "" for v in row.values()):
            resultado["linhas_vazias"] += 1
        ecgi = row.get("ecgi", "")
        if ecgi in ecgis_vistos:
            ecgis_dup.append(ecgi)
        ecgis_vistos.add(ecgi)

    resultado["ecgis_duplicados"] = ecgis_dup
    return resultado


def validar_colunas(colunas_presentes: list[str]) -> dict:
    """Tarefa 2: verifica coerência das colunas com o dicionário de dados."""
    presentes = set(colunas_presentes)
    esperadas = set(COLUNAS_ESPERADAS)

    return {
        "colunas_esperadas": COLUNAS_ESPERADAS,
        "colunas_no_arquivo": colunas_presentes,
        "colunas_ausentes": sorted(esperadas - presentes),
        "colunas_extras": sorted(presentes - esperadas),
        "ordem_correta": colunas_presentes == COLUNAS_ESPERADAS,
    }


def validar_coordenadas(rows: list[dict]) -> dict:
    """Tarefa 3: verifica se lat/lon estão preenchidas e em faixa plausível."""
    lat_vazias = []
    lon_vazias = []
    lat_fora_faixa = []
    lon_fora_faixa = []
    coordenadas_ok = 0

    for i, row in enumerate(rows, start=2):  # +2: 1 para header, 1 para base 1
        ecgi = row.get("ecgi", f"linha_{i}")
        lat_str = row.get("lat", "").strip()
        lon_str = row.get("lon", "").strip()

        if not lat_str:
            lat_vazias.append(ecgi)
        if not lon_str:
            lon_vazias.append(ecgi)

        try:
            lat = float(lat_str)
            if not (LAT_MIN <= lat <= LAT_MAX):
                lat_fora_faixa.append({"ecgi": ecgi, "lat": lat})
        except ValueError:
            lat_fora_faixa.append({"ecgi": ecgi, "lat": lat_str, "erro": "nao_numerico"})

        try:
            lon = float(lon_str)
            if not (LON_MIN <= lon <= LON_MAX):
                lon_fora_faixa.append({"ecgi": ecgi, "lon": lon})
        except ValueError:
            lon_fora_faixa.append({"ecgi": ecgi, "lon": lon_str, "erro": "nao_numerico"})

        if (
            lat_str and lon_str
            and not any(e.get("ecgi") == ecgi for e in lat_fora_faixa)
            and not any(e.get("ecgi") == ecgi for e in lon_fora_faixa)
        ):
            coordenadas_ok += 1

    return {
        "faixa_lat_esperada": f"[{LAT_MIN}, {LAT_MAX}]",
        "faixa_lon_esperada": f"[{LON_MIN}, {LON_MAX}]",
        "lat_vazias": lat_vazias,
        "lon_vazias": lon_vazias,
        "lat_fora_faixa": lat_fora_faixa,
        "lon_fora_faixa": lon_fora_faixa,
        "registros_com_coordenadas_ok": coordenadas_ok,
    }


def validar_valores(rows: list[dict]) -> dict:
    """Validação complementar: tecnologia, sessões e municípios."""
    tecnologias_encontradas: set[str] = set()
    tecnologias_invalidas = []
    sessoes_negativas = []
    municipios: set[str] = set()
    clusters: set[str] = set()

    for row in rows:
        tech = row.get("tecnologia_predominante", "").strip()
        tecnologias_encontradas.add(tech)
        if tech not in TECNOLOGIAS_VALIDAS:
            tecnologias_invalidas.append({"ecgi": row.get("ecgi"), "tech": tech})

        for campo in ("sessoes_3g", "sessoes_4g", "sessoes_5g", "sessoes_outros"):
            try:
                val = int(float(row.get(campo, 0)))
                if val < 0:
                    sessoes_negativas.append({"ecgi": row.get("ecgi"), "campo": campo, "valor": val})
            except ValueError:
                pass

        municipios.add(row.get("municipio", "").strip())
        clusters.add(row.get("cluster", "").strip())

    return {
        "tecnologias_encontradas": sorted(tecnologias_encontradas),
        "tecnologias_invalidas": tecnologias_invalidas,
        "sessoes_negativas": sessoes_negativas,
        "municipios": sorted(municipios),
        "total_municipios": len(municipios),
        "clusters": sorted(clusters),
        "total_clusters": len(clusters),
    }


def gerar_relatorio_markdown(
    estrutura: dict,
    colunas: dict,
    coordenadas: dict,
    valores: dict,
) -> str:
    """Gera o relatório de validação em Markdown."""

    def status(lista: list) -> str:
        return "✅ OK" if not lista else f"❌ {len(lista)} problema(s)"

    linhas = [
        "# Relatório de Validação — Base de Antenas e Sinal",
        "",
        "> Gerado automaticamente por `scripts/valida_base_antenas.py`",
        "> Referência: `docs/entrega-para-andre.md` — Tarefas 1, 2 e 3",
        "",
        "---",
        "",
        "## Tarefa 1 — Estrutura da base `antenas_sinal_tratadas.csv`",
        "",
        f"| Métrica | Valor |",
        f"|---|---|",
        f"| Total de linhas (registros) | {estrutura['total_linhas']} |",
        f"| Linhas completamente vazias | {estrutura['linhas_vazias']} |",
        f"| ECGIs duplicados | {len(estrutura['ecgis_duplicados'])} |",
        "",
    ]

    if estrutura["ecgis_duplicados"]:
        linhas.append("**ECGIs duplicados encontrados:**")
        for ecgi in estrutura["ecgis_duplicados"]:
            linhas.append(f"- `{ecgi}`")
        linhas.append("")
    else:
        linhas.append("Sem ECGIs duplicados. Base estruturalmente íntegra.")
        linhas.append("")

    linhas += [
        "---",
        "",
        "## Tarefa 2 — Coerência das colunas com o dicionário de dados",
        "",
        f"**Status:** {status(colunas['colunas_ausentes'] + colunas['colunas_extras'])}",
        "",
        "### Colunas esperadas (dicionário-antenas-sinal.md)",
        "",
    ]
    for col in colunas["colunas_esperadas"]:
        marca = "✅" if col in colunas["colunas_no_arquivo"] else "❌"
        linhas.append(f"- {marca} `{col}`")

    linhas.append("")
    if colunas["colunas_ausentes"]:
        linhas.append("### Colunas ausentes no arquivo:")
        for col in colunas["colunas_ausentes"]:
            linhas.append(f"- ❌ `{col}`")
        linhas.append("")

    if colunas["colunas_extras"]:
        linhas.append("### Colunas extras (não previstas no dicionário):")
        for col in colunas["colunas_extras"]:
            linhas.append(f"- ⚠️ `{col}`")
        linhas.append("")

    ordem_status = "✅ Sim" if colunas["ordem_correta"] else "⚠️ Não"
    linhas.append(f"**Ordem das colunas igual ao dicionário:** {ordem_status}")
    linhas.append("")

    linhas += [
        "---",
        "",
        "## Tarefa 3 — Latitude e Longitude",
        "",
        f"| Verificação | Resultado |",
        f"|---|---|",
        f"| Faixa esperada de latitude | `{coordenadas['faixa_lat_esperada']}` |",
        f"| Faixa esperada de longitude | `{coordenadas['faixa_lon_esperada']}` |",
        f"| Registros com coordenadas válidas | **{coordenadas['registros_com_coordenadas_ok']}** / {estrutura['total_linhas']} |",
        f"| Latitudes vazias | {status(coordenadas['lat_vazias'])} |",
        f"| Longitudes vazias | {status(coordenadas['lon_vazias'])} |",
        f"| Latitudes fora da faixa | {status(coordenadas['lat_fora_faixa'])} |",
        f"| Longitudes fora da faixa | {status(coordenadas['lon_fora_faixa'])} |",
        "",
    ]

    if coordenadas["lat_fora_faixa"] or coordenadas["lon_fora_faixa"]:
        linhas.append("**Detalhes dos problemas de coordenadas:**")
        for item in coordenadas["lat_fora_faixa"]:
            linhas.append(f"- ❌ Lat fora da faixa: ECGI `{item['ecgi']}` → `{item.get('lat')}`")
        for item in coordenadas["lon_fora_faixa"]:
            linhas.append(f"- ❌ Lon fora da faixa: ECGI `{item['ecgi']}` → `{item.get('lon')}`")
        linhas.append("")

    linhas += [
        "---",
        "",
        "## Validações complementares",
        "",
        "### Municípios mapeados",
        "",
        f"Total: **{valores['total_municipios']}** município(s)",
        "",
    ]
    for m in valores["municipios"]:
        linhas.append(f"- {m}")

    linhas += [
        "",
        f"### Clusters mapeados",
        "",
        f"Total: **{valores['total_clusters']}** cluster(s)",
        "",
    ]
    for c in valores["clusters"]:
        linhas.append(f"- `{c}`")

    linhas += [
        "",
        "### Tecnologias encontradas",
        "",
        f"Valores encontrados: {', '.join(f'`{t}`' for t in valores['tecnologias_encontradas'])}",
        "",
    ]

    if valores["tecnologias_invalidas"]:
        linhas.append("**Tecnologias fora do domínio esperado:**")
        for item in valores["tecnologias_invalidas"]:
            linhas.append(f"- ❌ ECGI `{item['ecgi']}` → `{item['tech']}`")
    else:
        linhas.append("✅ Todas as tecnologias estão dentro do domínio esperado.")

    if valores["sessoes_negativas"]:
        linhas.append("")
        linhas.append("**Sessões com valor negativo:**")
        for item in valores["sessoes_negativas"]:
            linhas.append(f"- ❌ ECGI `{item['ecgi']}` | `{item['campo']}` = `{item['valor']}`")
    else:
        linhas.append("")
        linhas.append("✅ Sem valores negativos nos campos de sessões.")

    linhas += [
        "",
        "---",
        "",
        "## Critério de aceite (entrega-para-andre.md)",
        "",
        "| Critério | Status |",
        "|---|---|",
        f"| Base tratada validada | {'✅' if not estrutura['ecgis_duplicados'] and not estrutura['linhas_vazias'] else '⚠️'} |",
        f"| Dicionário coerente com o arquivo | {'✅' if not colunas['colunas_ausentes'] and not colunas['colunas_extras'] else '⚠️'} |",
        f"| Lat/lon preenchidas e em faixa plausível | {'✅' if not coordenadas['lat_vazias'] and not coordenadas['lon_vazias'] and not coordenadas['lat_fora_faixa'] and not coordenadas['lon_fora_faixa'] else '❌'} |",
        f"| Tecnologias válidas | {'✅' if not valores['tecnologias_invalidas'] else '❌'} |",
        f"| Sem sessões negativas | {'✅' if not valores['sessoes_negativas'] else '❌'} |",
        "",
    ]

    return "\n".join(linhas)


def main() -> None:
    if not CSV_PATH.exists():
        print(f"ERRO: Arquivo não encontrado em {CSV_PATH}", file=sys.stderr)
        sys.exit(1)

    rows: list[dict] = []
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(dict(row))

    if not rows:
        print("ERRO: Arquivo CSV está vazio.", file=sys.stderr)
        sys.exit(1)

    print(f"Carregados {len(rows)} registros de {CSV_PATH.name}")

    estrutura = validar_estrutura(rows)
    colunas = validar_colunas(list(rows[0].keys()))
    coordenadas = validar_coordenadas(rows)
    valores = validar_valores(rows)

    relatorio = gerar_relatorio_markdown(estrutura, colunas, coordenadas, valores)

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(relatorio, encoding="utf-8")
    print(f"Relatorio gerado em: {REPORT_PATH}")

    # Resumo no console
    print()
    print("=== RESUMO DA VALIDACAO ===")
    print(f"  Total de registros      : {estrutura['total_linhas']}")
    print(f"  ECGIs duplicados        : {len(estrutura['ecgis_duplicados'])}")
    print(f"  Colunas ausentes        : {colunas['colunas_ausentes'] or 'nenhuma'}")
    print(f"  Colunas extras          : {colunas['colunas_extras'] or 'nenhuma'}")
    print(f"  Lat/lon com problemas   : {len(coordenadas['lat_fora_faixa']) + len(coordenadas['lon_fora_faixa'])}")
    print(f"  Municipios              : {valores['total_municipios']} ({', '.join(valores['municipios'])})")
    print(f"  Clusters                : {valores['total_clusters']}")
    print(f"  Tecnologias encontradas : {', '.join(valores['tecnologias_encontradas'])}")
    print(f"  Tecn. invalidas         : {len(valores['tecnologias_invalidas'])}")


if __name__ == "__main__":
    main()
