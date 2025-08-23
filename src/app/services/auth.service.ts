import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, from } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MockApiService } from './mock-api.service';
import authMockJson from '../../assets/mocks/auth.json';

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
  public isLoggedIn = signal<boolean>(this.hasToken());
  public currentUser = signal<string | null>(this.getStoredUsername());

  constructor() {
    if (!environment.apiUrl) {
      this.mock.seed('auth/login', authMockJson);
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
    if (!this.apiUrl)
      return from(this.mock.auth('auth/login', credentials.username))
        .pipe(
          tap(response => {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('username', credentials.username);
            this.isLoggedIn.set(true);
            this.currentUser.set(credentials.username);
          })
        );

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
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
