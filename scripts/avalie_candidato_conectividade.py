#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script de BI / Dados - Avaliação de Conectividade do Candidato
Calcula a distância em km até as antenas mais próximas e aplica regras de Exclusão Digital.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import pathlib
import re
import sys
import urllib.request


def normalizar_cep(cep_str: str) -> str:
    """Remove caracteres não numéricos de um CEP e valida seu tamanho."""
    cep_limpo = re.sub(r"\D", "", str(cep_str))
    if len(cep_limpo) != 8:
        raise ValueError(f"CEP '{cep_str}' inválido. Deve conter exatamente 8 dígitos.")
    return cep_limpo


def obter_coordenadas_por_cep(cep: str) -> tuple[float, float, str]:
    """
    Retorna latitude e longitude para o CEP fornecido.
    Busca primeiro na base de dados de fallbacks locais (Grande Florianópolis)
    e depois tenta consultar uma API pública de geocodificação de CEP.
    Retorna (latitude, longitude, fonte_da_informacao).
    """
    cep_limpo = normalizar_cep(cep)
    
    # 1. Fallback local para agilizar desenvolvimento e garantir funcionamento offline
    # Mapeia prefixos ou CEPs específicos para clusters da Região Metropolitana de Florianópolis
    fallbacks_locais = {
        "88036000": (-27.596111, -48.525528, "Tabela Local (Trindade)"),
        "88040000": (-27.593478, -48.552089, "Tabela Local (UFSC)"),
        "88102000": (-27.594458, -48.619528, "Tabela Local (São José Kobrasol)"),
        "88160000": (-27.508108, -48.654131, "Tabela Local (Biguaçu BR-101)"),
        "88130000": (-27.637456, -48.666794, "Tabela Local (Palhoça Centro)"),
        "88015000": (-27.586028, -48.547444, "Tabela Local (Centro Beiramar)"),
        "88101000": (-27.608008, -48.626850, "Tabela Local (Campinas São José)"),
        "88070000": (-27.597667, -48.585108, "Tabela Local (Continente)"),
    }
    
    if cep_limpo in fallbacks_locais:
        return fallbacks_locais[cep_limpo]

    # Mapeamento por faixa de CEP se não for um CEP exato
    if cep_limpo.startswith("880"): # Florianópolis
        return -27.5969, -48.5495, "Centróide Municipal (Florianópolis)"
    elif cep_limpo.startswith("8810") or cep_limpo.startswith("8811"): # São José
        return -27.6080, -48.6347, "Centróide Municipal (São José)"
    elif cep_limpo.startswith("8813"): # Palhoça
        return -27.6415, -48.6743, "Centróide Municipal (Palhoça)"
    elif cep_limpo.startswith("8816"): # Biguaçu
        return -27.5081, -48.6541, "Centróide Municipal (Biguaçu)"

    # 2. Consulta via API AwesomeAPI (gratuita e sem chave)
    try:
        url = f"https://cep.awesomeapi.com.br/json/{cep_limpo}"
        req = urllib.request.Request(url, headers={'User-Agent': 'AppBit-BI-Agent/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            lat = float(data.get('lat'))
            lon = float(data.get('lng'))
            return lat, lon, "AwesomeAPI Geocoding"
    except Exception:
        pass

    # 3. Consulta secundária via ViaCEP + Centroide fallback
    try:
        url_viacep = f"https://viacep.com.br/ws/{cep_limpo}/json/"
        req = urllib.request.Request(url_viacep, headers={'User-Agent': 'AppBit-BI-Agent/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            cidade = data.get('localidade', '').lower()
            if 'florian' in cidade:
                return -27.5969, -48.5495, "ViaCEP Fallback (Florianópolis)"
            elif 'são josé' in cidade or 'sao jose' in cidade:
                return -27.6080, -48.6347, "ViaCEP Fallback (São José)"
            elif 'palhoça' in cidade or 'palhoca' in cidade:
                return -27.6415, -48.6743, "ViaCEP Fallback (Palhoça)"
            elif 'biguaçu' in cidade or 'biguacu' in cidade:
                return -27.5081, -48.6541, "ViaCEP Fallback (Biguaçu)"
    except Exception:
        pass

    # Fallback genérico para a Grande Florianópolis se começar com 88
    if cep_limpo.startswith("88"):
        return -27.5969, -48.5495, "Fallback Geral Grande Florianópolis"
        
    raise RuntimeError(f"Não foi possível geocodificar o CEP '{cep_limpo}' via APIs ou fallbacks locais.")


def calcular_distancia_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calcula a distância em quilômetros entre dois pontos geográficos."""
    R = 6371.0  # Raio médio da Terra em km
    
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    
    return round(R * c, 3)


def buscar_antenas_proximas(
    lat: float, lon: float, antenas_csv_path: pathlib.Path, top_n: int = 3
) -> list[dict]:
    """
    Carrega as antenas de antenas_sinal_tratadas.csv, calcula a distância
    de cada uma até (lat, lon) e retorna as top_n antenas mais próximas.
    """
    if not antenas_csv_path.exists():
        raise FileNotFoundError(f"Base de antenas não encontrada em: {antenas_csv_path}")

    antenas_com_distancia = []
    with antenas_csv_path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            a_lat = float(row["lat"])
            a_lon = float(row["lon"])
            dist = calcular_distancia_haversine(lat, lon, a_lat, a_lon)
            
            sessoes_3g = int(float(row.get("sessoes_3g", 0)))
            sessoes_4g = int(float(row.get("sessoes_4g", 0)))
            sessoes_5g = int(float(row.get("sessoes_5g", 0)))
            sessoes_outros = int(float(row.get("sessoes_outros", 0)))
            total_sessoes = sessoes_3g + sessoes_4g + sessoes_5g + sessoes_outros
            
            antenas_com_distancia.append({
                "ecgi": row["ecgi"],
                "cluster": row["cluster"],
                "municipio": row["municipio"],
                "latitude": a_lat,
                "longitude": a_lon,
                "distancia_km": dist,
                "sessoes_3g": sessoes_3g,
                "sessoes_4g": sessoes_4g,
                "sessoes_5g": sessoes_5g,
                "total_sessoes": total_sessoes,
                "tecnologia_predominante": row["tecnologia_predominante"]
            })

    # Ordenar por distância ascendente
    antenas_com_distancia.sort(key=lambda x: x["distancia_km"])
    return antenas_com_distancia[:top_n]


def avaliar_qualidade_rede(antenas_proximas: list[dict]) -> tuple[int, str, str | None, str]:
    """
    Aplica a regra de avaliação de rede baseado nas antenas mais próximas.
    Regra:
      - Se a antena mais próxima tiver predomínio de 5G ou 4G, distância <= 5.0 km e
        volume total de sessões >= 10.000, a nota de conectividade é 100 (máxima),
        qualidade é 'Alta' e alerta é None.
      - Se a antena mais próxima for 3G, ou se estiver a mais de 5.0 km (sinal fraco),
        ou se tiver volume de sessões < 10.000 (sinal fraco/cobertura ruim),
        gera nota 30, qualidade 'Baixa' e o alerta de 'Exclusão Digital'.
    """
    if not antenas_proximas:
        return 0, "Sem Cobertura", "Exclusão Digital", "Nenhuma antena encontrada nas proximidades."

    antena = antenas_proximas[0]
    dist = antena["distancia_km"]
    tech = antena["tecnologia_predominante"]
    total = antena["total_sessoes"]

    # Critérios para Sinal Fraco
    motivo_fraqueza = []
    if dist > 5.0:
        motivo_fraqueza.append(f"distância excessiva até a antena ({dist:.2f} km, limite de 5.0 km)")
    if total < 10000:
        motivo_fraqueza.append(f"baixo volume de tráfego/sinal fraco ({total} sessões registradas)")
    if tech == "3G":
        motivo_fraqueza.append("tecnologia obsoleta predominante (3G)")

    if tech in ("4G", "5G") and not motivo_fraqueza:
        detalhes = f"Conexão estável via antena mais próxima ({dist:.2f} km) com tecnologia predominante {tech}."
        return 100, "Alta", None, detalhes
    else:
        alerta = "Exclusão Digital"
        motivos_str = " e ".join(motivo_fraqueza) if motivo_fraqueza else "sinal fraco geral"
        detalhes = f"Alerta de Exclusão Digital devido a: {motivos_str}."
        return 30, "Baixa", alerta, detalhes


def processar_candidato_por_id(
    candidato_id: str,
    candidatos_json_path: pathlib.Path,
    antenas_csv_path: pathlib.Path,
    top_n: int = 3
) -> dict:
    """Busca o candidato no mock JSON, resolve suas coordenadas e avalia sua rede."""
    if not candidatos_json_path.exists():
        raise FileNotFoundError(f"Mock de candidatos não encontrado em: {candidatos_json_path}")

    with candidatos_json_path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    candidato = None
    for cand in data.get("candidatos", []):
        if cand["candidato_id"] == candidato_id:
            candidato = cand
            break

    if not candidato:
        raise ValueError(f"Candidato com ID '{candidato_id}' não encontrado no arquivo de mocks.")

    # Tenta usar as coordenadas/CEP do mock de candidatos.
    lat = cand.get("lat")
    lon = cand.get("lon")
    cep = cand.get("cep")

    fonte_coordenadas = "Dados do Candidato (Mock)"

    if lat is None or lon is None:
        if cep:
            lat, lon, fonte_coordenadas = obter_coordenadas_por_cep(cep)
        else:
            # Fallback conceitual baseado no cluster de residência se lat/lon/cep não existirem
            cluster = cand.get("cluster_residencia", "")
            fallbacks_por_cluster = {
                "TRINDADE": (-27.596111, -48.525528, "Fallback por Cluster"),
                "SAO_JOSE_KOBRASOL": (-27.594458, -48.619528, "Fallback por Cluster"),
                "UFSC": (-27.593478, -48.552089, "Fallback por Cluster"),
                "BIGUACU_BR101_NORTE": (-27.508108, -48.654131, "Fallback por Cluster"),
                "PALHOCA_CENTRO": (-27.637456, -48.666794, "Fallback por Cluster"),
                "CBD_BEIRAMAR": (-27.586028, -48.547444, "Fallback por Cluster"),
                "CAMPINAS_SAO_JOSE": (-27.608008, -48.626850, "Fallback por Cluster"),
                "CONTINENTE": (-27.597667, -48.585108, "Fallback por Cluster"),
            }
            if cluster in fallbacks_por_cluster:
                lat, lon, fonte_coordenadas = fallbacks_por_cluster[cluster]
            else:
                raise ValueError(f"Candidato '{candidato_id}' sem informações de localização válidas.")

    antenas_proximas = buscar_antenas_proximas(lat, lon, antenas_csv_path, top_n)
    nota, qualidade, alerta, detalhes = avaliar_qualidade_rede(antenas_proximas)

    # Limpar as chaves das antenas próximas para saída resumida
    antenas_saida = []
    for a in antenas_proximas:
        antenas_saida.append({
            "ecgi": a["ecgi"],
            "cluster": a["cluster"],
            "municipio": a["municipio"],
            "distancia_km": a["distancia_km"],
            "tecnologia_predominante": a["tecnologia_predominante"],
            "total_sessoes": a["total_sessoes"]
        })

    return {
        "candidato_id": candidato_id,
        "apelido_exibicao": cand.get("apelido_exibicao"),
        "regiao": cand.get("regiao"),
        "cluster_residencia": cand.get("cluster_residencia"),
        "cep": cep,
        "geolocalizacao": {"lat": lat, "lon": lon, "fonte": fonte_coordenadas},
        "nota_conectividade": nota,
        "qualidade_rede": qualidade,
        "alerta": alerta,
        "detalhes": detalhes,
        "antenas_proximas": antenas_saida
    }


def processar_por_localizacao(
    lat: float, lon: float, cep: str | None, antenas_csv_path: pathlib.Path, top_n: int = 3
) -> dict:
    """Processa coordenadas e/ou CEP e avalia a qualidade da rede."""
    antenas_proximas = buscar_antenas_proximas(lat, lon, antenas_csv_path, top_n)
    nota, qualidade, alerta, detalhes = avaliar_qualidade_rede(antenas_proximas)

    antenas_saida = []
    for a in antenas_proximas:
        antenas_saida.append({
            "ecgi": a["ecgi"],
            "cluster": a["cluster"],
            "municipio": a["municipio"],
            "distancia_km": a["distancia_km"],
            "tecnologia_predominante": a["tecnologia_predominante"],
            "total_sessoes": a["total_sessoes"]
        })

    return {
        "candidato_id": None,
        "cep": cep,
        "geolocalizacao": {"lat": lat, "lon": lon, "fonte": "Input Geocodificado" if cep else "Input Direto"},
        "nota_conectividade": nota,
        "qualidade_rede": qualidade,
        "alerta": alerta,
        "detalhes": detalhes,
        "antenas_proximas": antenas_saida
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Avalia qualidade de rede e distância de antenas para candidatos."
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--candidato", help="ID do candidato fictício (ex: cand_001)")
    group.add_argument("--cep", help="CEP do candidato (ex: 88036-000)")
    group.add_argument("--coordenadas", nargs=2, type=float, metavar=("LAT", "LON"),
                       help="Latitude e Longitude do candidato")

    parser.add_argument("--top-n", type=int, default=3, help="Número de antenas mais próximas a buscar")
    parser.add_argument("--antenas-csv", default="data/processed/antenas_sinal_tratadas.csv",
                        help="Caminho da base tratada de antenas")
    parser.add_argument("--candidatos-json", default="mocks/candidatos_teste.json",
                        help="Caminho do mock JSON de candidatos")

    args = parser.parse_args()

    root_dir = pathlib.Path(__file__).resolve().parents[1]
    antenas_path = root_dir / args.antenas_csv
    candidatos_path = root_dir / args.candidatos_json

    try:
        if args.candidato:
            resultado = processar_candidato_por_id(
                args.candidato, candidatos_path, antenas_path, args.top_n
            )
        elif args.cep:
            lat, lon, fonte = obter_coordenadas_por_cep(args.cep)
            resultado = processar_por_localizacao(
                lat, lon, args.cep, antenas_path, args.top_n
            )
            resultado["geolocalizacao"]["fonte"] = fonte
        elif args.coordenadas:
            lat, lon = args.coordenadas
            resultado = processar_por_localizacao(
                lat, lon, None, antenas_path, args.top_n
            )
            
        print(json.dumps(resultado, indent=2, ensure_ascii=False))
        sys.exit(0)
    except Exception as e:
        erro_json = {
            "status": "erro",
            "mensagem": str(e)
        }
        print(json.dumps(erro_json, indent=2, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
