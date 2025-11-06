export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}
