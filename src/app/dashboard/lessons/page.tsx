import ParticipantLayout from '@/components/dashboard/ParticipantLayout';
import LessonsPage from '@/components/dashboard/LessonsPage';

export default function LessonsPageRoute() {
  return (
    <ParticipantLayout>
      <LessonsPage />
    </ParticipantLayout>
  );
}
