import { User } from './user';
import { Team } from './team';

export interface Application {
  id: string;
  userId: string;
  teamId?: string;
  status: ApplicationStatus;
  fullName: string;
  phone: string;
  university: string;
  department: string;
  projectIdea: string;
  youtubeVideo: string;
  logicQuestion1: string;
  logicQuestion2: string;
  createdAt: Date;
  updatedAt: Date;

  // İlişkiler
  user: User;
  team?: Team;
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WAITLIST = 'WAITLIST'
}

export interface CreateApplicationData {
  fullName: string;
  phone: string;
  university: string;
  department: string;
  projectIdea: string;
  youtubeVideo: string;
  logicQuestion1: string;
  logicQuestion2: string;
}

export interface UpdateApplicationData {
  fullName?: string;
  phone?: string;
  university?: string;
  department?: string;
  projectIdea?: string;
  youtubeVideo?: string;
  logicQuestion1?: string;
  logicQuestion2?: string;
  status?: ApplicationStatus;
}


