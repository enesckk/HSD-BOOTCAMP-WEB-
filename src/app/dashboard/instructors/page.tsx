import ParticipantLayout from '@/components/dashboard/ParticipantLayout';
import InstructorsPage from '@/components/dashboard/InstructorsPage';

export default function InstructorsPageRoute() {
  return (
    <ParticipantLayout>
      <InstructorsPage />
    </ParticipantLayout>
  );
}
