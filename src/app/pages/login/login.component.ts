import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
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

  constructor(public translate: TranslateService) {
    this.translate.use('pt-BR');
  }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error.set('Por favor, preencha todos os campos');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.token) {
          this.loading.set(false);
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        this.loading.set(false);
        this.error.set('Credenciais inválidas. Tente novamente.');
      }
    });
  }
}
