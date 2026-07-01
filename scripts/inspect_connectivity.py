#!/usr/bin/env python3
import csv
import statistics

def main():
    path='data/processed/insights_regioes_agregado.csv'
    rows=[]
    with open(path, encoding='utf-8') as f:
        r=csv.DictReader(f)
        for row in r:
            rows.append(row)
    vals={}
    for row in rows:
        k=(row.get('indicador_conectividade') or '').strip().lower()
        try:
            u=int(float(row.get('usuarios_observados_total') or 0))
        except Exception:
            u=0
        vals.setdefault(k,[]).append(u)
    for k in sorted(vals.keys()):
        lst=sorted(vals[k])
        if not lst:
            print(k or '<vazio>', 'count=0')
            continue
        print(f"{k or '<vazio>'}: count={len(lst)} min={lst[0]} max={lst[-1]} median={int(statistics.median(lst))}")

if __name__=='__main__':
    main()
