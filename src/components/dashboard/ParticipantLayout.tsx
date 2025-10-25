'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
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
  ChevronDown,
  Clock,
  CheckCircle,
  Info,
  BookOpen,
  Award,
  Cloud,
  ArrowLeft
} from 'lucide-react';

interface ParticipantLayoutProps {
  children: React.ReactNode;
}

const ParticipantLayout = ({ children }: ParticipantLayoutProps) => {
  const { user, logout } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [readNotifications, setReadNotifications] = useState(new Set());
  const [readMessages, setReadMessages] = useState(new Set());
  const pathname = usePathname();
  // Kullanıcı menüsü dışına tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-menu-trigger') && !target.closest('#user-menu-dropdown')) {
        setUserMenuOpen(false);
      }
      if (!target.closest('#notifications-trigger') && !target.closest('#notifications-dropdown')) {
        setNotificationsOpen(false);
      }
      if (!target.closest('#messages-trigger') && !target.closest('#messages-dropdown')) {
        setMessagesOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Okuma durumlarını localStorage'dan yükle
  useEffect(() => {
    const savedReadNotifications = localStorage.getItem('readNotifications');
    const savedReadMessages = localStorage.getItem('readMessages');
    
    if (savedReadNotifications) {
      setReadNotifications(new Set(JSON.parse(savedReadNotifications)));
    }
    if (savedReadMessages) {
      setReadMessages(new Set(JSON.parse(savedReadMessages)));
    }
  }, []);

  // Okuma durumları değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('readNotifications', JSON.stringify([...readNotifications]));
  }, [readNotifications]);

  useEffect(() => {
    localStorage.setItem('readMessages', JSON.stringify([...readMessages]));
  }, [readMessages]);

  // Bildirimleri ve mesajları yükle
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Bildirimleri yükle
        const notificationsRes = await fetch(`/api/notifications?panel=participant&userId=${user.id}`);
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.notifications || []);

        // Mesajları yükle
        const token = localStorage.getItem('afet_maratonu_token');
        const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
        const messagesRes = await fetch('/api/messages/participant?box=inbox', { headers });
        const messagesData = await messagesRes.json();
        setMessages(messagesData.items || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]); // user değiştiğinde tekrar çalış

  // Menü durumunu localStorage'dan yükle
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  // Window focus olduğunda verileri yenile
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        // Bildirimleri ve mesajları yenile
        const fetchData = async () => {
          try {
            const notificationsRes = await fetch(`/api/notifications?panel=participant&userId=${user.id}`);
            const notificationsData = await notificationsRes.json();
            setNotifications(notificationsData.notifications || []);

            const token = localStorage.getItem('afet_maratonu_token');
            const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
            const messagesRes = await fetch('/api/messages/participant?box=inbox', { headers });
            const messagesData = await messagesRes.json();
            setMessages(messagesData.items || []);
          } catch (error) {
            console.error('Error refreshing data:', error);
          }
        };
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

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
      id: 'announcements',
      label: 'Duyurular',
      icon: Bell,
      href: '/dashboard/announcements',
      color: 'text-red-600'
    },
    {
      id: 'about',
      label: 'Hakkımızda',
      icon: Info,
      href: '/dashboard/about',
      color: 'text-red-600'
    },
    {
      id: 'program',
      label: 'Eğitim Programı',
      icon: Calendar,
      href: '/dashboard/program',
      color: 'text-red-600'
    },
    {
      id: 'instructors',
      label: 'Eğitmenler',
      icon: Users,
      href: '/dashboard/instructors',
      color: 'text-red-600'
    },
    {
      id: 'resources',
      label: 'Eğitim Kaynağı',
      icon: BookOpen,
      href: '/dashboard/resources',
      color: 'text-red-600'
    },
    {
      id: 'lessons',
      label: 'Ders Linkleri',
      icon: Presentation,
      href: '/dashboard/lessons',
      color: 'text-red-600'
    },
    {
      id: 'channels',
      label: 'Kanallar',
      icon: MessageSquare,
      href: '/dashboard/channels',
      color: 'text-red-600'
    },
    {
      id: 'tasks',
      label: 'Haftalık Görevler',
      icon: Upload,
      href: '/dashboard/tasks',
      color: 'text-red-600'
    },
    {
      id: 'certificate',
      label: 'Sertifika',
      icon: Award,
      href: '/dashboard/certificate',
      color: 'text-red-600'
    },
    {
      id: 'huawei-cloud',
      label: 'Huawei Cloud Hesabı',
      icon: Cloud,
      href: '/dashboard/huawei-cloud',
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
    logout();
    window.location.href = '/login';
  };

  const markNotificationAsRead = async (notificationId: string) => {
    setReadNotifications(prev => new Set([...prev, notificationId]));
    
    // API'ye okundu olarak işaretle
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          read: true
        })
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    setReadMessages(prev => new Set([...prev, messageId]));
    
    // API'ye okundu olarak işaretle
    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
      await fetch('/api/messages/participant', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ids: [messageId],
          action: 'markRead'
        })
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
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
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">&lt;HSD&gt;</span>
                </div>
                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">H</span>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Katılımcı Paneli</h2>
                <p className="text-xs text-gray-500">HSD Türkiye Bootcamp</p>
              </div>
            </div>
          </div>


          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0">
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
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                title="Geri Dön"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Geri</span>
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  HSD Türkiye Bootcamp Programı
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div id="notifications-trigger" className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.filter((n: any) => !readNotifications.has(n.id)).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter((n: any) => !readNotifications.has(n.id)).length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      id="notifications-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
                            <p className="text-sm text-gray-500">
                              {notifications.filter((n: any) => !readNotifications.has(n.id)).length} yeni bildirim
                            </p>
                          </div>
                          {notifications.filter((n: any) => !readNotifications.has(n.id)).length > 0 && (
                            <button
                              onClick={() => {
                                notifications.forEach((n: any) => {
                                  if (!readNotifications.has(n.id)) {
                                    markNotificationAsRead(n.id);
                                  }
                                });
                              }}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Tümünü Okundu İşaretle
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p>Henüz bildirim yok</p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notification: any) => (
                            <div 
                              key={notification.id} 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                markNotificationAsRead(notification.id);
                                if (notification.actionUrl) {
                                  // Sayfa yönlendirmesi
                                  window.location.href = notification.actionUrl;
                                }
                              }}
                              className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  readNotifications.has(notification.id) ? 'bg-gray-300' : 'bg-red-500'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${
                                    readNotifications.has(notification.id) ? 'text-gray-500' : 'text-gray-900'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(notification.createdAt).toLocaleDateString('tr-TR')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200">
                          <a 
                            href="/dashboard/announcements"
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Tüm Bildirimleri Gör
                          </a>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Messages */}
              <div id="messages-trigger" className="relative">
                <button 
                  onClick={() => setMessagesOpen(!messagesOpen)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-6 h-6" />
                  {messages.filter((m: any) => m.unread && !readMessages.has(m.id)).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {messages.filter((m: any) => m.unread && !readMessages.has(m.id)).length}
                    </span>
                  )}
                </button>

                {/* Messages Dropdown */}
                <AnimatePresence>
                  {messagesOpen && (
                    <motion.div
                      id="messages-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Mesajlar</h3>
                            <p className="text-sm text-gray-500">
                              {messages.filter((m: any) => m.unread && !readMessages.has(m.id)).length} okunmamış mesaj
                            </p>
                          </div>
                          {messages.filter((m: any) => m.unread && !readMessages.has(m.id)).length > 0 && (
                            <button
                              onClick={() => {
                                messages.forEach((m: any) => {
                                  if (m.unread && !readMessages.has(m.id)) {
                                    markMessageAsRead(m.id);
                                  }
                                });
                              }}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Tümünü Okundu İşaretle
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {messages.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p>Henüz mesaj yok</p>
                          </div>
                        ) : (
                          messages.slice(0, 5).map((message: any) => (
                            <div 
                              key={message.id} 
                              onClick={() => {
                                markMessageAsRead(message.id);
                                window.location.href = '/dashboard/messages';
                              }}
                              className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  message.unread && !readMessages.has(message.id) ? 'bg-red-500' : 'bg-gray-300'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${
                                    readMessages.has(message.id) ? 'text-gray-500' : 'text-gray-900'
                                  }`}>
                                    {message.subject}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Yönetim • {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {messages.length > 0 && (
                        <div className="p-3 border-t border-gray-200">
                          <a 
                            href="/dashboard/messages"
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Tümünü Gör
                          </a>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div id="user-menu-trigger" className="relative flex items-center space-x-3 cursor-pointer select-none" onClick={() => setUserMenuOpen(prev => !prev)}>
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || 'Katılımcı'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
                {/* Dropdown */}
                {userMenuOpen && (
                  <div id="user-menu-dropdown" className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">Profil</a>
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