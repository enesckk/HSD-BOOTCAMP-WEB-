import ParticipantLayout from '@/components/dashboard/ParticipantLayout';
import ResourcesPage from '@/components/dashboard/ResourcesPage';

export default function ResourcesPageRoute() {
  return (
    <ParticipantLayout>
      <ResourcesPage />
    </ParticipantLayout>
  );
}
