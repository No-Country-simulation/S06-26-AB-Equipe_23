#!/usr/bin/env python3
"""Gera massa empresarial fictícia para estruturar o dashboard de Turnover/ESG."""

from __future__ import annotations

import csv
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "powerbi" / "metricas_empresa_demo.csv"
HTML_OUTPUT = ROOT / "exports" / "mock_dashboard_metricas_empresa.html"
SEED = 23062026

EMPRESAS = [("EMP_DEMO_01", "Empresa Aurora"), ("EMP_DEMO_02", "Empresa Horizonte"), ("EMP_DEMO_03", "Empresa Integra")]
DEPARTAMENTOS = ["Tecnologia", "Operações", "Comercial", "Administrativo"]
SEGMENTOS = [
    (genero, raca_cor, pcd)
    for genero in ("Mulher", "Homem")
    for raca_cor in ("Negra", "Outras")
    for pcd in ("Sim", "Não")
]


def gerar_linhas() -> list[dict[str, object]]:
    rng = random.Random(SEED)
    linhas: list[dict[str, object]] = []
    estado: dict[tuple[str, str, str], int] = {}
    for empresa_id, empresa_nome in EMPRESAS:
        for departamento in DEPARTAMENTOS:
            for genero, raca_cor, pcd in SEGMENTOS:
                estado[(empresa_id, departamento, genero, raca_cor, pcd)] = rng.randint(4, 20)

    for mes in range(1, 13):
        competencia = f"2026-{mes:02d}-01"
        for empresa_id, empresa_nome in EMPRESAS:
            for departamento in DEPARTAMENTOS:
                for genero, raca_cor, pcd in SEGMENTOS:
                    chave = (empresa_id, departamento, genero, raca_cor, pcd)
                    inicio = estado[chave]
                    admissoes = rng.randint(0, max(1, round(inicio * 0.12)))
                    limite_desligamentos = min(max(1, round(inicio * 0.10)), inicio + admissoes - 1)
                    desligamentos = rng.randint(0, limite_desligamentos)
                    fim = inicio + admissoes - desligamentos
                    estado[chave] = fim
                    linhas.append({
                        "competencia": competencia,
                        "empresa_id": empresa_id,
                        "empresa_nome_demo": empresa_nome,
                        "departamento": departamento,
                        "genero_demo": genero,
                        "raca_cor_demo": raca_cor,
                        "pcd_demo": pcd,
                        "headcount_inicio": inicio,
                        "admissoes": admissoes,
                        "desligamentos": desligamentos,
                        "headcount_fim": fim,
                        "meta_diversidade_percentual": 40,
                        "dado_demonstrativo": "SIM",
                        "fonte": "Massa ficticia generica para prototipacao; substituir pelo cadastro da empresa",
                    })
    return linhas


def calcular_turnover(linhas: list[dict[str, object]]) -> float:
    admissoes = sum(int(item["admissoes"]) for item in linhas)
    desligamentos = sum(int(item["desligamentos"]) for item in linhas)
    headcount_medio = sum(
        (int(item["headcount_inicio"]) + int(item["headcount_fim"])) / 2 for item in linhas
    )
    return ((admissoes + desligamentos) / 2) / headcount_medio * 100 if headcount_medio else 0.0


