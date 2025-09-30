import AdminLayout from '@/components/dashboard/AdminLayout';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}