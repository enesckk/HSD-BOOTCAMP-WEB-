export interface User {
  id: string;
  marathonId: string;
  email: string;
  fullName: string;
  phone: string;
  university: string;
  department: string;
  teamRole: 'Lider' | 'Teknik Sorumlu' | 'Tasarımcı';
  role: 'PARTICIPANT' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  marathonId: string;
  email: string;
  fullName: string;
  phone: string;
  university: string;
  department: string;
  teamRole: 'Lider' | 'Teknik Sorumlu' | 'Tasarımcı';
  password: string;
}

export interface AuthResponse {
  user: User | Admin;
  token: string;
  refreshToken: string;
}

export interface MarathonId {
  id: string;
  marathonId: string;
  isUsed: boolean;
  createdAt: string;
  usedAt?: string;
  usedBy?: string;
}




