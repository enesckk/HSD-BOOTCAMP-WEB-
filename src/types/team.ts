import { User } from './user';

export interface Team {
  id: string;
  name: string;
  description?: string;
  projectName?: string;
  projectDescription?: string;
  status: TeamStatus;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  user: User;
}

export enum TeamRole {
  DESIGNER = 'DESIGNER',
  RESEARCHER = 'RESEARCHER',
  DEVELOPER = 'DEVELOPER',
  LEADER = 'LEADER'
}

export enum TeamStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE'
}

export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  projectName?: string;
  projectDescription?: string;
}


