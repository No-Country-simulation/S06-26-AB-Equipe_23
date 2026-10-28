import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  atualizarMeuPerfilCandidato,
  buscarMeuPerfilCandidato,
  buscarRegioes,
} from '../../../lib/appbitApi';
import type { CandidatoPerfil, CandidatoPerfilUpdate, RegiaoItem } from '../../../lib/appbitTypes';
import { clearAppSession } from '../../../lib/session';
import './CadastroCandidato.css';

const NIVEIS = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista'];
const MODELOS = ['Remoto', 'Híbrido', 'Presencial'];
const DIVERSIDADES = [
  'Nenhuma / Prefiro não informar',
  'Mulheres na Tecnologia',
  'Pessoas Negras (Pretas e Pardas)',
  'Pessoas com Deficiência (PcD)',
  'Comunidade LGBTQIA+',
  'Profissional 50+',
  'Indígena / Povos Tradicionais',
];

const perfilParaFormulario = (perfil: CandidatoPerfil): CandidatoPerfilUpdate => ({
  nome: perfil.nome,
  cargo: perfil.cargo,
  nivel: perfil.nivel,
  anosExperiencia: perfil.anosExperiencia ?? 0,
  disponibilidade: perfil.disponibilidade,
  regiaoId: perfil.regiaoId,
  telefone: perfil.telefone ?? '',
  linkedin: perfil.linkedin ?? '',
  grupo: perfil.grupo ?? '',
  diversidade: perfil.diversidade ?? '',
  skills: perfil.skills ?? [],
});

export default function PerfilCandidatoPage() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<CandidatoPerfil | null>(null);
  const [formData, setFormData] = useState<CandidatoPerfilUpdate | null>(null);
  const [skillsText, setSkillsText] = useState('');
  const [regioes, setRegioes] = useState<RegiaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([buscarMeuPerfilCandidato(), buscarRegioes()])
      .then(([candidate, availableRegions]) => {
        if (!active) return;
        const values = perfilParaFormulario(candidate);
        setPerfil(candidate);
        setFormData(values);
        setSkillsText(values.skills.join(', '));
        setRegioes(availableRegions);
      })
      .catch(() => {
        if (active) setErro('Não foi possível carregar seu perfil. Entre novamente e tente outra vez.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => {
      if (!current) return current;
      return {
        ...current,
        [name]: name === 'anosExperiencia' || name === 'regiaoId' ? Number(value) : value,
      };
    });
    setErro('');
    setMensagem('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData || saving) return;

    setSaving(true);
    setErro('');
    setMensagem('');
    try {
      const skills = [...new Set(skillsText.split(',').map((skill) => skill.trim()).filter(Boolean))];
      const updated = await atualizarMeuPerfilCandidato({ ...formData, skills });
      setPerfil(updated);
      setFormData(perfilParaFormulario(updated));
      setSkillsText(updated.skills.join(', '));
      setMensagem('Perfil atualizado com sucesso.');
    } catch {
      setErro('Não foi possível salvar as alterações. Confira os dados e tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAppSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="portal-candidato-page">
      <nav className="portal-nav-bar">
        <div className="portal-logo-link">
          <div className="portal-logo-icon">BiT</div>
          <span>App BiT</span>
        </div>
        <button type="button" className="portal-back-btn" onClick={handleLogout}>
          Sair da conta
        </button>
      </nav>

      <main className="portal-main-card">
        <header className="portal-header">
          <div className="portal-badge-pill">Portal do Candidato</div>
          <h1 className="portal-title">Gerencie seu perfil</h1>
          <p className="portal-subtitle">
            Mantenha seus dados profissionais atualizados para melhorar sua correspondência com as vagas.
          </p>
        </header>

        {loading && <p role="status">Carregando seu perfil...</p>}
        {erro && <div className="portal-error-alert" role="alert">{erro}</div>}
        {mensagem && <p role="status">{mensagem}</p>}

        {formData && perfil && (
          <form onSubmit={handleSubmit}>
            <section className="portal-section">
              <h2 className="portal-section-title">Dados da conta</h2>
              <div className="portal-field">
                <label htmlFor="perfil-email">E-mail da conta</label>
                <input id="perfil-email" className="portal-input" value={perfil.email} readOnly />
                <span className="optional">O e-mail de acesso não pode ser alterado por este formulário.</span>
              </div>
              <div className="portal-grid-2">
                <div className="portal-field">
                  <label htmlFor="perfil-nome">Nome completo</label>
                  <input id="perfil-nome" name="nome" className="portal-input" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="portal-field">
                  <label htmlFor="perfil-telefone">Telefone / WhatsApp</label>
                  <input id="perfil-telefone" name="telefone" className="portal-input" value={formData.telefone ?? ''} onChange={handleChange} />
                </div>
              </div>
              <div className="portal-field">
                <label htmlFor="perfil-linkedin">LinkedIn / Portfólio / GitHub</label>
                <input id="perfil-linkedin" name="linkedin" type="url" className="portal-input" value={formData.linkedin ?? ''} onChange={handleChange} />
              </div>
            </section>

            <section className="portal-section">
              <h2 className="portal-section-title">Perfil profissional</h2>
              <div className="portal-grid-2">
                <div className="portal-field">
                  <label htmlFor="perfil-cargo">Cargo desejado</label>
                  <input id="perfil-cargo" name="cargo" className="portal-input" value={formData.cargo} onChange={handleChange} required />
                </div>
                <div className="portal-field">
                  <label htmlFor="perfil-nivel">Senioridade</label>
                  <select id="perfil-nivel" name="nivel" className="portal-select" value={formData.nivel} onChange={handleChange}>
                    {NIVEIS.map((level) => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>
                <div className="portal-field">
                  <label htmlFor="perfil-anos">Anos de experiência</label>
                  <input id="perfil-anos" name="anosExperiencia" type="number" min="0" max="40" className="portal-input" value={formData.anosExperiencia} onChange={handleChange} required />
                </div>
                <div className="portal-field">
                  <label htmlFor="perfil-disponibilidade">Modelo de trabalho</label>
                  <select id="perfil-disponibilidade" name="disponibilidade" className="portal-select" value={formData.disponibilidade} onChange={handleChange}>
                    {MODELOS.map((model) => <option key={model} value={model}>{model}</option>)}
                  </select>
                </div>
              </div>
              <div className="portal-field">
                <label htmlFor="perfil-regiao">Região / cidade</label>
                <select id="perfil-regiao" name="regiaoId" className="portal-select" value={formData.regiaoId} onChange={handleChange} required>
                  {regioes.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.municipio}{region.cluster ? ` (${region.cluster})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="portal-field">
                <label htmlFor="perfil-skills">Competências (separadas por vírgula)</label>
                <input id="perfil-skills" className="portal-input" value={skillsText} onChange={(event) => setSkillsText(event.target.value)} />
              </div>
              <div className="portal-field">
                <label htmlFor="perfil-diversidade">Autodeclaração de diversidade</label>
                <select
                  id="perfil-diversidade"
                  name="diversidade"
                  className="portal-select"
                  value={formData.diversidade || DIVERSIDADES[0]}
                  onChange={(event) => {
                    const value = event.target.value === DIVERSIDADES[0] ? '' : event.target.value;
                    setFormData((current) => current ? { ...current, diversidade: value, grupo: value } : current);
                    setMensagem('');
                  }}
                >
                  {DIVERSIDADES.map((group) => <option key={group} value={group}>{group}</option>)}
                </select>
              </div>
            </section>

            <div className="portal-actions">
              <button type="submit" className="portal-submit-btn" disabled={saving || loading}>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
