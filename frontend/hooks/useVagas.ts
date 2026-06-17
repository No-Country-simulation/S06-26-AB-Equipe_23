import { useState } from 'react';
import { Vaga } from "../features/jobs/components/type/index.ts";
import { NovaVagaForm } from "../features/jobs/components/type/index.ts";
import { VAGAS_MOCK } from '../stores/data/vagasMock';

export default function useVagas() {
  const [vagas, setVagas] = useState<Vaga[]>(VAGAS_MOCK);
  const [vagaSelecionadaId, setVagaSelecionadaId] = useState<number | null>(null);

  const vagaSelecionada = vagas.find((v) => v.id === vagaSelecionadaId) ?? null;

  function publicarVaga(form: NovaVagaForm) {
    const skills = form.skills
      .map((s: string) => s.trim())
      .filter(Boolean);

    const nova: Vaga = {
      id: Date.now(),
      titulo: form.titulo || 'Nova vaga',
      area: form.area,
      nivel: form.nivel as Vaga['nivel'],
      modalidade: form.modalidade as Vaga['modalidade'],
      regiao: form.regiao || 'Brasil',
      descricao: form.descricao || 'Descrição a ser preenchida.',
      skills: skills.length ? skills : ['A definir'],
      filtrosDiversidade: form.filtros,
      scoreMinDiversidade: form.scoreMin,
      esgMatch: Math.min(100, form.scoreMin + Math.floor(Math.random() * 20) + 5),
      publicadaEm: new Date().toISOString().split('T')[0],
    };

    setVagas((prev) => [nova, ...prev]);
    setVagaSelecionadaId(nova.id);
  }

  return { vagas, vagaSelecionada, vagaSelecionadaId, setVagaSelecionadaId, publicarVaga };
}
