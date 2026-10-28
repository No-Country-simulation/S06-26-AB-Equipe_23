import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../../../components/ui/Header.tsx';
import { clearAppSession } from '../../../lib/session';
import {
  aprovarCandidato,
  reprovarCandidato,
  buscarFeedbacksVaga,
  executarMatch,
  buscarVagaPorId,
  buscarVagas,
} from '../../../lib/appbitApi';
import type {
  CandidatoMatch,
  ContatoAprovado,
  MatchResponse,
  MatchRequest,
  VagaBackend,
  RejectedCandidateData,
} from '../../../lib/appbitTypes';
import { formatarNivelMvp, formatarSkillMvp, formatarTextoMvp } from '../../../lib/formatarTextoMvp';
import './shortlist.css';

const EMPRESA_ID = 'emp_001';

const MATCH_REQUEST: MatchRequest = {
  empresa_id: EMPRESA_ID,
  vaga: {
    titulo: 'Analista de Dados Júnior',
    skills: ['sql', 'python', 'power bi'],
    nivel: 'junior',
    modelo_trabalho: 'hibrido',
  },
  filtros: {
    anti_vies: true,
    limite_resultados: 8,
  },
};

const VAGA_OFICIAL = {
  titulo: 'Analista de Dados Júnior',
  area: 'Dados',
  modelo: 'Híbrido',
  local: 'Brasil',
  scoreESG: 92,
  nivel: 'Júnior',
};

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Mulher: { bg: '#F3EFFE', color: '#6D28D9' },
  'Mulher negra em tecnologia': { bg: '#EDE9FE', color: '#5B21B6' },
  'Pessoa com deficiencia': { bg: '#FEF3C7', color: '#92400E' },
  'Primeira geracao no ensino superior': { bg: '#DCFCE7', color: '#166534' },
  'Talento de baixa renda': { bg: '#FCE7F3', color: '#9D174D' },
  'Talento de regiao com menor acesso': { bg: '#FEF3C7', color: '#92400E' },
  'Perfil junior em formacao tecnica': { bg: '#E0F2FE', color: '#0369A1' },
  'Mulher em transicao de carreira para tecnologia': { bg: '#FCE7F3', color: '#9D174D' },
};

const MOTIVOS_REPROVACAO: Record<string, string> = {
  FIT_TECNICO: 'Competências técnicas insuficientes',
  PRETENSAO_SALARIAL: 'Pretensão salarial acima do orçamento',
  LOCALIDADE_MODELO: 'Incompatibilidade de região ou modelo de trabalho',
  SENIORIDADE: 'Senioridade / experiência divergente da vaga',
  COMUNICACAO_SOFT_SKILLS: 'Comunicação ou alinhamento interpessoal',
  OUTRO: 'Outro motivo',
};

function scoreStyle(s: number) {
  if (s >= 90) return { bg: '#DCFCE7', color: '#166534', ring: '#4ADE80' };
  if (s >= 80) return { bg: '#EDE9FE', color: '#5B21B6', ring: '#8B5CF6' };
  return { bg: '#FEF3C7', color: '#92400E', ring: '#F59E0B' };
}

function getCandidateSkills(candidate: CandidatoMatch) {
  return Array.isArray(candidate.skills) ? candidate.skills : [];
}

function firstSkillLabel(candidate: CandidatoMatch) {
  const skills = getCandidateSkills(candidate);
  return skills.length ? skills.map(formatarSkillMvp).join(', ') : 'Não informado';
}

function isContatoAprovado(value: unknown): value is ContatoAprovado {
  if (!value || typeof value !== 'object') return false;
  const contato = (value as Partial<ContatoAprovado>).contato_liberado;
  return Boolean(
    contato &&
      typeof contato.nome === 'string' &&
      typeof contato.email === 'string' &&
      typeof contato.telefone === 'string' &&
      typeof contato.linkedin === 'string'
  );
}

function getApprovedContactsStorageKey(vagaId: string) {
  return `appbit:shortlist:approved:${EMPRESA_ID}:vaga:${vagaId}`;
}

function loadApprovedContacts(storageKey: string): Record<string, ContatoAprovado> {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== 'object') return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => isContatoAprovado(value))
    ) as Record<string, ContatoAprovado>;
  } catch {
    return {};
  }
}

function saveApprovedContacts(storageKey: string, contacts: Record<string, ContatoAprovado>) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(contacts));
  } catch {
    // Se o navegador bloquear armazenamento local, a aprovação segue válida na sessão atual.
  }
}

function getRejectedCandidatesStorageKey(vagaId: string) {
  return `appbit:shortlist:rejected:${EMPRESA_ID}:vaga:${vagaId}`;
}

function loadRejectedCandidates(storageKey: string): Record<string, RejectedCandidateData> {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, RejectedCandidateData>;
  } catch {
    return {};
  }
}

function saveRejectedCandidates(storageKey: string, rejected: Record<string, RejectedCandidateData>) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(rejected));
  } catch {
    // fallback em memória
  }
}

function getApprovalNotesStorageKey(vagaId: string) {
  return `appbit:shortlist:notes:${EMPRESA_ID}:vaga:${vagaId}`;
}

function loadApprovalNotes(storageKey: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveApprovalNotes(storageKey: string, notes: Record<string, string>) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  } catch {
    // fallback em memória
  }
}

