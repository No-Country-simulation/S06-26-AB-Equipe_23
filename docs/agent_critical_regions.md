**Consumo do arquivo critical_regions pelo Agente de IA**

Breve: o Agente de IA deve ler o arquivo de configuração gerado pelo pipeline e usá-lo como fonte estática de regiões críticas (alta demanda + conectividade baixa/média). O arquivo é gerado por [scripts/generate_critical_regions.py](scripts/generate_critical_regions.py) e salvo em [data/config/critical_regions.json](data/config/critical_regions.json).

- **Formato esperado:** JSON — lista de objetos.
- **Campos principais:**
  - **municipio:** nome do município.
  - **cluster:** identificador do cluster/região.
  - **lat:** latitude (float).
  - **lon:** longitude (float).
  - **usuarios_observados_total:** inteiro, número de usuários observados.
  - **indicador_conectividade:** texto (ex.: "baixa", "media", "alta").
  - **qualidade_sinal:** texto descritivo (ex.: "media", "alta").

Exemplo de entrada:

```
{
  "municipio": "Florianopolis",
  "cluster": "CANASVIEIRAS",
  "lat": -27.432597,
  "lon": -48.459966,
  "usuarios_observados_total": 330261,
  "indicador_conectividade": "media",
  "qualidade_sinal": "media"
}
```

Recomendações para o Agente de IA
- Carregamento e validação
  - Ler o arquivo em inicialização ou cache e validar tipos (lat/lon numéricos, usuários inteiro).
  - Se o arquivo estiver vazio (`[]`) aplicar fallback (ex.: não bloquear ações que dependam disso; registrar alerta).

- Uso prático
  - Priorizar clusters por `usuarios_observados_total` decrescente.
  - Aplicar filtros por `indicador_conectividade` (ex.: só `baixa` ou `baixa,media`).
  - Ao correlacionar com um evento ou ticket, calcular distância haversine entre a coordenada do evento e as entradas do arquivo para achar correspondência mais próxima.

- Atualização
  - O arquivo é gerado por [scripts/generate_critical_regions.py](scripts/generate_critical_regions.py). Recomenda-se re-gerar periodicamente (cron/CI) ou quando houver novos dados processados.

Snippet Python (carregador simples)

```
import json
from math import radians, sin, cos, asin, sqrt

def load_critical_regions(path):
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    # basic validation
    out = []
    for e in data:
        try:
            lat = float(e.get('lat'))
            lon = float(e.get('lon'))
            u = int(e.get('usuarios_observados_total') or 0)
        except Exception:
            continue
        out.append({
            'municipio': e.get('municipio'),
            'cluster': e.get('cluster'),
            'lat': lat,
            'lon': lon,
            'usuarios': u,
            'conectividade': (e.get('indicador_conectividade') or '').lower(),
        })
    return out

def haversine(lat1, lon1, lat2, lon2):
    # retorna distância em km
    lat1, lon1, lat2, lon2 = map(radians, (lat1, lon1, lat2, lon2))
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
    return 6371 * 2 * asin(sqrt(a))

# exemplo de uso: encontrar região mais próxima
def find_nearest_region(regions, lat, lon, max_km=5):
    best = None
    for r in regions:
        d = haversine(lat, lon, r['lat'], r['lon'])
        if d <= max_km and (best is None or d < best[0]):
            best = (d, r)
    return best[1] if best else None
```

Boas práticas
- Validar entrada do arquivo em startup e falhar de forma graciosa (logs/telemetria) se inconsistências forem detectadas.
- Não assumir que o arquivo é completo: combine com verificação em tempo real quando possível.
- Documentar no repositório como regenar o arquivo (link para [scripts/generate_critical_regions.py](scripts/generate_critical_regions.py)).

Onde está o arquivo
- Gerado em: [data/config/critical_regions.json](data/config/critical_regions.json)
- Gerador: [scripts/generate_critical_regions.py](scripts/generate_critical_regions.py)
