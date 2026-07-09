import AppLayout from '../../../components/layout/AppLayout';
import PainelMentorias from '../../../components/charts/PainelMentorias';

export default function MentoriasPage() {
  return (
    <AppLayout activeNav="Mentorias">
      <PainelMentorias />
    </AppLayout>
  );
}
