'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, Search, Filter, Download, Eye, FileSpreadsheet, FileText } from 'lucide-react';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { StudentDetailModal } from '@/components/ui/StudentDetailModal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

const StudentsPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user || user.role !== 'INSTRUCTOR') {
        router.push('/login');
        return;
      }
      setIsLoading(false);
      fetchStudents();
    }
  }, [authLoading, isAuthenticated, user, router]);

    const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch('/api/instructor/students', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Students data:', data);
        if (data.students) {
          setStudents(data.students);
        }
      } else {
        console.error('Failed to fetch students:', response.status);
      }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedStudent(null);
  };

  const exportToExcel = () => {
    const data = filteredStudents.map(student => ({
      'Ad Soyad': student.fullName,
      'E-posta': student.email,
      'Telefon': student.phone || '-',
      'Üniversite': student.university,
      'Bölüm': student.department,
      'Kayıt Tarihi': new Date(student.createdAt).toLocaleDateString('tr-TR')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Katılımcılar');
    
    const fileName = `katilimcilar_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Türkçe karakter desteği için font ayarları
      doc.setFont('helvetica');
      
      // Başlık
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('HSD Bootcamp Katilimcilari', 14, 22);
      
      // Tarih
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 14, 30);
      doc.text(`Toplam Katilimci: ${filteredStudents.length}`, 14, 35);
      
      if (filteredStudents.length === 0) {
        doc.setFontSize(12);
        doc.text('Kayitli katilimci bulunmuyor.', 14, 50);
      } else {
        // Tablo oluştur - basit yöntem
        let yPosition = 50;
        doc.setFontSize(8);
        
        // Başlık satırı
        doc.setFillColor(220, 38, 38);
        doc.rect(14, yPosition, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('Ad Soyad', 16, yPosition + 5);
        doc.text('E-posta', 50, yPosition + 5);
        doc.text('Telefon', 90, yPosition + 5);
        doc.text('Universite', 120, yPosition + 5);
        doc.text('Bolum', 150, yPosition + 5);
        doc.text('Kayit Tarihi', 170, yPosition + 5);
        
        yPosition += 10;
        
        // Veri satırları
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        filteredStudents.forEach((student, index) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Alternatif satır rengi
          if (index % 2 === 1) {
            doc.setFillColor(249, 250, 251);
            doc.rect(14, yPosition - 2, 180, 8, 'F');
          }
          
          // Türkçe karakterleri temizle
          const cleanName = student.fullName.replace(/[çğıöşüÇĞIİÖŞÜ]/g, (char) => {
            const map: { [key: string]: string } = {
              'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
              'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
            };
            return map[char] || char;
          });
          
          const cleanUniversity = student.university.replace(/[çğıöşüÇĞIİÖŞÜ]/g, (char) => {
            const map: { [key: string]: string } = {
              'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
              'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
            };
            return map[char] || char;
          });
          
          const cleanDepartment = student.department.replace(/[çğıöşüÇĞIİÖŞÜ]/g, (char) => {
            const map: { [key: string]: string } = {
              'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
              'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
            };
            return map[char] || char;
          });
          
          doc.text(cleanName.substring(0, 20), 16, yPosition + 5);
          doc.text(student.email.substring(0, 25), 50, yPosition + 5);
          doc.text((student.phone || '-').substring(0, 15), 90, yPosition + 5);
          doc.text(cleanUniversity.substring(0, 20), 120, yPosition + 5);
          doc.text(cleanDepartment.substring(0, 15), 150, yPosition + 5);
          doc.text(new Date(student.createdAt).toLocaleDateString('tr-TR'), 170, yPosition + 5);
          
          yPosition += 8;
        });
      }
      
      const fileName = `katilimcilar_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDF oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'INSTRUCTOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      </div>
    );
  }

  return (
    <InstructorLayout title="Katılımcılar" subtitle="Bootcamp Katılımcıları">
      <div className="space-y-6">
        {/* Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Bootcamp katılımcılarını görüntüleyin, arayın ve yönetin. Katılımcı bilgilerini Excel ve PDF formatında indirebilirsiniz.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end space-x-3">
          <button 
            onClick={exportToExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel İndir
          </button>
          <button 
            onClick={exportToPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF İndir
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Katılımcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Katılımcılar ({filteredStudents.length})
            </h2>
          </div>
          
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Katılımcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Üniversite
                    </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bölüm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kayıt Tarihi
                    </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-900 mb-2">Katılımcı bulunamadı</p>
                        <p className="text-sm text-gray-500">
                          {searchTerm ? 'Arama kriterlerinize uygun katılımcı bulunamadı.' : 'Henüz kayıtlı katılımcı bulunmuyor.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-medium text-sm">
                            {student.fullName.charAt(0)}
                          </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.fullName}
                            </div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.university}
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetails(student)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Detayları Görüntüle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
      
      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        student={selectedStudent}
      />
    </InstructorLayout>
  );
};

export default StudentsPage;