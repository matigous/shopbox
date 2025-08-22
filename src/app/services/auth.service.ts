// src/app/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, from } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MockApiService } from './mocks/mock-api.service';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;
  private mock = new MockApiService();


  // Using signals for reactive state management
  // Signals são como "sinais de rádio" que notificam mudanças automaticamente
  public isLoggedIn = signal<boolean>(this.hasToken());
  public currentUser = signal<string | null>(this.getStoredUsername());

  constructor() {
    if (!environment.apiUrl) {
      this.mock.seed('auth/login', [
        { username: 'user1', password: 'password1', token: 'token1' },
        { username: 'user2', password: 'password2', token: 'token2' }
      ]);
    }

    this.checkExistingAuth();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  private getStoredUsername(): string | null {
    return localStorage.getItem('username');
  }

  private checkExistingAuth(): void {
    const token = localStorage.getItem('auth_token');
    const username = localStorage.getItem('username');

    if (token && username) {
      this.isLoggedIn.set(true);
      this.currentUser.set(username);
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const observable = !this.apiUrl ? from(this.mock.get('auth/login', credentials.username)) :
      this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);

    return observable
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('username', credentials.username);
          this.isLoggedIn.set(true);
          this.currentUser.set(credentials.username);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');

    this.isLoggedIn.set(false);
    this.currentUser.set(null);

    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
