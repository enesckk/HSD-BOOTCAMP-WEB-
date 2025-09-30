import AdminLayout from '@/components/dashboard/AdminLayout';

export default function AdminTeamMatchingPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Takım Eşleştirme</h1>
          <p className="text-gray-600">Katılımcıları takımlara eşleştirin</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Eşleştirme Paneli</h2>
          <p className="text-gray-600">Takım eşleştirme sayfası içeriği burada olacak</p>
        </div>
      </div>
    </AdminLayout>
  );
}
