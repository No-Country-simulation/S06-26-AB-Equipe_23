#!/usr/bin/env python3
"""
Gera um arquivo JSON com regiões críticas (alta população + conectividade baixa)

Uso:
  python scripts/generate_critical_regions.py \
    --input data/processed/insights_regioes_agregado.csv \
    --output data/config/critical_regions.json \
    --percentile 0.8 \
    --connectivity-values baixa

O script seleciona regiões cuja coluna `usuarios_observados_total` esteja
acima do percentil (padrão 0.8) e cuja coluna `indicador_conectividade`
esteja entre os valores fornecidos (padrão: "baixa"). O arquivo de saída é
uma lista JSON com objetos contendo `municipio`, `cluster`, `lat`, `lon`,
`usuarios_observados_total` e indicadores de conectividade.
"""
import argparse
import csv
import json
from statistics import quantiles
from typing import List, Dict


def read_csv(path: str) -> List[Dict[str, str]]:
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)


def write_json(path: str, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def parse_int(value: str) -> int:
    try:
        return int(value)
    except Exception:
        try:
            return int(float(value))
        except Exception:
            return 0


def generate(input_csv: str, output_json: str, percentile: float, connectivity_values: List[str]):
    rows = read_csv(input_csv)
    if not rows:
        write_json(output_json, [])
        return

    usuarios = [parse_int(r.get('usuarios_observados_total', 0)) for r in rows]
    # compute percentile threshold (using quantiles: n=100 -> index)
    try:
        q = quantiles(usuarios, n=100)
        idx = min(max(int(percentile * 100) - 1, 0), 98)
        threshold = q[idx]
    except Exception:
        # fallback: use median
        threshold = sorted(usuarios)[max(0, len(usuarios)//2 - 1)]

    connectivity_values = [v.lower() for v in connectivity_values]

    critical = []
    for r in rows:
        conect = (r.get('indicador_conectividade') or '').strip().lower()
        usuarios_i = parse_int(r.get('usuarios_observados_total', 0))
        if conect in connectivity_values and usuarios_i >= threshold:
            try:
                lat = float(r.get('lat_media') or 0)
                lon = float(r.get('lon_media') or 0)
            except Exception:
                lat = 0.0
                lon = 0.0
            critical.append({
                'municipio': r.get('municipio'),
                'cluster': r.get('cluster'),
                'lat': lat,
                'lon': lon,
                'usuarios_observados_total': usuarios_i,
                'indicador_conectividade': r.get('indicador_conectividade'),
                'qualidade_sinal': r.get('qualidade_sinal'),
            })

    write_json(output_json, critical)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', '-i', default='data/processed/insights_regioes_agregado.csv')
    parser.add_argument('--output', '-o', default='data/config/critical_regions.json')
    parser.add_argument('--percentile', '-p', type=float, default=0.8)
    parser.add_argument('--min-users', type=int, default=0,
                        help='Optional minimum number of observed users to include a region (overrides percentile when >0)')
    parser.add_argument('--connectivity-values', '-c', type=str, default='baixa',
                        help='Comma-separated connectivity values to match (case-insensitive)')
    args = parser.parse_args()
    connectivity_values = [v.strip() for v in args.connectivity_values.split(',') if v.strip()]
    min_users = args.min_users if args.min_users and args.min_users > 0 else None
    # If min_users provided, bypass percentile threshold and use absolute filter
    if min_users:
        # generate using min_users by creating a small wrapper
        rows = read_csv(args.input)
        critical = []
        for r in rows:
            conect = (r.get('indicador_conectividade') or '').strip().lower()
            usuarios_i = parse_int(r.get('usuarios_observados_total', 0))
            if conect in [v.lower() for v in connectivity_values] and usuarios_i >= min_users:
                try:
                    lat = float(r.get('lat_media') or 0)
                    lon = float(r.get('lon_media') or 0)
                except Exception:
                    lat = 0.0
                    lon = 0.0
                critical.append({
                    'municipio': r.get('municipio'),
                    'cluster': r.get('cluster'),
                    'lat': lat,
                    'lon': lon,
                    'usuarios_observados_total': usuarios_i,
                    'indicador_conectividade': r.get('indicador_conectividade'),
                    'qualidade_sinal': r.get('qualidade_sinal'),
                })
        write_json(args.output, critical)
    else:
        generate(args.input, args.output, args.percentile, connectivity_values)


if __name__ == '__main__':
    main()
