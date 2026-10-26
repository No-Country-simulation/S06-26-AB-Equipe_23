import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cadastrarCandidato, buscarRegioes } from '../../../lib/appbitApi';
import type { RegiaoItem, CandidatoCadastroPayload, CandidatoCadastroResponse } from '../../../lib/appbitTypes';
import './CadastroCandidato.css';

const SKILLS_SUGERIDAS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Python',
  'SQL',
  'Java',
  'Spring Boot',
  'Node.js',
  'Figma',
  'Docker',
  'AWS',
  'Power BI',
  'Git',
  'TailwindCSS',
  'ETL',
];

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

export default function CadastroCandidato() {
  const navigate = useNavigate();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [cargo, setCargo] = useState('');
  const [nivel, setNivel] = useState('Júnior');
  const [anosExperiencia, setAnosExperiencia] = useState<number>(1);
  const [disponibilidade, setDisponibilidade] = useState('Híbrido');
  const [regiaoId, setRegiaoId] = useState<number>(1);
  const [regioes, setRegioes] = useState<RegiaoItem[]>([]);
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript']);
  const [skillInput, setSkillInput] = useState('');
  const [diversidade, setDiversidade] = useState('Nenhuma / Prefiro não informar');
  const [consentimentoLgpd, setConsentimentoLgpd] = useState(false);

  // Estados de controle e feedback
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<CandidatoCadastroResponse | null>(null);

  // Carrega lista de regiões
  useEffect(() => {
    async function carregarRegioes() {
      try {
        const dados = await buscarRegioes();
        if (dados && dados.length > 0) {
          setRegioes(dados);
          setRegiaoId(dados[0].id);
        }
      } catch {
        // Fallback para regiões de Florianópolis caso a API esteja inicializando
        setRegioes([
          { id: 1, municipio: 'Centro - Florianópolis', cluster: 'Centro' },
          { id: 2, municipio: 'Trindade - Florianópolis', cluster: 'Bacia do Itacorubi' },
          { id: 3, municipio: 'Ingleses - Florianópolis', cluster: 'Norte da Ilha' },
          { id: 4, municipio: 'Campeche - Florianópolis', cluster: 'Sul da Ilha' },
          { id: 5, municipio: 'Coqueiros - Florianópolis', cluster: 'Continente' },
        ]);
      }
    }
    carregarRegioes();
  }, []);

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const clean = skillInput.trim();
      if (clean && !skills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
        setSkills([...skills, clean]);
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro('Por favor, informe seu nome completo.');
      return;
    }

    if (!cargo.trim()) {
      setErro('Por favor, informe o cargo desejado.');
      return;
    }

    if (!consentimentoLgpd) {
      setErro('É necessário concordar com os termos de consentimento e LGPD para prosseguir.');
      return;
    }

    setLoading(true);

    try {
      const regiaoSelecionada = regioes.find((r) => r.id === Number(regiaoId));

      const payload: CandidatoCadastroPayload = {
        nome: nome.trim(),
        cargo: cargo.trim(),
        nivel,
        anosExperiencia: Number(anosExperiencia),
        disponibilidade,
        regiaoId: Number(regiaoId),
        municipio: regiaoSelecionada?.municipio || 'Florianópolis',
        cluster: regiaoSelecionada?.cluster || 'Geral',
        skills,
        grupo: diversidade !== 'Nenhuma / Prefiro não informar' ? diversidade : undefined,
        diversidade: diversidade !== 'Nenhuma / Prefiro não informar' ? diversidade : undefined,
        email: email.trim() || undefined,
        telefone: telefone.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        ativo: true,
        consentimentoLgpd: true,
      };

      const resultado = await cadastrarCandidato(payload);
      setSucesso(resultado);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao cadastrar perfil. Verifique sua conexão e tente novamente.';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-candidato-page">
      <nav className="portal-nav-bar">
        <Link to="/" className="portal-logo-link">
          <div className="portal-logo-icon">BiT</div>
          <span>App BiT</span>
        </Link>
        <Link to="/login" className="portal-back-btn">
          ← Área do Recrutador
        </Link>
      </nav>

      <main className="portal-main-card">
        {sucesso ? (
          <div className="portal-success-card">
            <div className="portal-success-icon">✓</div>
            <div className="portal-badge-pill">Perfil Criado com Sucesso</div>
            <h2 className="portal-title">Bem-vindo(a) ao Banco de Talentos App BiT!</h2>
            <p className="portal-subtitle">
              Seu perfil agora faz parte do nosso algoritmo de matching anti-viés.
              Ele foi anonimizado para a fase de triagem inicial.
            </p>

            <div className="portal-alias-badge">
              Identificador Anônimo: Candidato A-{String(sucesso.id).padStart(3, '0')}
            </div>

            <div className="portal-success-details">
              <div className="portal-success-row">
                <span className="label">Cargo Alvo:</span>
                <span className="value">{cargo}</span>
              </div>
              <div className="portal-success-row">
                <span className="label">Senioridade:</span>
                <span className="value">{nivel} ({anosExperiencia} {anosExperiencia === 1 ? 'ano' : 'anos'})</span>
              </div>
              <div className="portal-success-row">
                <span className="label">Modalidade:</span>
                <span className="value">{disponibilidade}</span>
              </div>
              <div className="portal-success-row">
                <span className="label">Competências cadastradas:</span>
                <span className="value">{skills.join(', ') || 'Nenhuma informada'}</span>
              </div>
              <div className="portal-success-row">
                <span className="label">Privacidade LGPD:</span>
                <span className="value" style={{ color: '#10B981' }}>✓ Blind Screening Ativo</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setSucesso(null);
                  setNome('');
                  setCargo('');
                  setSkills(['React', 'TypeScript']);
                }}
                className="portal-quick-skill-btn"
                style={{ padding: '10px 20px', fontSize: 14 }}
              >
                Cadastrar Outro Perfil
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="portal-submit-btn"
                style={{ padding: '0 24px' }}
              >
                Ir para o Início
              </button>
            </div>
          </div>
        ) : (
          <>
            <header className="portal-header">
              <div className="portal-badge-pill">Portal de Carreiras Inclusivas</div>
              <h1 className="portal-title">Cadastre seu Perfil Profissional</h1>
              <p className="portal-subtitle">
                Conecte-se com oportunidades em empresas que praticam contratação justa,
                baseada em habilidades e com compromisso real com ESG e diversidade.
              </p>
            </header>

            {/* Banner de Blind Screening / LGPD */}
            <div className="portal-banner-esg">
              <div className="portal-banner-icon">🛡️</div>
              <div className="portal-banner-text">
                <h4>Garantia de Avaliação Cega (Blind Screening)</h4>
                <p>
                  No App BiT, suas competências técnicas e experiências vêm em primeiro lugar.
                  Suas informações de contato e nome completo permanecem protegidos durante a triagem inicial,
                  eliminando vieses inconscientes no processo de seleção.
                </p>
              </div>
            </div>

            {erro && (
              <div className="portal-error-alert">
                <span>⚠️</span>
                <span>{erro}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Seção 1: Dados Pessoais */}
              <section className="portal-section">
                <h3 className="portal-section-title">
                  <span className="section-num">1</span>
                  Dados de Identificação & Contato
                </h3>

                <div className="portal-field">
                  <label htmlFor="cand-nome">
                    Nome Completo <span className="required">*</span>
                  </label>
                  <input
                    id="cand-nome"
                    type="text"
                    className="portal-input"
                    placeholder="Ex: Mariana Costa"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className="portal-grid-2">
                  <div className="portal-field">
                    <label htmlFor="cand-email">E-mail corporativo / pessoal</label>
                    <input
                      id="cand-email"
                      type="email"
                      className="portal-input"
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="portal-field">
                    <label htmlFor="cand-telefone">Telefone / WhatsApp</label>
                    <input
                      id="cand-telefone"
                      type="tel"
                      className="portal-input"
                      placeholder="+55 (48) 99999-9999"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="portal-field">
                  <label htmlFor="cand-linkedin">
                    LinkedIn / Portfólio / GitHub <span className="optional">(opcional)</span>
                  </label>
                  <input
                    id="cand-linkedin"
                    type="url"
                    className="portal-input"
                    placeholder="https://linkedin.com/in/seu-perfil"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
              </section>

              {/* Seção 2: Perfil Profissional */}
              <section className="portal-section">
                <h3 className="portal-section-title">
                  <span className="section-num">2</span>
                  Perfil Profissional & Pretensão
                </h3>

                <div className="portal-grid-2">
                  <div className="portal-field">
                    <label htmlFor="cand-cargo">
                      Cargo Alvo / Especialidade <span className="required">*</span>
                    </label>
                    <input
                      id="cand-cargo"
                      type="text"
                      className="portal-input"
                      placeholder="Ex: Desenvolvedor Front-end, Analista de Dados"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="portal-field">
                    <label htmlFor="cand-nivel">Nível de Senioridade</label>
                    <select
                      id="cand-nivel"
                      className="portal-select"
                      value={nivel}
                      onChange={(e) => setNivel(e.target.value)}
                    >
                      {NIVEIS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="portal-grid-2">
                  <div className="portal-field">
                    <label htmlFor="cand-anos">Anos de Experiência na Área</label>
                    <input
                      id="cand-anos"
                      type="number"
                      min="0"
                      max="40"
                      className="portal-input"
                      value={anosExperiencia}
                      onChange={(e) => setAnosExperiencia(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                  </div>
                  <div className="portal-field">
                    <label htmlFor="cand-modalidade">Modelo de Trabalho Preferido</label>
                    <select
                      id="cand-modalidade"
                      className="portal-select"
                      value={disponibilidade}
                      onChange={(e) => setDisponibilidade(e.target.value)}
                    >
                      {MODELOS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="portal-field">
                  <label htmlFor="cand-regiao">Região / Cidade de Residência</label>
                  <select
                    id="cand-regiao"
                    className="portal-select"
                    value={regiaoId}
                    onChange={(e) => setRegiaoId(Number(e.target.value))}
                  >
                    {regioes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.municipio} {r.cluster ? `(${r.cluster})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              {/* Seção 3: Habilidades & Skills */}
              <section className="portal-section">
                <h3 className="portal-section-title">
                  <span className="section-num">3</span>
                  Habilidades & Tecnologias (Skills)
                </h3>

                <div className="portal-skills-container">
                  <div className="portal-skill-tags-selected">
                    {skills.length === 0 ? (
                      <span style={{ fontSize: 13, color: '#9CA3AF' }}>
                        Nenhuma competência selecionada. Clique nas sugestões abaixo ou digite uma nova.
                      </span>
                    ) : (
                      skills.map((skill) => (
                        <span key={skill} className="portal-skill-badge">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            title={`Remover ${skill}`}
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  <div className="portal-field" style={{ marginBottom: 4 }}>
                    <input
                      type="text"
                      className="portal-input"
                      placeholder="Adicione outra competência e pressione Enter..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddCustomSkill}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>
                      Sugestões mais buscadas:
                    </span>
                    <div className="portal-quick-skills">
                      {SKILLS_SUGERIDAS.map((skill) => {
                        const isSelected = skills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            className={`portal-quick-skill-btn ${isSelected ? 'active' : ''}`}
                            onClick={() => toggleSkill(skill)}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção 4: Diversidade & Inclusão (ESG) */}
              <section className="portal-section">
                <h3 className="portal-section-title">
                  <span className="section-num">4</span>
                  Diversidade & Ações Afirmativas ESG{' '}
                  <span style={{ fontSize: 12, fontWeight: 400, color: '#6B7280' }}>(Opcional)</span>
                </h3>

                <div className="portal-field">
                  <label htmlFor="cand-diversidade">
                    Você se identifica com algum grupo sub-representado?
                  </label>
                  <select
                    id="cand-diversidade"
                    className="portal-select"
                    value={diversidade}
                    onChange={(e) => setDiversidade(e.target.value)}
                  >
                    {DIVERSIDADES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#64748B' }}>
                    Esta autodeclaração é utilizada estritamente para impulsionar sua candidatura
                    em vagas afirmativas com metas ESG.
                  </p>
                </div>
              </section>

              {/* Seção 5: LGPD e Consentimento */}
              <section className="portal-section">
                <div className="portal-lgpd-box">
                  <input
                    type="checkbox"
                    id="lgpd-consent"
                    className="portal-checkbox"
                    checked={consentimentoLgpd}
                    onChange={(e) => setConsentimentoLgpd(e.target.checked)}
                    required
                  />
                  <label htmlFor="lgpd-consent" className="portal-lgpd-label">
                    Declaro que li e concordo com os Termos de Uso e autorizo o processamento
                    dos meus dados profissionais na plataforma <strong>App BiT</strong> para fins de
                    participação em processos seletivos e cálculo do score de afinidade com vagas,
                    em conformidade com a <strong>LGPD (Lei Geral de Proteção de Dados)</strong>.
                  </label>
                </div>
              </section>

              {/* Ações */}
              <div className="portal-actions">
                <button
                  type="submit"
                  className="portal-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Cadastrando seu perfil...' : 'Concluir Cadastro no App BiT →'}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