def gerar_html(linhas: list[dict[str, object]]) -> str:
    competencias = sorted({str(item["competencia"]) for item in linhas})
    ultima = competencias[-1]
    linhas_ultima = [item for item in linhas if item["competencia"] == ultima]
    turnover_mensal = [
        calcular_turnover([item for item in linhas if item["competencia"] == competencia])
        for competencia in competencias
    ]
    desligamentos = sum(int(item["desligamentos"]) for item in linhas_ultima)
    headcount = sum(int(item["headcount_fim"]) for item in linhas_ultima)
    headcount_diversidade = sum(
        int(item["headcount_fim"])
        for item in linhas_ultima
        if item["genero_demo"] == "Mulher"
        or item["raca_cor_demo"] == "Negra"
        or item["pcd_demo"] == "Sim"
    )
    participacao = headcount_diversidade / headcount * 100 if headcount else 0.0
    departamentos = sorted({str(item["departamento"]) for item in linhas_ultima})
    turnover_departamentos = {
        departamento: calcular_turnover(
            [item for item in linhas_ultima if item["departamento"] == departamento]
        )
        for departamento in departamentos
    }
    barras = "".join(
        f'<div class="bar" title="{valor:.1f}%" style="height:{min(valor * 12, 90):.1f}%"></div>'
        for valor in turnover_mensal
    )
    linhas_departamentos = "".join(
        f'<div class="depart"><span>{nome}</span><div class="track"><div class="fill" style="width:{min(valor * 12, 100):.1f}%"></div></div><b>{valor:.1f}%</b></div>'
        for nome, valor in turnover_departamentos.items()
    )
    html = """<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><title>Mock Turnover e ESG</title><style>
body{margin:0;background:#f8fafc;color:#172033;font:14px Arial,sans-serif}.page{max-width:1180px;margin:auto;padding:28px}.tag{display:inline-block;background:#fff3cd;color:#805b00;padding:7px 10px;border-radius:6px;font-weight:700}.cards,.charts{display:grid;gap:16px;margin-top:18px}.cards{grid-template-columns:repeat(4,1fr)}.charts{grid-template-columns:1.2fr .8fr}.card,.panel{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:18px}.value{font-size:28px;font-weight:700;margin-top:8px}.bars{height:190px;display:flex;align-items:end;gap:12px}.bar{flex:1;background:#6c3fc5;border-radius:5px 5px 0 0}.legend{color:#64748b;font-size:12px}.depart{display:grid;grid-template-columns:110px 1fr 45px;gap:8px;align-items:center;margin:14px 0}.track{height:10px;background:#eee;border-radius:8px}.fill{height:10px;background:#16a34a;border-radius:8px}@media(max-width:800px){.cards,.charts{grid-template-columns:1fr 1fr}}
</style></head><body><main class=\"page\"><span class=\"tag\">DADOS DEMONSTRATIVOS — EMPRESAS GENÉRICAS</span><h1>Saúde do Time e ESG</h1><p class=\"legend\">Protótipo para reservar o espaço de incorporação do Power BI. Valores sem efeito operacional.</p><section class=\"cards\"><div class=\"card\">Turnover — Dez/2026<div class=\"value\">__TURNOVER__%</div></div><div class=\"card\">Desligamentos — Dez/2026<div class=\"value\">__DESLIGAMENTOS__</div></div><div class=\"card\">Participação diversa<div class=\"value\">__PARTICIPACAO__%</div></div><div class=\"card\">Meta ESG<div class=\"value\">__META__</div></div></section><section class=\"charts\"><div class=\"panel\"><h2>Evolução mensal do turnover</h2><div class=\"bars\">__BARRAS__</div><p class=\"legend\">Jan–Dez/2026</p></div><div class=\"panel\"><h2>Turnover por departamento — Dez/2026</h2>__DEPARTAMENTOS__</div></section></main></body></html>"""
    return (
        html.replace("__TURNOVER__", f"{turnover_mensal[-1]:.1f}".replace(".", ","))
        .replace("__DESLIGAMENTOS__", str(desligamentos))
        .replace("__PARTICIPACAO__", f"{participacao:.1f}".replace(".", ","))
        .replace("__META__", "Atingida" if participacao >= 40 else "Abaixo da meta")
        .replace("__BARRAS__", barras)
        .replace("__DEPARTAMENTOS__", linhas_departamentos)
    )


def main() -> None:
    linhas = gerar_linhas()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8-sig", newline="") as arquivo:
        writer = csv.DictWriter(arquivo, fieldnames=list(linhas[0]))
        writer.writeheader()
        writer.writerows(linhas)
    HTML_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    HTML_OUTPUT.write_text(gerar_html(linhas), encoding="utf-8")
    print(f"Base demonstrativa: {OUTPUT} ({len(linhas)} linhas)")
    print(f"Protótipo estático: {HTML_OUTPUT}")


if __name__ == "__main__":
    main()
