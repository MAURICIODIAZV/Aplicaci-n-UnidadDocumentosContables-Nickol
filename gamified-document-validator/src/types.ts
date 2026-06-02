export interface UserProfile {
  name: string;
  role: string;
  email: string;
  avatar: string;
  gender?: 'Hombre' | 'Mujer' | string;
  isRegistered?: boolean;
}

export interface Stats {
  totalXP: number;
  streakDays: number;
  totalDocsProcessed: number;
}

export interface Settings {
  forceEarlyBirdMultiplier: boolean;
}

export interface Document {
  id: string;
  type: 'Factura' | 'Gasto' | 'Contrato' | string;
  name: string;
  date: string; // The selected day label: "May 29", "May 30", "May 31", "Hoy", "Jun 02", "Jun 03", "Jun 04"
  amount: number;
  status: 'pending' | 'completed';
  hasExcelLink: boolean;
  fieldsValidated: boolean;
  uploadedSameDay: boolean;
  fileDataUrl?: string;
  fileMime?: string;
}

export type ViewType = 'Progress' | 'Library' | 'Upload' | 'Excel' | 'History' | 'Profile';

export interface FloatingXP {
  id: string;
  xp: number;
  x: number;
  y: number;
}

export interface DateOption {
  key: string;      // e.g. "May 29"
  label: string;    // e.g. "May 29"
  relative: string; // e.g. "3 días antes" or "Hoy"
}

export interface LevelReward {
  level: number;
  name: string;
  description: string;
  badge: string;
  type: string;
}
