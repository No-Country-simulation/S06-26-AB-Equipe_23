import { useEffect, useMemo, useState } from 'react';
import { buscarInsightsRegioes } from '../../lib/appbitApi';
import type { RegiaoInsight } from '../../lib/appbitTypes';

const tecnologiaCores: Record<RegiaoInsight['tecnologia_predominante_regiao'], string> = {
  '3G': '#F59E0B',
  '4G': '#2563EB',
  '5G': '#16A34A',
  OUTROS: '#7C3AED',
  SEM_DADO: '#6B7280',
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 14 }}>
      <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 8 }}>{label}</div>
      <div style={{ color: '#111827', fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function PainelInsightsRegionais() {
  const [regioes, setRegioes] = useState<RegiaoInsight[]>([]);
  const [erro, setErro] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [tecnologia, setTecnologia] = useState('');
  const [cluster, setCluster] = useState('');

  useEffect(() => {
    buscarInsightsRegioes()
      .then((data) => setRegioes(data.regioes))
      .catch(() => setErro('Não foi possível carregar /insights/regioes. Nenhum dado fictício foi usado como fallback.'));
  }, []);

  const municipios = useMemo(() => [...new Set(regioes.map((r) => r.municipio))].sort(), [regioes]);
  const tecnologias = useMemo(
    () => [...new Set(regioes.map((r) => r.tecnologia_predominante_regiao))].sort(),
    [regioes],
  );

  const filtradas = regioes.filter((regiao) => {
    if (municipio && regiao.municipio !== municipio) return false;
    if (tecnologia && regiao.tecnologia_predominante_regiao !== tecnologia) return false;
    return !cluster || regiao.cluster.toLowerCase().includes(cluster.toLowerCase());
  });

  const totalAntenas = filtradas.reduce((acc, item) => acc + item.qtd_antenas, 0);
  const totalSessoes = filtradas.reduce((acc, item) => acc + item.total_sessoes, 0);
  const topRegioes = [...filtradas].sort((a, b) => b.total_sessoes - a.total_sessoes).slice(0, 8);
  const maxSessoes = Math.max(1, ...topRegioes.map((r) => r.total_sessoes));
  const latitudes = regioes.map((r) => r.lat_media);
  const longitudes = regioes.map((r) => r.lon_media);
  const minLat = latitudes.length ? Math.min(...latitudes) : 0;
  const maxLat = latitudes.length ? Math.max(...latitudes) : 1;
  const minLon = longitudes.length ? Math.min(...longitudes) : 0;
  const maxLon = longitudes.length ? Math.max(...longitudes) : 1;

  const mapX = (lon: number) => 28 + ((lon - minLon) / Math.max(maxLon - minLon, 0.0001)) * 84;
  const mapY = (lat: number) => 88 - ((lat - minLat) / Math.max(maxLat - minLat, 0.0001)) * 76;

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 24, margin: 0, color: '#111827' }}>Insights Regionais</h1>
        <p style={{ color: '#6b7280', fontSize: 13, margin: '6px 0 0' }}>
          Antenas da Anatel e sessões 3G, 4G e 5G observadas no dataset Vísent.
        </p>
        {erro && <p style={{ color: '#b91c1c', fontSize: 13 }}>{erro}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
        <Card label="Regiões derivadas" value={filtradas.length} />
        <Card label="Municípios" value={new Set(filtradas.map((r) => r.municipio)).size} />
        <Card label="Antenas" value={formatNumber(totalAntenas)} />
        <Card label="Sessões observadas" value={formatNumber(totalSessoes)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <aside style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 14, height: 'fit-content' }}>
          <h3 style={{ fontSize: 14, margin: '0 0 12px' }}>Filtros</h3>
          <Filter label="Município" value={municipio} onChange={setMunicipio} options={municipios} />
          <Filter label="Tecnologia predominante" value={tecnologia} onChange={setTecnologia} options={tecnologias} />
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, margin: '10px 0 4px' }}>Cluster</label>
          <input value={cluster} onChange={(event) => setCluster(event.target.value)} placeholder="Nome do cluster" style={{ width: '100%', boxSizing: 'border-box', padding: 8, border: '1px solid #d1d5db', borderRadius: 8 }} />
          <button type="button" onClick={() => { setMunicipio(''); setTecnologia(''); setCluster(''); }} style={{ marginTop: 12, width: '100%', padding: 9, border: 'none', borderRadius: 8, background: '#6C3FC5', color: '#fff', cursor: 'pointer' }}>
            Limpar filtros
          </button>
        </aside>

        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 12px' }}>Distribuição geográfica das regiões</h3>
            <svg viewBox="0 0 120 96" style={{ width: '100%', height: 360, background: '#edf7f0', borderRadius: 8 }}>
              {filtradas.map((regiao) => (
                <g key={`${regiao.municipio}-${regiao.cluster}`}>
                  <circle cx={mapX(regiao.lon_media)} cy={mapY(regiao.lat_media)} r={Math.max(3.2, Math.min(8, regiao.qtd_antenas / 1.8))} fill={tecnologiaCores[regiao.tecnologia_predominante_regiao]} stroke="#111827" strokeWidth="0.4" />
                  <title>{`${regiao.municipio} - ${regiao.cluster}: ${regiao.tecnologia_predominante_regiao}`}</title>
                </g>
              ))}
            </svg>
            <p style={{ color: '#6b7280', fontSize: 11 }}>
              Cor = tecnologia com maior quantidade de sessões observadas. Isso não representa teste de velocidade nem garantia de cobertura.
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 12px' }}>Top regiões por sessões</h3>
            {topRegioes.map((regiao) => (
              <div key={`${regiao.municipio}-${regiao.cluster}`} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>{regiao.cluster}</span><strong>{formatNumber(regiao.total_sessoes)}</strong></div>
                <div style={{ height: 8, background: '#ede9fe', borderRadius: 999, marginTop: 4 }}><div style={{ width: `${Math.max(8, (regiao.total_sessoes / maxSessoes) * 100)}%`, height: 8, background: '#6C3FC5', borderRadius: 999 }} /></div>
              </div>
            ))}
          </div>

          <div style={{ gridColumn: '1 / -1', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 12px' }}>Dados observados por região</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead><tr style={{ color: '#6b7280', textAlign: 'left' }}><th>Município</th><th>Cluster</th><th>Tecnologia</th><th>3G</th><th>4G</th><th>5G</th><th>Antenas</th><th>Sessões</th></tr></thead>
                <tbody>{filtradas.map((regiao) => (
                  <tr key={`${regiao.municipio}-${regiao.cluster}`} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td>{regiao.municipio}</td><td>{regiao.cluster}</td><td>{regiao.tecnologia_predominante_regiao}</td><td>{regiao.percentual_3g.toFixed(2)}%</td><td>{regiao.percentual_4g.toFixed(2)}%</td><td>{regiao.percentual_5g.toFixed(2)}%</td><td>{regiao.qtd_antenas}</td><td>{formatNumber(regiao.total_sessoes)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <><label style={{ display: 'block', fontSize: 12, fontWeight: 600, margin: '10px 0 4px' }}>{label}</label><select value={value} onChange={(event) => onChange(event.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8 }}><option value="">Todos</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></>;
}
