from __future__ import annotations

import argparse
import csv
from collections import defaultdict
from pathlib import Path


def read_csv(path: Path):
    with path.open("r", encoding="utf-8-sig", newline="") as fh:
        yield from csv.DictReader(fh)


def write_csv(path: Path, rows: list[dict], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def to_int(value) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return 0


def to_float(value) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def to_optional_float(value) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def load_antenas(dataset_root: Path) -> dict[str, dict]:
    path = dataset_root / "referencias" / "antenas_flp.csv"
    antenas = {}
    for row in read_csv(path):
        antenas[row["ecgi"]] = {
            "ecgi": row["ecgi"],
            "cluster": row["cluster"],
            "municipio": row["municipio"],
            "lat": row["lat"],
            "lon": row["lon"],
        }
    return antenas


def process_antenas(antenas: dict[str, dict], out_dir: Path) -> None:
    rows = []
    for item in antenas.values():
        rows.append(
            {
                **item,
                "fonte": "Anatel/Vísent CDRView",
            }
        )
    rows.sort(key=lambda r: (r["municipio"], r["cluster"], r["ecgi"]))
    write_csv(
        out_dir / "antenas_tratadas.csv",
        rows,
        ["ecgi", "cluster", "municipio", "lat", "lon", "fonte"],
    )


def process_concentracao(dataset_root: Path, out_dir: Path) -> None:
    grouped = {}
    path = dataset_root / "tensores" / "tensor_concentracao.csv"
    for row in read_csv(path):
        key = (row["cluster"], row["municipio"], row["periodo"])
        item = grouped.setdefault(
            key,
            {
                "cluster": row["cluster"],
                "municipio": row["municipio"],
                "periodo": row["periodo"],
                "n_registros": 0,
                "usuarios_total": 0,
                "sessoes_total": 0,
                "download_total_bytes": 0,
                "upload_total_bytes": 0,
                "lat_media": 0.0,
                "lon_media": 0.0,
                "coords_validas": 0,
            },
        )
        item["n_registros"] += 1
        item["usuarios_total"] += to_int(row.get("n_usuarios"))
        item["sessoes_total"] += to_int(row.get("n_sessoes"))
        item["download_total_bytes"] += to_int(row.get("download_bytes"))
        item["upload_total_bytes"] += to_int(row.get("upload_bytes"))
        lat = to_optional_float(row.get("lat"))
        lon = to_optional_float(row.get("lon"))
        if lat is not None and lon is not None:
            item["lat_media"] += lat
            item["lon_media"] += lon
            item["coords_validas"] += 1

    rows = []
    for item in grouped.values():
        n = max(item["coords_validas"], 1)
        item["lat_media"] = round(item["lat_media"] / n, 6)
        item["lon_media"] = round(item["lon_media"] / n, 6)
        item.pop("coords_validas", None)
        rows.append(item)
    rows.sort(key=lambda r: r["usuarios_total"], reverse=True)

    write_csv(
        out_dir / "concentracao_regional.csv",
        rows,
        [
            "cluster",
            "municipio",
            "periodo",
            "n_registros",
            "usuarios_total",
            "sessoes_total",
            "download_total_bytes",
            "upload_total_bytes",
            "lat_media",
            "lon_media",
        ],
    )


def process_fluxos(dataset_root: Path, out_dir: Path) -> None:
    rows = []
    path = dataset_root / "tensores" / "tensor_od.csv"
    for row in read_csv(path):
        rows.append(
            {
                "cluster_origem": row["cluster_origem"],
                "municipio_origem": row["municipio_origem"],
                "cluster_destino": row["cluster_destino"],
                "municipio_destino": row["municipio_destino"],
                "n_usuarios": to_int(row["n_usuarios"]),
                "n_viagens": to_int(row["n_viagens"]),
                "dist_media_km": row["dist_media_km"],
                "periodo_predominante": row["periodo_predominante"],
            }
        )
    rows.sort(key=lambda r: r["n_usuarios"], reverse=True)
    write_csv(
        out_dir / "fluxos_regionais.csv",
        rows,
        [
            "cluster_origem",
            "municipio_origem",
            "cluster_destino",
            "municipio_destino",
            "n_usuarios",
            "n_viagens",
            "dist_media_km",
            "periodo_predominante",
        ],
    )


def process_sinal(dataset_root: Path, out_dir: Path, antenas: dict[str, dict], mobility_path: Path | None) -> bool:
    if mobility_path is None:
        mobility_path = dataset_root / "tensores" / "tensor_mobilidade.csv"
    if not mobility_path.exists():
        return False

    counts = defaultdict(lambda: {"sessoes_3g": 0, "sessoes_4g": 0, "sessoes_5g": 0, "sessoes_outros": 0})
    rat_map = {"WCDMA": "sessoes_3g", "LTE": "sessoes_4g", "NR": "sessoes_5g"}

    for row in read_csv(mobility_path):
        ecgi = row.get("ecgi", "")
        rat = row.get("rat_type", "")
        bucket = rat_map.get(rat, "sessoes_outros")
        counts[ecgi][bucket] += to_int(row.get("n_sessoes", 1))

    rows = []
    for ecgi, item in antenas.items():
        c = counts[ecgi]
        tech_counts = {
            "3G": c["sessoes_3g"],
            "4G": c["sessoes_4g"],
            "5G": c["sessoes_5g"],
            "OUTROS": c["sessoes_outros"],
        }
        predominante = max(tech_counts, key=tech_counts.get) if sum(tech_counts.values()) else "SEM_DADO"
        rows.append(
            {
                **item,
                **c,
                "tecnologia_predominante": predominante,
            }
        )

    rows.sort(key=lambda r: (r["municipio"], r["cluster"], r["ecgi"]))
    write_csv(
        out_dir / "antenas_sinal_tratadas.csv",
        rows,
        [
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
        ],
    )
    return True


def write_report(out_dir: Path, signal_processed: bool, mobility_path: Path) -> None:
    status = "processado" if signal_processed else "pendente por ausência do tensor_mobilidade.csv"
    lines = [
        "# Validação local - Dataset Vísent/Anatel",
        "",
        "## Arquivos gerados",
        "",
        "- `antenas_tratadas.csv`",
        "- `concentracao_regional.csv`",
        "- `fluxos_regionais.csv`",
        "- `antenas_sinal_tratadas.csv` somente se `tensor_mobilidade.csv` estiver disponível",
        "",
        "## Status 3G/4G/5G",
        "",
        f"- Status: {status}",
        f"- Arquivo esperado: `{mobility_path}`",
        "",
        "A tecnologia de rede depende do campo `rat_type` no `tensor_mobilidade.csv`:",
        "",
        "- `WCDMA` = 3G",
        "- `LTE` = 4G",
        "- `NR` = 5G",
    ]
    (out_dir / "relatorio_validacao_dataset.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset-root", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--mobility-path", default=None)
    args = parser.parse_args()

    dataset_root = Path(args.dataset_root)
    out_dir = Path(args.out_dir)
    mobility_path = Path(args.mobility_path) if args.mobility_path else dataset_root / "tensores" / "tensor_mobilidade.csv"
    out_dir.mkdir(parents=True, exist_ok=True)

    antenas = load_antenas(dataset_root)
    process_antenas(antenas, out_dir)
    process_concentracao(dataset_root, out_dir)
    process_fluxos(dataset_root, out_dir)
    signal_processed = process_sinal(dataset_root, out_dir, antenas, mobility_path)
    write_report(out_dir, signal_processed, mobility_path)
    print(f"OK: arquivos gerados em {out_dir}")


if __name__ == "__main__":
    main()
