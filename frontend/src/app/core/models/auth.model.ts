import { User } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    createdAt: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface ProfileResponse {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}
