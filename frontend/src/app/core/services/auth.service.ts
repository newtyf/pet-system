import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ProfileResponse,
  User,
} from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            fullName: response.user.fullName,
            role: response.user.role as any,
            createdAt: response.user.createdAt,
          };
          localStorage.setItem('current_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/auth/register`, userData);
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          localStorage.removeItem('current_user');
          this.currentUserSubject.next(null);
        })
      );
  }

  loadProfile(): Observable<ProfileResponse> {
    return this.http
      .get<ProfileResponse>(`${this.API_URL}/auth/profile`, {
        withCredentials: true,
      })
      .pipe(
        tap((profile) => {
          const user: User = {
            id: profile.id,
            email: profile.email,
            fullName: profile.fullName,
            role: profile.role as any,
            createdAt: profile.createdAt,
          };
          localStorage.setItem('current_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  refreshToken(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