export default function ShortList() {
  const navigate = useNavigate();
  const { vagaId: paramVagaId } = useParams();
  const [searchParams] = useSearchParams();
  const vagaId = searchParams.get('vaga') ?? paramVagaId ?? 'mvp-oficial';
  const approvedContactsStorageKey = useMemo(() => getApprovedContactsStorageKey(vagaId), [vagaId]);
  const rejectedStorageKey = useMemo(() => getRejectedCandidatesStorageKey(vagaId), [vagaId]);
  const notesStorageKey = useMemo(() => getApprovalNotesStorageKey(vagaId), [vagaId]);

  const [todasVagas, setTodasVagas] = useState<VagaBackend[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [vagaAtual, setVagaAtual] = useState({
    titulo: VAGA_OFICIAL.titulo,
    area: VAGA_OFICIAL.area,
    modelo: VAGA_OFICIAL.modelo,
    local: VAGA_OFICIAL.local,
    scoreESG: VAGA_OFICIAL.scoreESG,
    nivel: VAGA_OFICIAL.nivel,
    isCustom: false,
  });
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [error, setError] = useState('');
  const [revealing, setRevealing] = useState<string | null>(null);
  const [approvalError, setApprovalError] = useState<Record<string, string>>({});
  const [approvedContacts, setApprovedContacts] = useState<Record<string, ContatoAprovado>>(() =>
    loadApprovedContacts(approvedContactsStorageKey)
  );
  const [rejectedCandidates, setRejectedCandidates] = useState<Record<string, RejectedCandidateData>>(() =>
    loadRejectedCandidates(rejectedStorageKey)
  );
  const [approvalNotes, setApprovalNotes] = useState<Record<string, string>>(() =>
    loadApprovalNotes(notesStorageKey)
  );

  // Estados dos modais de decisão
  const [candidatoModalAprovar, setCandidatoModalAprovar] = useState<CandidatoMatch | null>(null);
  const [anotacoesAprovar, setAnotacoesAprovar] = useState('');

  const [candidatoModalReprovar, setCandidatoModalReprovar] = useState<CandidatoMatch | null>(null);
  const [motivoReprovar, setMotivoReprovar] = useState('FIT_TECNICO');
  const [anotacoesReprovar, setAnotacoesReprovar] = useState('');

  // Toast de feedback
  const [toastMensagem, setToastMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Auto-dismiss do toast
  useEffect(() => {
    if (!toastMensagem) return;
    const timer = setTimeout(() => setToastMensagem(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMensagem]);

  // Carrega lista de vagas cadastradas para a sidebar e mobile select
  useEffect(() => {
    let ativo = true;
    buscarVagas()
      .then((vagas) => {
        if (ativo) setTodasVagas(vagas);
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApprovedContacts(loadApprovedContacts(approvedContactsStorageKey));
    setRejectedCandidates(loadRejectedCandidates(rejectedStorageKey));
    setApprovalNotes(loadApprovalNotes(notesStorageKey));
  }, [approvedContactsStorageKey, rejectedStorageKey, notesStorageKey]);

  // Sincroniza feedbacks persistidos no banco de dados para a vaga atual
  useEffect(() => {
    const idNum = Number(vagaId);
    const vagaIdParam = !isNaN(idNum) && idNum > 0 ? idNum : undefined;

    buscarFeedbacksVaga(EMPRESA_ID, vagaIdParam)
      .then((feedbacks) => {
        if (!Array.isArray(feedbacks) || feedbacks.length === 0) return;

        const novosRejeitados: Record<string, RejectedCandidateData> = {};
        const novasNotas: Record<string, string> = {};

        feedbacks.forEach((fb) => {
          if (fb.decisao === 'REPROVADO') {
            novosRejeitados[fb.candidato_id] = {
              candidato_id: fb.candidato_id,
              motivo: fb.motivo_rejeicao || 'OUTRO',
              anotacoes: fb.anotacoes_internas || '',
              registrado_em: fb.criado_em,
            };
          } else if (fb.decisao === 'APROVADO' && fb.anotacoes_internas) {
            novasNotas[fb.candidato_id] = fb.anotacoes_internas;
          }
        });

        if (Object.keys(novosRejeitados).length > 0) {
          setRejectedCandidates((prev) => {
            const merged = { ...prev, ...novosRejeitados };
            saveRejectedCandidates(rejectedStorageKey, merged);
            return merged;
          });
        }

        if (Object.keys(novasNotas).length > 0) {
          setApprovalNotes((prev) => {
            const merged = { ...prev, ...novasNotas };
            saveApprovalNotes(notesStorageKey, merged);
            return merged;
          });
        }
      })
      .catch(() => {
        // Modo offline ou fallback gracioso local
      });
  }, [vagaId, rejectedStorageKey, notesStorageKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCarregando(true);
    const idNum = Number(vagaId);
    if (!isNaN(idNum) && idNum > 0) {
      buscarVagaPorId(idNum)
        .then((vagaBackend) => {
          setVagaAtual({
            titulo: vagaBackend.titulo,
            area: vagaBackend.area || 'Dados',
            modelo: vagaBackend.modalidade || 'Híbrido',
            local: vagaBackend.regiaoAlvo?.municipio || 'Florianópolis / SC',
            scoreESG: vagaBackend.esgMatch ?? 90,
            nivel: vagaBackend.nivel || 'Júnior',
            isCustom: true,
          });

          const customRequest: MatchRequest = {
            empresa_id: vagaBackend.empresaId || EMPRESA_ID,
            vaga: {
              titulo: vagaBackend.titulo,
              skills: vagaBackend.skills || ['sql', 'python'],
              nivel: vagaBackend.nivel || 'junior',
              modelo_trabalho: vagaBackend.modalidade?.toLowerCase() || 'hibrido',
              regiao: vagaBackend.regiaoAlvo?.municipio || undefined,
            },
            filtros: {
              anti_vies: vagaBackend.antiVies ?? true,
              limite_resultados: 8,
              diversidade_minima: vagaBackend.diversidadeMinima ? Number(vagaBackend.diversidadeMinima) : undefined,
            },
          };

          return executarMatch(customRequest);
        })
        .then((response) => {
          setMatch(response);
          setError('');
        })
        .catch(() => {
          setError('Não foi possível carregar os detalhes da vaga customizada ou executar o match.');
        })
        .finally(() => {
          setCarregando(false);
        });
    } else {
      setVagaAtual({
        titulo: VAGA_OFICIAL.titulo,
        area: VAGA_OFICIAL.area,
        modelo: VAGA_OFICIAL.modelo,
        local: VAGA_OFICIAL.local,
        scoreESG: VAGA_OFICIAL.scoreESG,
        nivel: VAGA_OFICIAL.nivel,
        isCustom: false,
      });
      executarMatch(MATCH_REQUEST)
        .then((response) => {
          setMatch(response);
          setError('');
        })
        .catch(() => {
          setError('Não foi possível carregar o POST /match. A shortlist oficial depende do backend.');
        })
        .finally(() => {
          setCarregando(false);
        });
    }
  }, [vagaId]);

  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendentes' | 'aprovados' | 'reprovados'>('todos');
  const [filtroMinScore, setFiltroMinScore] = useState<number>(0);
  const [filtroBadge, setFiltroBadge] = useState<string>('');
  const [filtroRegiao, setFiltroRegiao] = useState<string>('');
  const [filtroModelo, setFiltroModelo] = useState<string>('');
  const [ordenacao, setOrdenacao] = useState<string>('score_desc');

  // Estados de paginação de candidatos
  const [paginaCandidatos, setPaginaCandidatos] = useState<number>(0);
  const [itensPorPagina, setItensPorPagina] = useState<number>(4);

  const candidatos = useMemo(() => match?.candidatos ?? [], [match]);

  const totalAprovados = useMemo(() => {
    return candidatos.filter((c) => isContatoAprovado(approvedContacts[c.candidato_id])).length;
  }, [candidatos, approvedContacts]);

  const totalReprovados = useMemo(() => {
    return candidatos.filter((c) => Boolean(rejectedCandidates[c.candidato_id])).length;
  }, [candidatos, rejectedCandidates]);

  const totalPendentes = useMemo(() => {
    return Math.max(0, candidatos.length - totalAprovados - totalReprovados);
  }, [candidatos.length, totalAprovados, totalReprovados]);

  const badgesDisponiveis = useMemo(() => {
    const set = new Set<string>();
    candidatos.forEach((c) => {
      if (c.badge_diversidade && c.badge_diversidade !== 'Sem badge informada' && c.badge_diversidade !== 'Nenhum') {
        set.add(c.badge_diversidade);
      }
    });
    return Array.from(set);
  }, [candidatos]);

  const regioesDisponiveis = useMemo(() => {
    const set = new Set<string>();
    candidatos.forEach((c) => {
      if (c.regiao && c.regiao.trim()) {
        set.add(c.regiao.trim());
      }
    });
    return Array.from(set).sort();
  }, [candidatos]);

  const candidatosFiltrados = useMemo(() => {
    return candidatos
      .filter((c) => {
        const aprovado = isContatoAprovado(approvedContacts[c.candidato_id]);
        const reprovado = Boolean(rejectedCandidates[c.candidato_id]);

        if (filtroStatus === 'aprovados' && !aprovado) return false;
        if (filtroStatus === 'reprovados' && !reprovado) return false;
        if (filtroStatus === 'pendentes' && (aprovado || reprovado)) return false;

        if (filtroMinScore > 0 && c.score_match < filtroMinScore) return false;
        if (filtroBadge && c.badge_diversidade !== filtroBadge) return false;
        if (filtroRegiao && !c.regiao?.toLowerCase().includes(filtroRegiao.toLowerCase())) return false;
        if (
          filtroModelo &&
          c.modelo_trabalho_preferido &&
          !c.modelo_trabalho_preferido.toLowerCase().includes(filtroModelo.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (ordenacao === 'score_desc') return b.score_match - a.score_match;
        if (ordenacao === 'score_asc') return a.score_match - b.score_match;
        if (ordenacao === 'exp_desc') return (b.anos_experiencia ?? 0) - (a.anos_experiencia ?? 0);
        return 0;
      });
  }, [
    candidatos,
    approvedContacts,
    rejectedCandidates,
    filtroStatus,
    filtroMinScore,
    filtroBadge,
    filtroRegiao,
    filtroModelo,
    ordenacao,
  ]);

  const totalPaginasCandidatos = Math.max(1, Math.ceil(candidatosFiltrados.length / itensPorPagina));

  const candidatosPaginados = useMemo(() => {
    if (itensPorPagina >= 999) return candidatosFiltrados;
    const inicio = paginaCandidatos * itensPorPagina;
    return candidatosFiltrados.slice(inicio, inicio + itensPorPagina);
  }, [candidatosFiltrados, paginaCandidatos, itensPorPagina]);

  const indiceInicio = candidatosFiltrados.length === 0 ? 0 : paginaCandidatos * itensPorPagina + 1;
  const indiceFim = Math.min((paginaCandidatos + 1) * itensPorPagina, candidatosFiltrados.length);

  const averageScore = useMemo(() => {
    if (!candidatosFiltrados.length) return 0;
    return Math.round(candidatosFiltrados.reduce((sum, item) => sum + item.score_match, 0) / candidatosFiltrados.length);
  }, [candidatosFiltrados]);

  // Handlers dos Modais de Decisão
  function abrirModalAprovar(candidato: CandidatoMatch) {
    setCandidatoModalAprovar(candidato);
    setAnotacoesAprovar(approvalNotes[candidato.candidato_id] || '');
  }

  function fecharModalAprovar() {
    setCandidatoModalAprovar(null);
    setAnotacoesAprovar('');
  }

  async function handleConfirmarAprovacao() {
    if (!candidatoModalAprovar) return;
    const candidateId = candidatoModalAprovar.candidato_id;
    const idNum = Number(vagaId);
    const vagaIdNum = !isNaN(idNum) && idNum > 0 ? idNum : undefined;

    setRevealing(candidateId);
    setApprovalError((prev) => ({ ...prev, [candidateId]: '' }));

    try {
      const contato = await aprovarCandidato({
        candidato_id: candidateId,
        empresa_id: EMPRESA_ID,
        vaga_id: vagaIdNum,
        anotacoes: anotacoesAprovar.trim() || undefined,
      });

      setApprovedContacts((prev) => {
        const next = { ...prev, [candidateId]: contato };
        saveApprovedContacts(approvedContactsStorageKey, next);
        return next;
      });

      if (anotacoesAprovar.trim()) {
        setApprovalNotes((prev) => {
          const next = { ...prev, [candidateId]: anotacoesAprovar.trim() };
          saveApprovalNotes(notesStorageKey, next);
          return next;
        });
      }

      // Se estava como rejeitado, remove do estado de rejeição
      setRejectedCandidates((prev) => {
        if (!prev[candidateId]) return prev;
        const copy = { ...prev };
        delete copy[candidateId];
        saveRejectedCandidates(rejectedStorageKey, copy);
        return copy;
      });

      setToastMensagem({
        tipo: 'sucesso',
        texto: `Candidato ${contato.apelido_exibicao || candidateId} aprovado! Dados de contato liberados.`,
      });
      fecharModalAprovar();
    } catch {
      setApprovalError((prev) => ({
        ...prev,
        [candidateId]: 'Aprovação não confirmada pelo backend. Dados sensíveis permanecem ocultos.',
      }));
      setToastMensagem({
        tipo: 'erro',
        texto: 'Não foi possível confirmar a aprovação no servidor.',
      });
    } finally {
      setRevealing(null);
    }
  }

  function abrirModalReprovar(candidato: CandidatoMatch) {
    setCandidatoModalReprovar(candidato);
    const dadosRejeicaoExistente = rejectedCandidates[candidato.candidato_id];
    setMotivoReprovar(dadosRejeicaoExistente?.motivo || 'FIT_TECNICO');
    setAnotacoesReprovar(dadosRejeicaoExistente?.anotacoes || '');
  }

  function fecharModalReprovar() {
    setCandidatoModalReprovar(null);
    setMotivoReprovar('FIT_TECNICO');
    setAnotacoesReprovar('');
  }

  async function handleConfirmarReprovacao() {
    if (!candidatoModalReprovar) return;
    const candidateId = candidatoModalReprovar.candidato_id;
    const idNum = Number(vagaId);
    const vagaIdNum = !isNaN(idNum) && idNum > 0 ? idNum : undefined;

    setRevealing(candidateId);

    try {
      const res = await reprovarCandidato({
        candidato_id: candidateId,
        empresa_id: EMPRESA_ID,
        vaga_id: vagaIdNum,
        motivo: motivoReprovar,
        anotacoes: anotacoesReprovar.trim() || undefined,
      });

      const rejectedData: RejectedCandidateData = {
        candidato_id: candidateId,
        motivo: res.motivo || motivoReprovar,
        anotacoes: res.anotacoes || anotacoesReprovar.trim(),
        registrado_em: res.registrado_em,
      };

      setRejectedCandidates((prev) => {
        const next = { ...prev, [candidateId]: rejectedData };
        saveRejectedCandidates(rejectedStorageKey, next);
        return next;
      });

      // Se estava aprovado, remove da lista de aprovados
      setApprovedContacts((prev) => {
        if (!prev[candidateId]) return prev;
        const copy = { ...prev };
        delete copy[candidateId];
        saveApprovedContacts(approvedContactsStorageKey, copy);
        return copy;
      });

      setToastMensagem({
        tipo: 'sucesso',
        texto: 'Reprovação do candidato registrada no banco de dados.',
      });
      fecharModalReprovar();
    } catch {
      // Fallback local caso o backend esteja temporariamente indisponível
      const fallbackData: RejectedCandidateData = {
        candidato_id: candidateId,
        motivo: motivoReprovar,
        anotacoes: anotacoesReprovar.trim(),
        registrado_em: new Date().toISOString(),
      };
      setRejectedCandidates((prev) => {
        const next = { ...prev, [candidateId]: fallbackData };
        saveRejectedCandidates(rejectedStorageKey, next);
        return next;
      });
      setApprovedContacts((prev) => {
        if (!prev[candidateId]) return prev;
        const copy = { ...prev };
        delete copy[candidateId];
        saveApprovedContacts(approvedContactsStorageKey, copy);
        return copy;
      });
      setToastMensagem({
        tipo: 'sucesso',
        texto: 'Reprovação registrada localmente na sessão.',
      });
      fecharModalReprovar();
    } finally {
      setRevealing(null);
    }
  }

  const temFiltroAtivo =
    filtroStatus !== 'todos' ||
    filtroMinScore > 0 ||
    Boolean(filtroBadge) ||
    Boolean(filtroRegiao) ||
    Boolean(filtroModelo) ||
    ordenacao !== 'score_desc';

  function limparFiltros() {
    setFiltroStatus('todos');
    setFiltroMinScore(0);
    setFiltroBadge('');
    setFiltroRegiao('');
    setFiltroModelo('');
    setOrdenacao('score_desc');
    setPaginaCandidatos(0);
  }

  const handleLogout = () => {
    clearAppSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="sl-page-wrapper">
      <Header />
      <div className="sl-shell">
        <header className="sl-topbar">
          <div className="sl-topbar__left">
            <button className="sl-back-btn" onClick={() => navigate('/dashboard')} title="Voltar ao Painel">
              ←
            </button>
            <div className="sl-topbar__title-wrap">
              <span className="sl-topbar__title">Shortlist de Candidatos</span>
              <span className="sl-topbar__meta">
                {vagaAtual.titulo} · {vagaAtual.area} · {vagaAtual.modelo} · {vagaAtual.local}
              </span>
            </div>
          </div>
          <div className="sl-topbar__right">
            <span className="sl-badge-esg">Score ESG da Vaga {vagaAtual.scoreESG}%</span>
            <button className="sl-btn-logout" onClick={handleLogout} title="Sair da plataforma">
              Sair
            </button>
          </div>
        </header>

        {/* Mobile Vaga Selector */}
        {todasVagas.length > 0 && (
          <div className="sl-mobile-vaga-selector">
            <label htmlFor="sl-mobile-vagas" className="sl-mobile-vaga-label">
              Vaga ativa:
            </label>
            <select
              id="sl-mobile-vagas"
              value={vagaId}
              onChange={(e) => navigate(`/shortlist?vaga=${e.target.value}`)}
              className="sl-mobile-vaga-select"
            >
              <option value="mvp-oficial">Analista de Dados Júnior (Oficial)</option>
              {todasVagas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.titulo} ({v.modalidade || 'Híbrido'})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sl-body">
          <aside className="sl-sidebar">
            <p className="sl-sidebar__heading">Vaga Oficial</p>
            <button
              type="button"
              className={`sl-vaga-item ${vagaId === 'mvp-oficial' ? 'sl-vaga-item--active' : ''}`}
              onClick={() => navigate('/shortlist?vaga=mvp-oficial')}
            >
              <span className="sl-vaga-item__titulo">{VAGA_OFICIAL.titulo}</span>
              <span className="sl-vaga-item__area">
                {VAGA_OFICIAL.area} · {VAGA_OFICIAL.nivel}
              </span>
              <span className="sl-vaga-item__local">
                📍 {VAGA_OFICIAL.modelo} · {VAGA_OFICIAL.local}
              </span>
              <div className="sl-vaga-item__bar-wrap">
                <div className="sl-vaga-item__bar-track">
                  <div className="sl-vaga-item__bar-fill" style={{ width: `${VAGA_OFICIAL.scoreESG}%` }} />
                </div>
                <span className="sl-vaga-item__pct">{VAGA_OFICIAL.scoreESG}%</span>
              </div>
            </button>

            {todasVagas.length > 0 && (
              <>
                <p className="sl-sidebar__heading" style={{ marginTop: 16 }}>
                  Vagas da empresa ({todasVagas.length})
                </p>
                {todasVagas.map((v) => {
                  const isActive = vagaId === String(v.id);
                  const esg = v.esgMatch ?? 85;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`sl-vaga-item ${isActive ? 'sl-vaga-item--active' : ''}`}
                      onClick={() => navigate(`/shortlist?vaga=${v.id}`)}
                    >
                      <span className="sl-vaga-item__titulo">{formatarTextoMvp(v.titulo)}</span>
                      <span className="sl-vaga-item__area">
                        {v.area || 'Dados'} · {v.nivel ? formatarNivelMvp(v.nivel) : 'Júnior'}
                      </span>
                      <span className="sl-vaga-item__local">
                        📍 {formatarTextoMvp(v.modalidade || 'Híbrido')} · {v.regiaoAlvo?.municipio || 'Brasil'}
                      </span>
                      <div className="sl-vaga-item__bar-wrap">
                        <div className="sl-vaga-item__bar-track">
                          <div className="sl-vaga-item__bar-fill" style={{ width: `${esg}%` }} />
                        </div>
                        <span className="sl-vaga-item__pct">{esg}%</span>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </aside>

          <main className="sl-main">
            <div className="sl-notice">
              🛡️
              <p>
                <strong>Filtro anti-viés ativo</strong> — a tela consome o contrato oficial do backend e não carrega
                nome, e-mail, telefone ou LinkedIn na shortlist inicial.
              </p>
            </div>

            <div className="sl-insights-bar">
              <p className="sl-insights-bar__text">
                Fonte: {match?.fonte_candidatos ?? 'POST /match'} · analisados: {match?.total_analisados ?? 0} · score médio: {averageScore}
              </p>
              <button className="sl-btn-insights" onClick={() => navigate('/insights/regioes')}>
                Ver insights da rede →
              </button>
            </div>

            {/* Barra de Filtros Rápidos */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
                fontSize: 12,
              }}
            >
              <span style={{ fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                ⚡ Filtros Rápidos:
              </span>

              {/* Status (Todos / Pendentes / Aprovados / Reprovados) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label style={{ color: '#64748b', fontWeight: 500 }}>Status:</label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value as 'todos' | 'pendentes' | 'aprovados' | 'reprovados')}
                  style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                >
                  <option value="todos">Todos ({candidatos.length})</option>
                  <option value="pendentes">Pendentes ({totalPendentes})</option>
                  <option value="aprovados">Aprovados ({totalAprovados})</option>
                  <option value="reprovados">Reprovados ({totalReprovados})</option>
                </select>
              </div>

              {/* Score Mínimo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label style={{ color: '#64748b', fontWeight: 500 }}>Score Mínimo:</label>
                <select
                  value={filtroMinScore}
                  onChange={(e) => setFiltroMinScore(Number(e.target.value))}
                  style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                >
                  <option value={0}>Todos os Scores</option>
                  <option value={70}>70%+ (Alta similaridade)</option>
                  <option value={80}>80%+ (Forte aderência)</option>
                  <option value={90}>90%+ (Match excelente)</option>
                </select>
              </div>

              {/* Badge ESG / Diversidade */}
              {badgesDisponiveis.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <label style={{ color: '#64748b', fontWeight: 500 }}>Badge:</label>
                  <select
                    value={filtroBadge}
                    onChange={(e) => setFiltroBadge(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                  >
                    <option value="">Todas as Badges</option>
                    {badgesDisponiveis.map((b) => (
                      <option key={b} value={b}>
                        {formatarTextoMvp(b)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Região / Cluster */}
              {regioesDisponiveis.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <label style={{ color: '#64748b', fontWeight: 500 }}>Região:</label>
                  <select
                    value={filtroRegiao}
                    onChange={(e) => setFiltroRegiao(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                  >
                    <option value="">Todas as Regiões</option>
                    {regioesDisponiveis.map((r) => (
                      <option key={r} value={r}>
                        📍 {formatarTextoMvp(r)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Modelo de Trabalho */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label style={{ color: '#64748b', fontWeight: 500 }}>Modelo:</label>
                <select
                  value={filtroModelo}
                  onChange={(e) => setFiltroModelo(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                >
                  <option value="">Todos</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                  <option value="presencial">Presencial</option>
                </select>
              </div>

              {/* Ordenação */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                <label style={{ color: '#64748b', fontWeight: 500 }}>Ordenar:</label>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                >
                  <option value="score_desc">Maior Score</option>
                  <option value="score_asc">Menor Score</option>
                  <option value="exp_desc">Mais Experiência</option>
                </select>
              </div>

              {temFiltroAtivo && (
                <button
                  type="button"
                  onClick={limparFiltros}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '4px 10px',
                    color: '#475569',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ✕ Limpar filtros
                </button>
              )}
            </div>

            {carregando && (
              <div className="sl-empty">
                <span className="sl-spinner" style={{ width: 32, height: 32, borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
                <p>Carregando candidatos da shortlist...</p>
              </div>
            )}

            {!carregando && error && (
              <div className="sl-empty sl-empty--error">
                <p>{error}</p>
                <button className="sl-btn-aprovar" style={{ marginTop: 12, width: 'auto' }} onClick={() => window.location.reload()}>
                  Tentar novamente
                </button>
              </div>
            )}

            {!carregando && !error && candidatosFiltrados.length === 0 && (
              <div className="sl-empty">
                <div style={{ fontSize: 36, marginBottom: 8 }}>👥</div>
                <h3>Nenhum candidato encontrado</h3>
                <p style={{ maxWidth: 420, margin: '6px auto 14px', color: '#64748b', fontSize: 13 }}>
                  {temFiltroAtivo
                    ? 'Nenhum perfil corresponde aos filtros aplicados. Tente ajustar os parâmetros.'
                    : 'Nenhum candidato localizado no banco para os critérios desta vaga.'}
                </p>
                {temFiltroAtivo && (
                  <button
                    type="button"
                    onClick={limparFiltros}
                    style={{
                      background: 'var(--sl-purple)',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Redefinir filtros
                  </button>
                )}
              </div>
            )}

            {!carregando && !error && candidatosFiltrados.length > 0 && (
              <>
                <div className="sl-grid">
                  {candidatosPaginados.map((candidate) => {
                    const approved = approvedContacts[candidate.candidato_id];
                    const rejected = rejectedCandidates[candidate.candidato_id];
                    const anotacaoAprovacao = approvalNotes[candidate.candidato_id];
                    const sc = scoreStyle(candidate.score_match);
                    const skills = getCandidateSkills(candidate);
                    const rawBadge = candidate.badge_diversidade;
                    const hasValidBadge = Boolean(rawBadge && rawBadge !== 'Sem badge informada' && rawBadge !== 'Nenhum');
                    const badgeStyle = hasValidBadge ? BADGE_COLORS[rawBadge as string] ?? { bg: '#EDE9FE', color: '#5B21B6' } : null;
                    const badgeLabel = hasValidBadge ? formatarTextoMvp(rawBadge as string) : '';
                    const regiao = formatarTextoMvp(candidate.regiao);
                    const nivel = formatarNivelMvp(candidate.nivel);
                    const modelo = formatarTextoMvp(candidate.modelo_trabalho_preferido || 'Híbrido');
                    const isRevealing = revealing === candidate.candidato_id;

                    const cardClassName = `sl-card${
                      approved ? ' sl-card--aprovado' : rejected ? ' sl-card--reprovado' : ''
                    }`;

                    return (
                      <article key={candidate.candidato_id} className={cardClassName}>
                        {approved && <div className="sl-card__status-badge">✓ Candidato aprovado</div>}
                        {rejected && (
                          <div className="sl-card__status-badge sl-card__status-badge--reprovado">
                            ✕ Candidato reprovado
                          </div>
                        )}

                        <div className="sl-card__header">
                          <div className="sl-card__avatar">
                            {approved ? (
                              <span className="sl-card__initial">{approved.contato_liberado.nome[0]}</span>
                            ) : rejected ? (
                              <span>✕</span>
                            ) : (
                              <span>👤</span>
                            )}
                          </div>
                          <div className="sl-card__id-block">
                            <p className="sl-card__codinome">
                              {approved ? approved.contato_liberado.nome : candidate.apelido_exibicao}
                            </p>
                            <div className="sl-card__meta">
                              <span>📍 {regiao}</span>
                              <span className="sl-dot" />
                              <span>{nivel}</span>
                            </div>
                          </div>
                          <div className="sl-score" style={{ background: sc.bg, borderColor: sc.ring, color: sc.color }}>
                            <span className="sl-score__num">{candidate.score_match}</span>
                            <span className="sl-score__pct">%</span>
                          </div>
                        </div>

                        {hasValidBadge && badgeStyle && (
                          <div className="sl-card__badges">
                            <span className="sl-badge" style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
                              {badgeLabel}
                            </span>
                          </div>
                        )}

                        <div className="sl-card__divider" />

                        <div className="sl-card__section">
                          <p className="sl-card__section-label">Competências técnicas</p>
                          <div className="sl-card__skills">
                            {skills.map((skill) => (
                              <span key={skill} className="sl-skill">
                                {formatarSkillMvp(skill)}
                              </span>
                            ))}
                          </div>
                        </div>

                        {candidate.justificativa_ai && (
                          <div
                            className="sl-card__section"
                            style={{
                              background: '#f8fafc',
                              padding: 8,
                              borderRadius: 6,
                              border: '1px solid #e2e8f0',
                              marginTop: 8,
                            }}
                          >
                            <p
                              className="sl-card__section-label"
                              style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '0 0 4px', color: '#6366f1', fontWeight: 700 }}
                            >
                              🤖 Justificativa da IA
                            </p>
                            <p style={{ margin: 0, fontSize: 11, color: '#475569', lineHeight: 1.35 }}>
                              {candidate.justificativa_ai}
                            </p>
                          </div>
                        )}

                        <div className="sl-card__row">
                          <div className="sl-card__detail">
                            <span className="sl-card__detail-label">Experiência</span>
                            <span className="sl-card__detail-value">{candidate.anos_experiencia ?? 0} ano(s)</span>
                          </div>
                          <div className="sl-card__detail">
                            <span className="sl-card__detail-label">Modelo</span>
                            <span className="sl-card__detail-value">{modelo}</span>
                          </div>
                        </div>

                        {/* Estado: Sem avaliação */}
                        {!approved && !rejected && (
                          <div className="sl-card__anon">
                            🔒 Dados sensíveis ocultos. Skills: {firstSkillLabel(candidate)}
                          </div>
                        )}

                        {/* Estado: Candidato Aprovado */}
                        {approved && (
                          <>
                            <div className="sl-card__contact">
                              <div className="sl-card__contact-item">
                                ✉️ <a href={`mailto:${approved.contato_liberado.email}`}>{approved.contato_liberado.email}</a>
                              </div>
                              <div className="sl-card__contact-item">☎ {approved.contato_liberado.telefone}</div>
                              <div className="sl-card__contact-item">
                                🔗{' '}
                                <a href={approved.contato_liberado.linkedin} target="_blank" rel="noopener noreferrer">
                                  {approved.contato_liberado.linkedin}
                                </a>
                              </div>
                            </div>
                            {anotacaoAprovacao && (
                              <div className="sl-card__anotacao">
                                <span className="sl-card__anotacao-label">📝 Anotação interna:</span>
                                <span>"{anotacaoAprovacao}"</span>
                              </div>
                            )}
                          </>
                        )}

                        {/* Estado: Candidato Reprovado */}
                        {rejected && (
                          <div className="sl-card__rejeicao">
                            <span className="sl-card__rejeicao-motivo">
                              Motivo: {MOTIVOS_REPROVACAO[rejected.motivo] || rejected.motivo}
                            </span>
                            {rejected.anotacoes && (
                              <p className="sl-card__rejeicao-nota">"{rejected.anotacoes}"</p>
                            )}
                          </div>
                        )}

                        {approvalError[candidate.candidato_id] && (
                          <div className="sl-card__anon">{approvalError[candidate.candidato_id]}</div>
                        )}

                        {/* Botões de Ação do Card */}
                        <div className="sl-card__actions">
                          {approved ? (
                            <>
                              <a
                                className="sl-btn-aprovado"
                                href={`mailto:${approved.contato_liberado.email}?subject=Processo%20Seletivo%20appBiT%20-%20${encodeURIComponent(
                                  vagaAtual.titulo
                                )}`}
                              >
                                ✉️ Convidar por e-mail
                              </a>
                              <button
                                type="button"
                                className="sl-btn-reprovar"
                                onClick={() => abrirModalReprovar(candidate)}
                                style={{ flex: 'none', padding: '10px 12px' }}
                                title="Alterar avaliação para reprovado"
                              >
                                ✕
                              </button>
                            </>
                          ) : rejected ? (
                            <button
                              type="button"
                              className="sl-btn-reavaliar"
                              onClick={() => abrirModalAprovar(candidate)}
                              disabled={isRevealing}
                            >
                              ↺ Reavaliar / Aprovar candidato
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="sl-btn-aprovar"
                                onClick={() => abrirModalAprovar(candidate)}
                                disabled={Boolean(revealing)}
                              >
                                ✓ Aprovar para entrevista
                              </button>
                              <button
                                type="button"
                                className="sl-btn-reprovar"
                                onClick={() => abrirModalReprovar(candidate)}
                                disabled={Boolean(revealing)}
                              >
                                ✕ Reprovar
                              </button>
                            </>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Barra de Paginação da Shortlist */}
                <div className="sl-pagination">
                  <div className="sl-pagination__info">
                    Exibindo <strong>{indiceInicio}–{indiceFim}</strong> de <strong>{candidatosFiltrados.length}</strong> candidato
                    {candidatosFiltrados.length !== 1 ? 's' : ''}
                  </div>

                  <div className="sl-pagination__size-select">
                    <span>Por página:</span>
                    <select
                      value={itensPorPagina}
                      onChange={(e) => {
                        setItensPorPagina(Number(e.target.value));
                        setPaginaCandidatos(0);
                      }}
                    >
                      <option value={4}>4 candidatos</option>
                      <option value={6}>6 candidatos</option>
                      <option value={8}>8 candidatos</option>
                      <option value={999}>Exibir todos</option>
                    </select>
                  </div>

                  <div className="sl-pagination__controls">
                    <button
                      type="button"
                      className="sl-pagination__btn"
                      onClick={() => setPaginaCandidatos((prev) => Math.max(0, prev - 1))}
                      disabled={paginaCandidatos <= 0}
                    >
                      ‹ Anterior
                    </button>

                    <span className="sl-pagination__page-indicator">
                      Pág. {paginaCandidatos + 1} de {totalPaginasCandidatos}
                    </span>

                    <button
                      type="button"
                      className="sl-pagination__btn"
                      onClick={() => setPaginaCandidatos((prev) => Math.min(totalPaginasCandidatos - 1, prev + 1))}
                      disabled={paginaCandidatos >= totalPaginasCandidatos - 1}
                    >
                      Próxima ›
                    </button>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Modal de Aprovação */}
      {candidatoModalAprovar && (
        <div className="sl-modal-overlay" onClick={fecharModalAprovar}>
          <div className="sl-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="sl-modal__header sl-modal__header--aprovar">
              <h3 className="sl-modal__title">
                <span style={{ color: '#16a34a' }}>✓</span> Aprovar Candidato para Entrevista
              </h3>
              <button type="button" className="sl-modal__close" onClick={fecharModalAprovar}>
                ✕
              </button>
            </div>

            <div className="sl-modal__body">
              <div className="sl-modal__candidate-info">
                <div>
                  <div className="sl-modal__candidate-name">{candidatoModalAprovar.apelido_exibicao}</div>
                  <div className="sl-modal__candidate-sub">
                    {candidatoModalAprovar.cargo_alvo} • {candidatoModalAprovar.regiao}
                  </div>
                </div>
                <div className="sl-modal__candidate-score">{candidatoModalAprovar.score_match}% Match</div>
              </div>

              <div className="sl-modal__field">
                <label className="sl-modal__label" htmlFor="anotacao-aprovar">
                  Anotações internas do recrutador (opcional)
                </label>
                <textarea
                  id="anotacao-aprovar"
                  className="sl-modal__textarea"
                  rows={3}
                  placeholder="Ex: Forte aderência técnica em SQL e Python. Agendar dinâmica técnica na próxima quinta-feira."
                  value={anotacoesAprovar}
                  onChange={(e) => setAnotacoesAprovar(e.target.value)}
                />
              </div>

              <div className="sl-modal__notice">
                ℹ Ao confirmar a aprovação, os dados de contato do candidato (nome completo, e-mail, telefone e LinkedIn) serão revelados de acordo com a política de Triagem Cega (Blind Screening).
              </div>
            </div>

            <div className="sl-modal__footer">
              <button
                type="button"
                className="sl-modal__btn-cancelar"
                onClick={fecharModalAprovar}
                disabled={Boolean(revealing)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="sl-modal__btn-confirmar-aprovar"
                onClick={handleConfirmarAprovacao}
                disabled={Boolean(revealing)}
              >
                {revealing ? (
                  <>
                    <span className="sl-spinner" /> Confirmando...
                  </>
                ) : (
                  <>✓ Confirmar Aprovação</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reprovação */}
      {candidatoModalReprovar && (
        <div className="sl-modal-overlay" onClick={fecharModalReprovar}>
          <div className="sl-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="sl-modal__header sl-modal__header--reprovar">
              <h3 className="sl-modal__title" style={{ color: '#991b1b' }}>
                <span>✕</span> Registrar Reprovação de Candidato
              </h3>
              <button type="button" className="sl-modal__close" onClick={fecharModalReprovar}>
                ✕
              </button>
            </div>

            <div className="sl-modal__body">
              <div className="sl-modal__candidate-info">
                <div>
                  <div className="sl-modal__candidate-name">{candidatoModalReprovar.apelido_exibicao}</div>
                  <div className="sl-modal__candidate-sub">
                    {candidatoModalReprovar.cargo_alvo} • {candidatoModalReprovar.regiao}
                  </div>
                </div>
                <div className="sl-modal__candidate-score" style={{ background: '#fee2e2', color: '#991b1b' }}>
                  {candidatoModalReprovar.score_match}% Match
                </div>
              </div>

              <div className="sl-modal__field">
                <label className="sl-modal__label" htmlFor="motivo-reprovar">
                  Motivo principal da reprovação <span className="sl-modal__required">*</span>
                </label>
                <select
                  id="motivo-reprovar"
                  className="sl-modal__select"
                  value={motivoReprovar}
                  onChange={(e) => setMotivoReprovar(e.target.value)}
                >
                  {Object.entries(MOTIVOS_REPROVACAO).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sl-modal__field">
                <label className="sl-modal__label" htmlFor="anotacao-reprovar">
                  Justificativa / Anotações internas (opcional)
                </label>
                <textarea
                  id="anotacao-reprovar"
                  className="sl-modal__textarea"
                  rows={3}
                  placeholder="Ex: Candidato não possui experiência prévia com ferramentas essenciais desta vaga..."
                  value={anotacoesReprovar}
                  onChange={(e) => setAnotacoesReprovar(e.target.value)}
                />
              </div>

              <div className="sl-modal__notice">
                ℹ O motivo e as observações serão salvos no banco de dados para fins de conformidade, melhoria contínua e histórico analítico da vaga.
              </div>
            </div>

            <div className="sl-modal__footer">
              <button
                type="button"
                className="sl-modal__btn-cancelar"
                onClick={fecharModalReprovar}
                disabled={Boolean(revealing)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="sl-modal__btn-confirmar-reprovar"
                onClick={handleConfirmarReprovacao}
                disabled={Boolean(revealing)}
              >
                {revealing ? (
                  <>
                    <span className="sl-spinner" /> Registrando...
                  </>
                ) : (
                  <>✕ Confirmar Reprovação</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de Feedback */}
      {toastMensagem && (
        <div className={`sl-toast ${toastMensagem.tipo === 'sucesso' ? 'sl-toast--sucesso' : 'sl-toast--erro'}`}>
          <span>{toastMensagem.tipo === 'sucesso' ? '✓' : '⚠️'}</span>
          <span>{toastMensagem.texto}</span>
        </div>
      )}
    </div>
  );
}
