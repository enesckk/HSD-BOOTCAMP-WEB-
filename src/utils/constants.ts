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


// ----- HSD Şehir Haritası - Veri Seti (Hero haritası için) -----
export type CityPoint = {
  key: string;
  name: string;
  x: number; // soldan %
  y: number; // üstten %
  bootcamps: number;
  universities: number;
};

// Not: Bu koordinatlar `public/tr.png` görseli 600x600 kare alan içinde object-contain ile
// kullanıldığında haritanın genel oranına göre yaklaşık konumlandırma sağlar.
export const ACTIVE_CITY_POINTS: CityPoint[] = [
  { key: 'istanbul', name: 'İstanbul', x: 8.5, y: 23.5, bootcamps: 1, universities: 1 },
  { key: 'kocaeli', name: 'Kocaeli', x: 13.1, y: 24.9, bootcamps: 1, universities: 1 },
  { key: 'sakarya', name: 'Sakarya', x: 15.5, y: 26.2, bootcamps: 1, universities: 1 },
  { key: 'tekirdag', name: 'Tekirdağ', x: 5.2, y: 24.9, bootcamps: 1, universities: 1 },
  { key: 'kirklareli', name: 'Kırklareli', x: 5.7, y: 18.8, bootcamps: 1, universities: 1 },
  { key: 'yalova', name: 'Yalova', x: 11.3, y: 28.1, bootcamps: 1, universities: 1 },
  { key: 'bursa', name: 'Bursa', x: 10.3, y: 30.8, bootcamps: 1, universities: 1 },
  { key: 'balikesir', name: 'Balıkesir', x: 9.0, y: 36.8, bootcamps: 1, universities: 1 },
  { key: 'canakkale', name: 'Çanakkale', x: 3.6, y: 35.8, bootcamps: 1, universities: 1 },
  { key: 'izmir', name: 'İzmir', x: 7.7, y: 44.3, bootcamps: 1, universities: 1 },
  { key: 'manisa', name: 'Manisa', x: 9.6, y: 44.8, bootcamps: 1, universities: 1 },
  { key: 'aydin', name: 'Aydın', x: 8.9, y: 50.6, bootcamps: 1, universities: 1 },
  { key: 'mugla', name: 'Muğla', x: 9.3, y: 56.1, bootcamps: 1, universities: 1 },
  { key: 'denizli', name: 'Denizli', x: 13.1, y: 50.7, bootcamps: 1, universities: 1 },
  { key: 'kutahya', name: 'Kütahya', x: 13.6, y: 39.4, bootcamps: 1, universities: 1 },
  { key: 'eskisehir', name: 'Eskişehir', x: 16.7, y: 35.7, bootcamps: 1, universities: 1 },
  { key: 'ankara', name: 'Ankara', x: 23.7, y: 33.7, bootcamps: 1, universities: 1 },
  { key: 'konya', name: 'Konya', x: 23.5, y: 46.0, bootcamps: 1, universities: 1 },
  { key: 'karaman', name: 'Karaman', x: 26.8, y: 51.1, bootcamps: 1, universities: 1 },
  { key: 'kayseri', name: 'Kayseri', x: 31.6, y: 39.8, bootcamps: 1, universities: 1 },
  { key: 'nevsehir', name: 'Nevşehir', x: 29.4, y: 39.9, bootcamps: 1, universities: 1 },
  { key: 'sivas', name: 'Sivas', x: 35.0, y: 36.9, bootcamps: 1, universities: 1 },
  { key: 'erzincan', name: 'Erzincan', x: 41.6, y: 35.6, bootcamps: 1, universities: 1 },
  { key: 'erzurum', name: 'Erzurum', x: 47.0, y: 33.4, bootcamps: 1, universities: 1 },
  { key: 'rize', name: 'Rize', x: 55.3, y: 30.9, bootcamps: 1, universities: 1 },
  { key: 'artvin', name: 'Artvin', x: 58.0, y: 30.5, bootcamps: 1, universities: 1 },
  { key: 'ardahan', name: 'Ardahan', x: 58.4, y: 27.6, bootcamps: 1, universities: 1 },
  { key: 'malatya', name: 'Malatya', x: 40.6, y: 42.6, bootcamps: 1, universities: 1 },
  { key: 'elazig', name: 'Elazığ', x: 42.8, y: 41.7, bootcamps: 1, universities: 1 },
  { key: 'bingol', name: 'Bingöl', x: 45.2, y: 40.8, bootcamps: 1, universities: 1 },
  { key: 'sanliurfa', name: 'Şanlıurfa', x: 43.1, y: 55.7, bootcamps: 1, universities: 1 },
  { key: 'gaziantep', name: 'Gaziantep', x: 40.7, y: 57.0, bootcamps: 1, universities: 1 },
  { key: 'adana', name: 'Adana', x: 34.5, y: 56.0, bootcamps: 1, universities: 1 },
  { key: 'mersin', name: 'Mersin', x: 32.4, y: 57.3, bootcamps: 1, universities: 1 },
  { key: 'hatay', name: 'Hatay', x: 37.8, y: 63.0, bootcamps: 1, universities: 1 },
  { key: 'osmaniye', name: 'Osmaniye', x: 36.2, y: 58.2, bootcamps: 1, universities: 1 },
  { key: 'antalya', name: 'Antalya', x: 23.7, y: 59.1, bootcamps: 1, universities: 1 },
  { key: 'isparta', name: 'Isparta', x: 20.8, y: 51.2, bootcamps: 1, universities: 1 },
  { key: 'zonguldak', name: 'Zonguldak', x: 18.2, y: 26.6, bootcamps: 1, universities: 1 },
  { key: 'karabuk', name: 'Karabük', x: 20.8, y: 27.8, bootcamps: 1, universities: 1 },
  { key: 'bartin', name: 'Bartın', x: 19.6, y: 25.3, bootcamps: 1, universities: 1 },
];

export const getTotalsFromCities = (cities: CityPoint[]) => {
  const cityCount = cities.length;
  const totalUniversities = cities.reduce((acc, c) => acc + c.universities, 0);
  const totalBootcamps = cities.reduce((acc, c) => acc + c.bootcamps, 0);
  return { cityCount, totalUniversities, totalBootcamps };
};