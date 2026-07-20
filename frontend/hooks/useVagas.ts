import { useEffect, useState } from 'react';
import type { Vaga, NovaVagaForm } from "../features/jobs/components/type/index.ts";
import {
  buscarVagas,
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

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setCarregando(true);
        const dados = await buscarVagas();
        if (ativo) {
          const convertidas = dados.map(backendToFrontendVaga);
          setVagas(convertidas);
          if (convertidas.length > 0) {
            setVagaSelecionadaId((prev) => prev ?? convertidas[0].id);
          }
          setErro(null);
        }
      } catch (err) {
        if (ativo) {
          console.error('Erro ao carregar vagas do backend:', err);
          setErro('Não foi possível carregar as vagas do servidor.');
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  const vagaSelecionada = vagas.find((v) => v.id === vagaSelecionadaId) ?? null;

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
      const criada = await apiCriarVaga(payload);
      const vagaFe = backendToFrontendVaga(criada);
      setVagas((prev) => [vagaFe, ...prev]);
      setVagaSelecionadaId(vagaFe.id);
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
      const atualizada = await apiAtualizarVaga(id, payload);
      const vagaFe = backendToFrontendVaga(atualizada);
      setVagas((prev) => prev.map((v) => (v.id === id ? vagaFe : v)));
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
      setVagas((prev) => {
        const filtradas = prev.filter((v) => v.id !== id);
        if (vagaSelecionadaId === id) {
          setVagaSelecionadaId(filtradas.length > 0 ? filtradas[0].id : null);
        }
        return filtradas;
      });
    } catch (err) {
      console.error('Erro ao excluir vaga no backend:', err);
    } finally {
      setCarregando(false);
    }
  }

  return {
    vagas,
    vagaSelecionada,
    vagaSelecionadaId,
    setVagaSelecionadaId,
    publicarVaga,
    editarVaga,
    excluirVaga,
    carregando,
    erro,
  };
}
