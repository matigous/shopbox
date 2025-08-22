// src/app/pages/login/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card mt-5">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">Login</h2>

              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Usuário:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    [(ngModel)]="credentials.username"
                    name="username"
                    required>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Senha:</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    [(ngModel)]="credentials.password"
                    name="password"
                    required>
                </div>

                @if (error()) {
                  <div class="alert alert-danger" role="alert">
                    {{ error() }}
                  </div>
                }

                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="loading()">
                    @if (loading()) {
                      <span class="spinner-border spinner-border-sm me-2"></span>
                    }
                    Entrar
                  </button>
                </div>
              </form>

              <div class="mt-3 text-center">
                <small class="text-muted">
                  Usuário de teste: mor_2314<br>
                  Senha de teste: 83r5^_
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public credentials = {
    username: '',
    password: ''
  };

  public loading = signal<boolean>(false);
  public error = signal<string>('');

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error.set('Por favor, preencha todos os campos');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Credenciais inválidas. Tente novamente.');
      }
    });
  }
}
