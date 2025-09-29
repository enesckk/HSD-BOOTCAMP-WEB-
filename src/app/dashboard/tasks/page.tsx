import ParticipantLayout from '@/components/dashboard/ParticipantLayout';
import TasksPage from '@/components/dashboard/TasksPage';

export default function TasksPageRoute() {
  return (
    <ParticipantLayout>
      <TasksPage />
    </ParticipantLayout>
  );
}
