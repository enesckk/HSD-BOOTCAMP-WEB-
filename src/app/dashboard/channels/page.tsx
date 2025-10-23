import ParticipantLayout from '@/components/dashboard/ParticipantLayout';
import ChannelsPage from '@/components/dashboard/ChannelsPage';

export default function ChannelsPageRoute() {
    return (
    <ParticipantLayout>
      <ChannelsPage />
    </ParticipantLayout>
  );
}