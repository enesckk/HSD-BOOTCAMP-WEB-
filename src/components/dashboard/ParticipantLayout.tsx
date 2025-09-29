'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Users, 
  Upload, 
  Presentation, 
  Bell, 
  MessageSquare, 
  Calendar, 
  Phone,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface ParticipantLayoutProps {
  children: React.ReactNode;
}

const ParticipantLayout = ({ children }: ParticipantLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const pathname = usePathname();

  // Menü durumunu localStorage'dan yükle
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  // Menü durumu değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Ana Sayfa',
      icon: Home,
      href: '/dashboard',
      color: 'text-red-600'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      href: '/dashboard/profile',
      color: 'text-red-600'
    },
    {
      id: 'team',
      label: 'Takım Bilgileri',
      icon: Users,
      href: '/dashboard/team',
      color: 'text-red-600'
    },
    {
      id: 'tasks',
      label: 'Görev Yükleme',
      icon: Upload,
      href: '/dashboard/tasks',
      color: 'text-red-600'
    },
    {
      id: 'presentation',
      label: 'Sunum Yükleme',
      icon: Presentation,
      href: '/dashboard/presentation',
      color: 'text-red-600'
    },
    {
      id: 'announcements',
      label: 'Duyurular',
      icon: Bell,
      href: '/dashboard/announcements',
      color: 'text-red-600'
    },
    {
      id: 'messages',
      label: 'Mesajlar',
      icon: MessageSquare,
      href: '/dashboard/messages',
      color: 'text-red-600'
    },
    {
      id: 'calendar',
      label: 'Takvim',
      icon: Calendar,
      href: '/dashboard/calendar',
      color: 'text-red-600'
    },
    {
      id: 'contact',
      label: 'İletişim',
      icon: Phone,
      href: '/dashboard/contact',
      color: 'text-red-600'
    }
  ];

  // URL'den aktif menüyü tespit et
  useEffect(() => {
    const currentPath = pathname;
    const menuItem = menuItems.find(item => item.href === currentPath);
    if (menuItem) {
      setActiveMenu(menuItem.id);
    }
  }, [pathname, menuItems]);

  const handleLogout = () => {
    // Logout logic here
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Katılımcı Paneli</h2>
                <p className="text-xs text-gray-500">Afet Yönetimi</p>
              </div>
            </div>
          </div>


          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeMenu === item.id;
              
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setActiveMenu(item.id);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-red-50 text-red-700 border-l-4 border-red-600'
                      : 'text-gray-600 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-red-600 rounded-full ml-auto" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'ml-64 w-[calc(100%-16rem)]' : 'ml-0 w-full'
      }`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  Afet Yönetimi Teknolojileri Fikir Maratonu
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Messages */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Katılımcı Adı</p>
                  <p className="text-xs text-gray-500">MAR001</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ParticipantLayout;