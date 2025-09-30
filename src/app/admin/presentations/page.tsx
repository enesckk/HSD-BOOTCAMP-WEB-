import AdminLayout from '@/components/dashboard/AdminLayout';

export default function AdminPresentationsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sunumlar</h1>
          <p className="text-gray-600">Maraton sunumlarını yönetin</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sunum Listesi</h2>
          <p className="text-gray-600">Sunumlar sayfası içeriği burada olacak</p>
        </div>
      </div>
    </AdminLayout>
  );
}
