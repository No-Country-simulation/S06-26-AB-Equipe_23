import { useEffect, useMemo, useState, useRef } from 'react';
import { buscarInsightsRegioes, buscarAlertasEsg } from '../../lib/appbitApi';
import type { RegiaoInsight, AlertaEsg } from '../../lib/appbitTypes';
import { formatarClusterMvp, formatarTextoMvp } from '../../lib/formatarTextoMvp';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

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

function formatarPeriodoPico(value: string) {
  return formatarTextoMvp(value.toLowerCase()).replace(/^\w/, (char) => char.toUpperCase());
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
  const [alertas, setAlertas] = useState<AlertaEsg[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [erro, setErro] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [tecnologia, setTecnologia] = useState('');
  const [cluster, setCluster] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

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
  const usuariosObservados = filtradas.reduce((acc, item) => acc + item.usuarios_observados_total, 0);
  const topRegioes = [...filtradas].sort((a, b) => b.total_sessoes - a.total_sessoes).slice(0, 8);
  const maxSessoes = Math.max(1, ...topRegioes.map((r) => r.total_sessoes));

  useEffect(() => {
    buscarInsightsRegioes()
      .then((data) => setRegioes(data.regioes))
      .catch(() => setErro('Não foi possível carregar /insights/regioes. Nenhum dado fictício foi usado como fallback.'));

    buscarAlertasEsg()
      .then((data) => setAlertas(data))
      .catch((err) => console.error('Erro ao obter alertas ESG:', err));
  }, []);

  useEffect(() => {
    const checkAndInit = () => {
      if (window.L) {
        setMapLoaded(true);
      }
    };

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.onload = checkAndInit;
      document.head.appendChild(link);
    } else {
      checkAndInit();
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = checkAndInit;
      document.head.appendChild(script);
    } else {
      checkAndInit();
    }
  }, []);

  useEffect(() => {
    if (!window.L || !mapLoaded || filtradas.length === 0) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const mapContainer = document.getElementById('map-leaflet');
    if (!mapContainer) return;

    const map = window.L.map('map-leaflet').setView([-27.5969, -48.5495], 11);
    mapRef.current = map;

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    filtradas.forEach((regiao) => {
      if (regiao.lat_media && regiao.lon_media) {
        const radius = Math.max(7, Math.min(18, regiao.qtd_antenas * 1.2));
        const color = tecnologiaCores[regiao.tecnologia_predominante_regiao] || '#7C3AED';

        const circle = window.L.circleMarker([regiao.lat_media, regiao.lon_media], {
          radius: radius,
          fillColor: color,
          color: '#111827',
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.65
        }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; min-width: 150px;">
            <strong style="font-size: 13px; color: #111827; display: block; margin-bottom: 4px;">
              ${formatarClusterMvp(regiao.cluster)}
            </strong>
            <b>Município:</b> ${formatarTextoMvp(regiao.municipio)}<br/>
            <b>Tecnologia:</b> 
            <span style="background: ${color}; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; display: inline-block; margin-top: 2px;">
              ${regiao.tecnologia_predominante_regiao}
            </span><br/>
            <div style="margin-top: 6px; border-top: 1px solid #e5e7eb; padding-top: 4px;">
              <b>Antenas:</b> ${formatNumber(regiao.qtd_antenas)}<br/>
              <b>Sessões:</b> ${formatNumber(regiao.total_sessoes)}
            </div>
          </div>
        `;
        circle.bindPopup(popupContent);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapLoaded, filtradas]);




  return (
    <div className="responsive-panel" style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 24, margin: 0, color: '#111827' }}>Insights Regionais</h1>
        <p style={{ color: '#6b7280', fontSize: 13, margin: '6px 0 0' }}>
          Antenas da Anatel e sessões 3G, 4G e 5G observadas no dataset Vísent.
        </p>
        {erro && <p style={{ color: '#b91c1c', fontSize: 13 }}>{erro}</p>}
      </div>

      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
        <Card label="Regiões Derivadas" value={filtradas.length} />
        <Card label="Municípios" value={new Set(filtradas.map((r) => r.municipio)).size} />
        <Card label="Antenas" value={formatNumber(totalAntenas)} />
        <Card label="Sessões Observadas" value={formatNumber(totalSessoes)} />
        <Card label="Usuários Observados*" value={formatNumber(usuariosObservados)} />
      </div>

      {alertas.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
            🌱 Alertas e Sugestões ESG (Inclusão Digital & Humana)
          </h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {alertas.map((alerta, index) => {
              let bgColor = '#f0fdf4';
              let borderColor = '#bbf7d0';
              let textColor = '#166534';
              let icon = 'ℹ️';

              if (alerta.gravidade === 'DANGER') {
                bgColor = '#fef2f2';
                borderColor = '#fca5a5';
                textColor = '#991b1b';
                icon = '🚨';
              } else if (alerta.gravidade === 'WARNING') {
                bgColor = '#fffbeb';
                borderColor = '#fde68a';
                textColor = '#92400e';
                icon = '⚠️';
              } else if (alerta.gravidade === 'INFO') {
                bgColor = '#f0f9ff';
                borderColor = '#bae6fd';
                textColor = '#075985';
                icon = '💡';
              }

              return (
                <div key={index} style={{
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: textColor, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {icon} {alerta.titulo}
                    </strong>
                    <span style={{ fontSize: 11, background: '#fff', border: `1px solid ${borderColor}`, borderRadius: 4, padding: '2px 6px', color: textColor, fontWeight: 600 }}>
                      {alerta.regiao}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0', fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
                    {alerta.descricao}
                  </p>
                  <div style={{ fontSize: 11, color: textColor, fontWeight: 500, marginTop: 4, paddingLeft: 6, borderLeft: `2px solid ${borderColor}` }}>
                    <strong>Ação Recomendada:</strong> {alerta.acaoRecomendada}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="insights-layout" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
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

        <section className="insights-content-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 12px' }}>Distribuição Geográfica das Regiões</h3>
            <div id="map-leaflet" style={{ width: '100%', height: 360, borderRadius: 8, border: '1px solid #e5e7eb', zIndex: 1 }} />
            <p style={{ color: '#6b7280', fontSize: 11, marginTop: 8 }}>
              Cor = tecnologia predominante. O mapa exibe marcadores interativos do OpenStreetMap com zoom e detalhes ao clicar.
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 12px' }}>Top Regiões por Sessões</h3>
            {topRegioes.map((regiao) => (
              <div key={`${regiao.municipio}-${regiao.cluster}`} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}><span>{formatarClusterMvp(regiao.cluster)}</span><strong>{formatNumber(regiao.total_sessoes)}</strong></div>
                <div style={{ height: 8, background: '#ede9fe', borderRadius: 999, marginTop: 4 }}><div style={{ width: `${Math.max(8, (regiao.total_sessoes / maxSessoes) * 100)}%`, height: 8, background: '#6C3FC5', borderRadius: 999 }} /></div>
              </div>
            ))}
          </div>

          <div style={{ gridColumn: '1 / -1', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 12px' }}>Dados Observados por Região</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {filtradas.map((regiao) => (
                <article
                  key={`${regiao.municipio}-${regiao.cluster}`}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    padding: 14,
                    background: '#f9fafb',
                    display: 'grid',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', color: '#111827', fontSize: 13 }}>
                        {formatarTextoMvp(regiao.municipio)}
                      </h4>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: 12, lineHeight: 1.35 }}>
                        {formatarClusterMvp(regiao.cluster)}
                      </p>
                    </div>
                    <span style={{
                      background: tecnologiaCores[regiao.tecnologia_predominante_regiao],
                      color: '#fff',
                      borderRadius: 999,
                      padding: '4px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}>
                      {regiao.tecnologia_predominante_regiao}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    <MiniMetric label="3G" value={`${regiao.percentual_3g.toFixed(2)}%`} />
                    <MiniMetric label="4G" value={`${regiao.percentual_4g.toFixed(2)}%`} />
                    <MiniMetric label="5G" value={`${regiao.percentual_5g.toFixed(2)}%`} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    <MiniMetric label="Antenas" value={formatNumber(regiao.qtd_antenas)} />
                    <MiniMetric label="Sessões" value={formatNumber(regiao.total_sessoes)} />
                    <MiniMetric label="Concentração" value={regiao.indice_concentracao_relativa.toFixed(1)} />
                    <MiniMetric label="Pico" value={formatarPeriodoPico(regiao.periodo_pico)} />
                  </div>
                </article>
              ))}
            </div>
            <p style={{ color: '#6b7280', fontSize: 11 }}>*Soma de observações agregadas no tensor; não representa população única.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px' }}>
      <div style={{ color: '#6b7280', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
      <div style={{ color: '#111827', fontSize: 12, fontWeight: 700, lineHeight: 1.25 }}>{value}</div>
    </div>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <><label style={{ display: 'block', fontSize: 12, fontWeight: 600, margin: '10px 0 4px' }}>{label}</label><select value={value} onChange={(event) => onChange(event.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 8 }}><option value="">Todos</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></>;
}
