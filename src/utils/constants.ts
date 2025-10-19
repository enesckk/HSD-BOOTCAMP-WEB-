export const APP_NAME = 'HSD Türkiye Bootcamp';
export const APP_DESCRIPTION = 'HSD Türkiye - Teknoloji ve İnovasyon Eğitimleri';


export const TEAM_ROLES = {
  LEADER: 'Lider',
  TECHNICAL: 'Teknik Sorumlu',
  DESIGNER: 'Tasarımcı',
} as const;

export const APPLICATION_STATUS = {
  PENDING: 'Beklemede',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
  WAITLIST: 'Bekleme Listesi',
} as const;

export const TEAM_STATUS = {
  PENDING: 'Beklemede',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
  ACTIVE: 'Aktif',
} as const;

export const EVALUATION_CRITERIA = {
  SOCIAL_VALUE: 'Toplumsal Değer',
  FEASIBILITY: 'Uygulanabilirlik',
  INNOVATION: 'Yenilikçilik',
  SUSTAINABILITY: 'Sürdürülebilirlik',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
  },
  APPLICATIONS: {
    BASE: '/api/applications',
    MY_APPLICATION: '/api/applications/my-application',
  },
  ANNOUNCEMENTS: {
    BASE: '/api/announcements',
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'afet_maratonu_token',
  USER: 'afet_maratonu_user',
  THEME: 'afet_maratonu_theme',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const FILE_UPLOADS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
} as const;

