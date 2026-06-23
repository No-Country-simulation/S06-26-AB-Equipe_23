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
GRUPOS = ["Mulheres", "Pessoas negras", "Pessoas com deficiência", "Outros colaboradores"]


def gerar_linhas() -> list[dict[str, object]]:
    rng = random.Random(SEED)
    linhas: list[dict[str, object]] = []
    estado: dict[tuple[str, str, str], int] = {}
    for empresa_id, empresa_nome in EMPRESAS:
        for departamento in DEPARTAMENTOS:
            for grupo in GRUPOS:
                estado[(empresa_id, departamento, grupo)] = rng.randint(8, 38)

    for mes in range(1, 13):
        competencia = f"2026-{mes:02d}-01"
        for empresa_id, empresa_nome in EMPRESAS:
            for departamento in DEPARTAMENTOS:
                for grupo in GRUPOS:
                    chave = (empresa_id, departamento, grupo)
                    inicio = estado[chave]
                    admissoes = rng.randint(0, max(1, round(inicio * 0.12)))
                    desligamentos = rng.randint(0, max(1, round(inicio * 0.10)))
                    fim = max(1, inicio + admissoes - desligamentos)
                    estado[chave] = fim
                    linhas.append({
                        "competencia": competencia,
                        "empresa_id": empresa_id,
                        "empresa_nome_demo": empresa_nome,
                        "departamento": departamento,
                        "grupo_diversidade": grupo,
                        "headcount_inicio": inicio,
                        "admissoes": admissoes,
                        "desligamentos": desligamentos,
                        "headcount_fim": fim,
                        "meta_diversidade_percentual": 40,
                        "dado_demonstrativo": "SIM",
                        "fonte": "Massa ficticia generica para prototipacao; substituir pelo cadastro da empresa",
                    })
    return linhas


def gerar_html() -> str:
    return """<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><title>Mock Turnover e ESG</title><style>
body{margin:0;background:#f8fafc;color:#172033;font:14px Arial,sans-serif}.page{max-width:1180px;margin:auto;padding:28px}.tag{display:inline-block;background:#fff3cd;color:#805b00;padding:7px 10px;border-radius:6px;font-weight:700}.cards,.charts{display:grid;gap:16px;margin-top:18px}.cards{grid-template-columns:repeat(4,1fr)}.charts{grid-template-columns:1.2fr .8fr}.card,.panel{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:18px}.value{font-size:28px;font-weight:700;margin-top:8px}.bars{height:190px;display:flex;align-items:end;gap:12px}.bar{flex:1;background:#6c3fc5;border-radius:5px 5px 0 0}.legend{color:#64748b;font-size:12px}.depart{display:grid;grid-template-columns:110px 1fr 45px;gap:8px;align-items:center;margin:14px 0}.track{height:10px;background:#eee;border-radius:8px}.fill{height:10px;background:#16a34a;border-radius:8px}@media(max-width:800px){.cards,.charts{grid-template-columns:1fr 1fr}}
</style></head><body><main class=\"page\"><span class=\"tag\">DADOS DEMONSTRATIVOS — EMPRESAS GENÉRICAS</span><h1>Saúde do Time e ESG</h1><p class=\"legend\">Protótipo para reservar o espaço de incorporação do Power BI. Valores sem efeito operacional.</p><section class=\"cards\"><div class=\"card\">Turnover geral<div class=\"value\">4,8%</div></div><div class=\"card\">Desligamentos<div class=\"value\">17</div></div><div class=\"card\">Participação diversa<div class=\"value\">43%</div></div><div class=\"card\">Meta ESG<div class=\"value\">Atingida</div></div></section><section class=\"charts\"><div class=\"panel\"><h2>Evolução mensal do turnover</h2><div class=\"bars\"><div class=\"bar\" style=\"height:45%\"></div><div class=\"bar\" style=\"height:62%\"></div><div class=\"bar\" style=\"height:51%\"></div><div class=\"bar\" style=\"height:70%\"></div><div class=\"bar\" style=\"height:58%\"></div><div class=\"bar\" style=\"height:48%\"></div><div class=\"bar\" style=\"height:66%\"></div><div class=\"bar\" style=\"height:55%\"></div><div class=\"bar\" style=\"height:43%\"></div><div class=\"bar\" style=\"height:61%\"></div><div class=\"bar\" style=\"height:53%\"></div><div class=\"bar\" style=\"height:49%\"></div></div><p class=\"legend\">Jan–Dez/2026</p></div><div class=\"panel\"><h2>Turnover por departamento</h2><div class=\"depart\"><span>Tecnologia</span><div class=\"track\"><div class=\"fill\" style=\"width:68%\"></div></div><b>5,6%</b></div><div class=\"depart\"><span>Operações</span><div class=\"track\"><div class=\"fill\" style=\"width:80%\"></div></div><b>6,4%</b></div><div class=\"depart\"><span>Comercial</span><div class=\"track\"><div class=\"fill\" style=\"width:58%\"></div></div><b>4,7%</b></div><div class=\"depart\"><span>Administrativo</span><div class=\"track\"><div class=\"fill\" style=\"width:38%\"></div></div><b>3,1%</b></div></div></section></main></body></html>"""


def main() -> None:
    linhas = gerar_linhas()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8-sig", newline="") as arquivo:
        writer = csv.DictWriter(arquivo, fieldnames=list(linhas[0]))
        writer.writeheader()
        writer.writerows(linhas)
    HTML_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    HTML_OUTPUT.write_text(gerar_html(), encoding="utf-8")
    print(f"Base demonstrativa: {OUTPUT} ({len(linhas)} linhas)")
    print(f"Protótipo estático: {HTML_OUTPUT}")


if __name__ == "__main__":
    main()
