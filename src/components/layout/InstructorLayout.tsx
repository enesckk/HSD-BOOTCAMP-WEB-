'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ArrowLeft, 
  Home, 
  Users, 
  Target, 
  BookOpen, 
  MessageSquare, 
  Bell, 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface InstructorLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const InstructorLayout = ({ children, title, subtitle }: InstructorLayoutProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Anasayfa', href: '/instructor', icon: Home },
    { name: 'Profil', href: '/instructor/profile', icon: Settings },
    { name: 'Katılımcılar', href: '/instructor/students', icon: Users },
    { name: 'Görevler', href: '/instructor/tasks', icon: Target },
    { name: 'Dersler', href: '/instructor/lessons', icon: BookOpen },
    { name: 'Mesajlar', href: '/instructor/questions', icon: MessageSquare },
    { name: 'Duyurular', href: '/instructor/announcements', icon: Bell },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              {/* HSD Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">&lt;HSD&gt;</span>
                </div>
                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">H</span>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Eğitmen Paneli</h2>
                <p className="text-xs text-gray-500">HSD Türkiye Bootcamp</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 ml-auto"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-red-100 text-red-700 border-r-2 border-red-600' 
                      : 'text-gray-600 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${
                    isActive 
                      ? 'text-red-600' 
                      : 'text-gray-400 group-hover:text-red-600'
                  }`} />
                  <span className={`font-medium ${
                    isActive ? 'font-semibold' : ''
                  }`}>{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
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
              
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                title="Geri Dön"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Geri</span>
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {title || 'Eğitmen Paneli'}
                </h1>
                <p className="text-sm text-gray-500">
                  {subtitle || 'HSD Türkiye Bootcamp Programı'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <div className="relative flex items-center space-x-3 cursor-pointer select-none" onClick={() => setUserMenuOpen(prev => !prev)}>
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.fullName?.charAt(0) || 'E'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || 'Eğitmen'}
                  </p>
                  <p className="text-xs text-gray-500">Eğitmen</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
                
                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    <a href="/instructor/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">Profil</a>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;
