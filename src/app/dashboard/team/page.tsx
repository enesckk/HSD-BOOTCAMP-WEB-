import ParticipantLayout from '@/components/dashboard/ParticipantLayout';
import TeamPage from '@/components/dashboard/TeamPage';

export default function TeamPageRoute() {
  return (
    <ParticipantLayout>
      <TeamPage />
    </ParticipantLayout>
  );
}
