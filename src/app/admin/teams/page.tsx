import AdminLayout from '@/components/dashboard/AdminLayout';
import AdminTeamsPage from '../../../components/dashboard/AdminTeamsPage';

export default function AdminTeamsRoute() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Bilgi */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-red-600 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-700">Oluşturulan takımları görüntüleyebilir, üyelerini inceleyebilir ve takım bilgilerini yönetebilirsiniz.</p>
            </div>
          </div>
        </div>
        <AdminTeamsPage />
      </div>
    </AdminLayout>
  );
}
