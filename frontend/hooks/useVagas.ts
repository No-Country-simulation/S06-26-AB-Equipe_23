import { useEffect, useState, useMemo, useCallback } from 'react';
import type { Vaga, NovaVagaForm } from "../features/jobs/components/type/index.ts";
import {
  buscarVagasPaginadas,
  criarVaga as apiCriarVaga,
  atualizarVaga as apiAtualizarVaga,
  deletarVaga as apiDeletarVaga,
} from '../lib/appbitApi';
import type { VagaBackend, VagaCreateBackend } from '../lib/appbitTypes';

function formatarNivelFrontend(nivelRaw: string): Vaga['nivel'] {
  const norm = (nivelRaw || '').toLowerCase();
  if (norm.includes('senior') || norm.includes('sênior')) return 'Sênior';
  if (norm.includes('pleno')) return 'Pleno';
  if (norm.includes('lideranca') || norm.includes('liderança')) return 'Liderança';
  return 'Júnior';
}

function backendToFrontendVaga(bv: VagaBackend): Vaga {
  return {
    id: bv.id,
    titulo: bv.titulo,
    area: bv.area || 'Tecnologia',
    nivel: formatarNivelFrontend(bv.nivel),
    modalidade: (bv.modalidade || 'Híbrido') as Vaga['modalidade'],
    regiao: bv.regiaoAlvo?.municipio || 'Brasil',
    descricao: bv.descricao || 'Descrição a ser preenchida.',
    skills: bv.skills && bv.skills.length > 0 ? bv.skills : ['Geral'],
    filtrosDiversidade: {
      antivies: bv.antiVies ?? true,
      mulheres: bv.prioridadeMulheres ?? false,
      pessoasNegras: bv.prioridadeNegros ?? false,
      pcd: bv.prioridadePcd ?? false,
      lgbtqia: bv.prioridadeLgbt ?? false,
    },
    scoreMinDiversidade: bv.diversidadeMinima ? Number(bv.diversidadeMinima) : 40,
    esgMatch: bv.esgMatch ?? 85,
    publicadaEm: bv.criacao ? bv.criacao.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export default function useVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [vagaSelecionadaId, setVagaSelecionadaId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados de Paginação
  const [pagina, setPagina] = useState<number>(0);
  const [tamanhoPagina, setTamanhoPagina] = useState<number>(6);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [totalElementos, setTotalElementos] = useState<number>(0);

  // Estados de Filtros locais
  const [busca, setBusca] = useState<string>('');
  const [modalidadeFiltro, setModalidadeFiltro] = useState<string>('Todos');

  const carregar = useCallback(async (pageTarget = pagina, sizeTarget = tamanhoPagina) => {
    try {
      setCarregando(true);
      const pageData = await buscarVagasPaginadas(pageTarget, sizeTarget);
      const convertidas = (pageData.content || []).map(backendToFrontendVaga);
      setVagas(convertidas);
      setTotalPaginas(Math.max(1, pageData.totalPages || 1));
      setTotalElementos(pageData.totalElements ?? convertidas.length);
      setPagina(pageData.number ?? pageTarget);

      if (convertidas.length > 0) {
        setVagaSelecionadaId((prev) => {
          const existe = convertidas.some((v) => v.id === prev);
          return existe ? prev : convertidas[0].id;
        });
      } else {
        setVagaSelecionadaId(null);
      }
      setErro(null);
    } catch (err) {
      console.error('Erro ao carregar vagas paginadas do backend:', err);
      setErro('Não foi possível carregar as vagas do servidor.');
    } finally {
      setCarregando(false);
    }
  }, [pagina, tamanhoPagina]);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        setCarregando(true);
        const pageData = await buscarVagasPaginadas(pagina, tamanhoPagina);
        if (!ativo) return;
        const convertidas = (pageData.content || []).map(backendToFrontendVaga);
        setVagas(convertidas);
        setTotalPaginas(Math.max(1, pageData.totalPages || 1));
        setTotalElementos(pageData.totalElements ?? convertidas.length);

        if (convertidas.length > 0) {
          setVagaSelecionadaId((prev) => {
            const existe = convertidas.some((v) => v.id === prev);
            return existe ? prev : convertidas[0].id;
          });
        } else {
          setVagaSelecionadaId(null);
        }
        setErro(null);
      } catch (err) {
        if (!ativo) return;
        console.error('Erro ao carregar vagas paginadas do backend:', err);
        setErro('Não foi possível carregar as vagas do servidor.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [pagina, tamanhoPagina]);

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 0 && novaPagina < totalPaginas) {
      setPagina(novaPagina);
    }
  };

  const mudarTamanhoPagina = (novoTamanho: number) => {
    setTamanhoPagina(novoTamanho);
    setPagina(0);
  };

  // Vagas com filtro de busca e modalidade aplicado
  const vagasExibidas = useMemo(() => {
    return vagas.filter((v) => {
      const termo = busca.trim().toLowerCase();
      const matchBusca =
        !termo ||
        v.titulo.toLowerCase().includes(termo) ||
        v.area.toLowerCase().includes(termo) ||
        v.skills.some((s) => s.toLowerCase().includes(termo)) ||
        v.regiao.toLowerCase().includes(termo);

      const matchModalidade =
        modalidadeFiltro === 'Todos' ||
        v.modalidade.toLowerCase() === modalidadeFiltro.toLowerCase();

      return matchBusca && matchModalidade;
    });
  }, [vagas, busca, modalidadeFiltro]);

  const vagaSelecionada = vagas.find((v) => v.id === vagaSelecionadaId) ?? vagasExibidas[0] ?? null;

  async function publicarVaga(form: NovaVagaForm) {
    const skills = form.skills
      .map((s: string) => s.trim())
      .filter(Boolean);

    const payload: VagaCreateBackend = {
      empresaId: 'emp_001',
      titulo: form.titulo || 'Nova vaga',
      area: form.area || 'Tecnologia',
      nivel: form.nivel ? form.nivel.toLowerCase() : 'junior',
      modalidade: form.modalidade || 'Híbrido',
      descricao: form.descricao || 'Descrição a ser preenchida.',
      skills: skills.length ? skills : ['sql', 'python'],
      antiVies: form.filtros?.antivies ?? true,
      prioridadeMulheres: form.filtros?.mulheres ?? false,
      prioridadeNegros: form.filtros?.pessoasNegras ?? false,
      prioridadePcd: form.filtros?.pcd ?? false,
      prioridadeLgbt: form.filtros?.lgbtqia ?? false,
      diversidadeMinima: form.scoreMin ?? 40,
      esgMatch: Math.min(100, (form.scoreMin || 40) + Math.floor(Math.random() * 20) + 5),
    };

    try {
      setCarregando(true);
      await apiCriarVaga(payload);
      // Volta para a primeira página para exibir a vaga criada
      setPagina(0);
      await carregar(0, tamanhoPagina);
    } catch (err) {
      console.error('Erro ao publicar vaga no backend:', err);
    } finally {
      setCarregando(false);
    }
  }

  async function editarVaga(id: number, form: NovaVagaForm) {
    const skills = form.skills
      .map((s: string) => s.trim())
      .filter(Boolean);

    const payload: Partial<VagaCreateBackend> = {
      empresaId: 'emp_001',
      titulo: form.titulo,
      area: form.area,
      nivel: form.nivel ? form.nivel.toLowerCase() : undefined,
      modalidade: form.modalidade,
      descricao: form.descricao,
      skills: skills.length ? skills : undefined,
      antiVies: form.filtros?.antivies,
      prioridadeMulheres: form.filtros?.mulheres,
      prioridadeNegros: form.filtros?.pessoasNegras,
      prioridadePcd: form.filtros?.pcd,
      prioridadeLgbt: form.filtros?.lgbtqia,
      diversidadeMinima: form.scoreMin,
    };

    try {
      setCarregando(true);
      await apiAtualizarVaga(id, payload);
      await carregar(pagina, tamanhoPagina);
    } catch (err) {
      console.error('Erro ao atualizar vaga no backend:', err);
    } finally {
      setCarregando(false);
    }
  }

  async function excluirVaga(id: number) {
    try {
      setCarregando(true);
      await apiDeletarVaga(id);
      // Se era o único elemento da página e não for a primeira, retrocede 1 página
      const novaPagina = vagas.length === 1 && pagina > 0 ? pagina - 1 : pagina;
      setPagina(novaPagina);
      await carregar(novaPagina, tamanhoPagina);
    } catch (err) {
      console.error('Erro ao excluir vaga no backend:', err);
    } finally {
      setCarregando(false);
    }
  }

  return {
    vagas: vagasExibidas,
    todasVagasPagina: vagas,
    vagaSelecionada,
    vagaSelecionadaId,
    setVagaSelecionadaId,
    publicarVaga,
    editarVaga,
    excluirVaga,
    carregando,
    erro,
    // Controles de paginação
    pagina,
    tamanhoPagina,
    totalPaginas,
    totalElementos,
    mudarPagina,
    mudarTamanhoPagina,
    // Controles de filtros
    busca,
    setBusca,
    modalidadeFiltro,
    setModalidadeFiltro,
    recarregar: () => carregar(pagina, tamanhoPagina),
  };
}

