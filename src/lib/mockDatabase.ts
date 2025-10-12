import { User, Admin } from '@/types/user';

// Shared mock database for all API routes
export const mockUsers: (User | Admin)[] = [
  // Admin kullanıcı
  {
    id: 'admin-1',
    email: 'admin@huawei.com',
    fullName: 'Huawei Admin',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Katılımcı kullanıcılar (örnek)
  {
    id: 'user-1',
    marathonId: 'MAR001',
    email: 'test@example.com',
    fullName: 'Test User',
    phone: '+905551234567',
    university: 'Test University',
    department: 'Computer Science',
    teamRole: 'Lider',
    role: 'participant',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Mock password hash (gerçek projede database'den gelecek)
export const mockPasswords: { [key: string]: string } = {
  'admin@huawei.com': '$2b$10$g1XCSo7DilPRSLwSzUA2z.sf.qLaTpcul3IDe.GiWORdcL.6HtSNK', // admin123
  'test@example.com': '$2b$10$g1XCSo7DilPRSLwSzUA2z.sf.qLaTpcul3IDe.GiWORdcL.6HtSNK', // admin123
};

// Mock marathon IDs
export const mockMarathonIds: { [key: string]: boolean } = {};

// 100 adet marathon ID oluştur
for (let i = 1; i <= 100; i++) {
  const marathonId = `MAR${i.toString().padStart(3, '0')}`;
  mockMarathonIds[marathonId] = false; // false = kullanılmamış
}

// JWT Secret
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '7d';
export const REFRESH_TOKEN_EXPIRES_IN = '30d';






