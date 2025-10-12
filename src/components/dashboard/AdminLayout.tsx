'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { STORAGE_KEYS } from '@/utils/constants';
import {
  Menu,
  Home,
  User,
  Users,
  UserCheck,
  Target,
  Presentation,
  Bell,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  UsersRound,
  CheckSquare
} from 'lucide-react';
import AdminNotificationCenter from './AdminNotificationCenter';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Client-side kontrolü
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sidebar state'i localStorage'dan yükle
  useEffect(() => {
    if (isClient) {
      const savedSidebarState = localStorage.getItem('adminSidebarOpen');
      if (savedSidebarState !== null) {
        setSidebarOpen(JSON.parse(savedSidebarState));
      }
    }
  }, [isClient]);

  // Sidebar state'i localStorage'a kaydet
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('adminSidebarOpen', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen, isClient]);

  // Authentication kontrolü kaldırıldı - middleware ile yapılacak

  const menuItems = [
    { name: 'Anasayfa', href: '/admin', icon: Home },
    { name: 'Profil', href: '/admin/profile', icon: User },
    { name: 'Başvurular', href: '/admin/applications', icon: FileText },
    { name: 'Katılımcılar', href: '/admin/participants', icon: Users },
    { name: 'Takımlar', href: '/admin/teams', icon: UserCheck },
    { name: 'Takım Eşleştirme', href: '/admin/team-matching', icon: UsersRound },
    { name: 'Görevler', href: '/admin/tasks', icon: CheckSquare },
    { name: 'Sunumlar', href: '/admin/presentations', icon: Presentation },
    { name: 'Duyurular', href: '/admin/announcements', icon: Bell },
    { name: 'Mesajlar', href: '/admin/messages', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Loading durumunda loading göster
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200"
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">Admin Paneli</h1>
                    <p className="text-xs text-gray-500">Afet Yönetimi Maratonu</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-red-50 text-red-600 border-r-2 border-red-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Info */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500">Sistem Yöneticisi</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {menuItems.find(item => item.href === pathname)?.name || 'Admin Paneli'}
                </h1>
                <p className="text-sm text-gray-500">Afet Yönetimi Teknolojileri Fikir Maratonu</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Bildirim Merkezi */}
              <AdminNotificationCenter />
              
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500">Sistem Yöneticisi</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Çıkış Yap</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      
    </div>
  );
};

export default AdminLayout;


