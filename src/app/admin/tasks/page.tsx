import AdminLayout from '@/components/dashboard/AdminLayout';

export default function AdminTasksPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Görevler</h1>
          <p className="text-gray-600">Maraton görevlerini yönetin</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Görev Listesi</h2>
          <p className="text-gray-600">Görevler sayfası içeriği burada olacak</p>
        </div>
      </div>
    </AdminLayout>
  );
}
